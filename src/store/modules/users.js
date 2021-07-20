import firebase from 'firebase'
import { docToResource, makeAppendChildToParentMutation, findById } from '@/helpers'
export default {
  state: {
    items: []
  },
  getters: {
    user: state => {
      return (id) => {
        const user = findById(state.items, id)
        if (!user) return null
        return {
          ...user,
          get posts () {
            return state.posts.filter(post => post.userId === user.id)
          },
          get postsCount () {
            return user.postsCount || 0
          },
          get threads () {
            return state.threads.filter(post => post.userId === user.id)
          },
          get threadsCount () {
            return user.threads?.length || 0
          }
        }
      }
    }
  },
  actions: {
    async createUser ({ commit }, { id, email, name, username, avatar = null }) {
      const registeredAt = firebase.firestore.FieldValue.serverTimestamp()
      const usernameLower = username.toLowerCase()
      email = email.toLowerCase()
      const user = { avatar, email, name, username, usernameLower, registeredAt }
      const userRef = await firebase.firestore().collection('users').doc(id)
      userRef.set(user)
      const newUser = await userRef.get()
      commit('setItem', { resource: 'users', item: newUser })
      return docToResource(newUser)
    },
    async updateUser ({ commit }, user) {
      const updates = {
        avatar: user.avatar || null,
        username: user.username || null,
        name: user.name || null,
        bio: user.bio || null,
        website: user.website || null,
        email: user.email || null,
        location: user.location || null
      }
      const userRef = firebase.firestore().collection('users').doc(user.id)
      await userRef.update(updates)
      commit('setItem', { resource: 'users', item: user })
    },
    fetchUser: ({ dispatch }, { id }) => dispatch('fetchItem', { emoji: '🙋', resource: 'users', id }),
    fetchUsers: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'users', ids, emoji: '🙋' })
  },
  mutations: {
    appendThreadToUser: makeAppendChildToParentMutation({ parent: 'users', child: 'threads' })
  }
}
