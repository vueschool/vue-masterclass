import { createStore } from 'vuex'
import sourceData from '@/data'
import { findById, upsert } from '@/helpers'
export default createStore({
  state: {
    ...sourceData,
    authId: 'VXjpr2WHa8Ux4Bnggym8QFLdv5C3'
  },
  getters: {
    authUser: state => {
      const user = findById(state.users, state.authId)
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
  actions: {
    createPost ({ commit, state }, post) {
      post.id = 'ggqq' + Math.random()
      post.userId = state.authId
      post.publishedAt = Math.floor(Date.now() / 1000)
      commit('setPost', { post }) // set the post
      commit('appendPostToThread', { childId: post.id, parentId: post.threadId }) // append post to thread
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
    }
  },
  mutations: {
    setPost (state, { post }) {
      upsert(state.posts, post)
    },
    setThread (state, { thread }) {
      upsert(state.threads, thread)
    },
    setUser (state, { user, userId }) {
      const userIndex = state.users.findIndex(user => user.id === userId)
      state.users[userIndex] = user
    },
    appendPostToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'posts' }),
    appendThreadToForum: makeAppendChildToParentMutation({ parent: 'forums', child: 'threads' }),
    appendThreadToUser: makeAppendChildToParentMutation({ parent: 'users', child: 'threads' })
  }
})

function makeAppendChildToParentMutation ({ parent, child }) {
  return (state, { childId, parentId }) => {
    const resource = findById(state[parent], parentId)
    resource[child] = resource[child] || []
    resource[child].push(childId)
  }
}
