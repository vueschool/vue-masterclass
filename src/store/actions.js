import firebase from 'firebase'
import { findById } from '@/helpers'
export default {
  async createPost ({ commit, state }, post) {
    post.userId = state.authId
    post.publishedAt = firebase.firestore.FieldValue.serverTimestamp()
    const batch = firebase.firestore().batch()
    const postRef = firebase.firestore().collection('posts').doc()
    const threadRef = firebase.firestore().collection('threads').doc(post.threadId)
    const userRef = firebase.firestore().collection('users').doc(state.authId)
    batch.set(postRef, post)
    batch.update(threadRef, {
      posts: firebase.firestore.FieldValue.arrayUnion(postRef.id),
      contributors: firebase.firestore.FieldValue.arrayUnion(state.authId)
    })
    batch.update(userRef, {
      postsCount: firebase.firestore.FieldValue.increment(1)
    })
    await batch.commit()
    const newPost = await postRef.get()
    commit('setItem', { resource: 'posts', item: { ...newPost.data(), id: newPost.id } }) // set the post
    commit('appendPostToThread', { childId: newPost.id, parentId: post.threadId }) // append post to thread
    commit('appendContributorToThread', { childId: state.authId, parentId: post.threadId })
  },
  async createThread ({ commit, state, dispatch }, { text, title, forumId }) {
    const userId = state.authId
    const publishedAt = firebase.firestore.FieldValue.serverTimestamp()
    const threadRef = firebase.firestore().collection('threads').doc()
    const thread = { forumId, title, publishedAt, userId, id: threadRef.id }
    const userRef = firebase.firestore().collection('users').doc(userId)
    const forumRef = firebase.firestore().collection('forums').doc(forumId)
    const batch = firebase.firestore().batch()

    batch.set(threadRef, thread)
    batch.update(userRef, {
      threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id)
    })
    batch.update(forumRef, {
      threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id)
    })
    await batch.commit()
    const newThread = await threadRef.get()

    commit('setItem', { resource: 'threads', item: { ...newThread.data(), id: newThread.id } })
    commit('appendThreadToUser', { parentId: userId, childId: threadRef.id })
    commit('appendThreadToForum', { parentId: forumId, childId: threadRef.id })
    await dispatch('createPost', { text, threadId: threadRef.id })
    return findById(state.threads, threadRef.id)
  },
  async updateThread ({ commit, state }, { title, text, id }) {
    const thread = findById(state.threads, id)
    const post = findById(state.posts, thread.posts[0])
    const newThread = { ...thread, title }
    const newPost = { ...post, text }
    commit('setItem', { resource: 'threads', item: newThread })
    commit('setItem', { resource: 'posts', item: newPost })
    return newThread
  },
  updateUser ({ commit }, user) {
    commit('setItem', { resource: 'users', item: user })
  },
  // ---------------------------------------
  // Fetch Single Resource
  // ---------------------------------------
  fetchCategory: ({ dispatch }, { id }) => dispatch('fetchItem', { emoji: '🏷', resource: 'categories', id }),
  fetchForum: ({ dispatch }, { id }) => dispatch('fetchItem', { emoji: '🏁', resource: 'forums', id }),
  fetchThread: ({ dispatch }, { id }) => dispatch('fetchItem', { emoji: '📄', resource: 'threads', id }),
  fetchPost: ({ dispatch }, { id }) => dispatch('fetchItem', { emoji: '💬', resource: 'posts', id }),
  fetchUser: ({ dispatch }, { id }) => dispatch('fetchItem', { emoji: '🙋', resource: 'users', id }),
  fetchAuthUser: ({ dispatch, state }) => dispatch('fetchItem', { emoji: '🙋', resource: 'users', id: state.authId }),
  // ---------------------------------------
  // Fetch All of a Resource
  // ---------------------------------------
  fetchAllCategories ({ commit }) {
    console.log('🔥', '🏷', 'all')
    return new Promise((resolve) => {
      firebase.firestore().collection('categories').onSnapshot((querySnapshot) => {
        const categories = querySnapshot.docs.map(doc => {
          const item = { id: doc.id, ...doc.data() }
          commit('setItem', { resource: 'categories', item })
          return item
        })
        resolve(categories)
      })
    })
  },
  // ---------------------------------------
  // Fetch Multiple Resources
  // ---------------------------------------
  fetchCategories: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'categories', ids, emoji: '🏷' }),
  fetchForums: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'forums', ids, emoji: '🏁' }),
  fetchThreads: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'threads', ids, emoji: '📄' }),
  fetchPosts: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'posts', ids, emoji: '💬' }),
  fetchUsers: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'users', ids, emoji: '🙋' }),

  fetchItem ({ state, commit }, { id, emoji, resource }) {
    console.log('🔥', emoji, id)
    return new Promise((resolve) => {
      firebase.firestore().collection(resource).doc(id).onSnapshot((doc) => {
        const item = { ...doc.data(), id: doc.id }
        commit('setItem', { resource, item })
        resolve(item)
      })
    })
  },
  fetchItems ({ dispatch }, { ids, resource, emoji }) {
    return Promise.all(ids.map(id => dispatch('fetchItem', { id, resource, emoji })))
  }
}
