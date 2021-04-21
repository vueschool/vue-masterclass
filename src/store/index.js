import { createStore } from 'vuex'
import { findById, upsert } from '@/helpers'
import firebase from 'firebase'
export default createStore({
  state: {
    categories: [],
    forums: [],
    threads: [],
    posts: [],
    users: [],
    authId: 'VXjpr2WHa8Ux4Bnggym8QFLdv5C3'
  },
  getters: {
    authUser: (state, getters) => {
      return getters.user(state.authId)
    },
    user: state => {
      return (id) => {
        const user = findById(state.users, id)
        if (!user) return null
        return {
          ...user,
          get posts () {
            return state.posts.filter(post => post.userId === user.id)
          },
          get postsCount () {
            return this.posts.length
          },
          get threads () {
            return state.threads.filter(post => post.userId === user.id)
          },
          get threadsCount () {
            return this.threads.length
          }
        }
      }
    },
    thread: state => {
      return (id) => {
        const thread = findById(state.threads, id)
        return {
          ...thread,
          get author () {
            return findById(state.users, thread.userId)
          },
          get repliesCount () {
            return thread.posts.length - 1
          },
          get contributorsCount () {
            return thread.contributors.length
          }
        }
      }
    }
  },
  actions: {
    createPost ({ commit, state }, post) {
      post.id = 'ggqq' + Math.random()
      post.userId = state.authId
      post.publishedAt = Math.floor(Date.now() / 1000)
      commit('setPost', { post }) // set the post
      commit('appendPostToThread', { childId: post.id, parentId: post.threadId }) // append post to thread
      commit('appendContributorToThread', { childId: state.authId, parentId: post.threadId })
    },
    async createThread ({ commit, state, dispatch }, { text, title, forumId }) {
      const id = 'ggqq' + Math.random()
      const userId = state.authId
      const publishedAt = Math.floor(Date.now() / 1000)
      const thread = { forumId, title, publishedAt, userId, id }
      commit('setThread', { thread })
      commit('appendThreadToUser', { parentId: userId, childId: id })
      commit('appendThreadToForum', { parentId: forumId, childId: id })
      dispatch('createPost', { text, threadId: id })
      return findById(state.threads, id)
    },
    async updateThread ({ commit, state }, { title, text, id }) {
      const thread = findById(state.threads, id)
      const post = findById(state.posts, thread.posts[0])
      const newThread = { ...thread, title }
      const newPost = { ...post, text }
      commit('setThread', { thread: newThread })
      commit('setPost', { post: newPost })
      return newThread
    },
    updateUser ({ commit }, user) {
      commit('setUser', { user, userId: user.id })
    },
    fetchThread ({ state, commit }, { id }) {
      console.log('🔥📄', id)
      return new Promise((resolve) => {
        firebase.firestore().collection('threads').doc(id).onSnapshot((doc) => {
          const thread = { ...doc.data(), id: doc.id }
          commit('setThread', { thread })
          resolve(thread)
        })
      })
    },
    fetchUser ({ state, commit }, { id }) {
      console.log('🔥🙋', id)
      return new Promise((resolve) => {
        firebase.firestore().collection('users').doc(id).onSnapshot((doc) => {
          const user = { ...doc.data(), id: doc.id }
          commit('setUser', { user })
          resolve(user)
        })
      })
    },
    fetchPost ({ state, commit }, { id }) {
      console.log('🔥💬', id)
      return new Promise((resolve) => {
        firebase.firestore().collection('posts').doc(id).onSnapshot((doc) => {
          const post = { ...doc.data(), id: doc.id }
          commit('setPost', { post })
          resolve(post)
        })
      })
    }
  },
  mutations: {
    setPost (state, { post }) {
      upsert(state.posts, post)
    },
    setThread (state, { thread }) {
      upsert(state.threads, thread)
    },
    setUser (state, { user }) {
      upsert(state.users, user)
    },
    appendPostToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'posts' }),
    appendThreadToForum: makeAppendChildToParentMutation({ parent: 'forums', child: 'threads' }),
    appendThreadToUser: makeAppendChildToParentMutation({ parent: 'users', child: 'threads' }),
    appendContributorToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'contributors' })
  }
})

function makeAppendChildToParentMutation ({ parent, child }) {
  return (state, { childId, parentId }) => {
    const resource = findById(state[parent], parentId)
    resource[child] = resource[child] || []
    const test = resource.posts || []

    if (!resource[child].includes(childId)) {
      resource[child].push(childId)
    }
  }
}
