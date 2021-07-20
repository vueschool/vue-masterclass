import firebase from 'firebase'
export default {
  state: {
    items: []
  },
  getters: {},
  actions: {
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
    async updatePost ({ commit, state }, { text, id }) {
      const post = {
        text,
        edited: {
          at: firebase.firestore.FieldValue.serverTimestamp(),
          by: state.authId,
          moderated: false
        }
      }
      const postRef = firebase.firestore().collection('posts').doc(id)
      await postRef.update(post)
      const updatedPost = await postRef.get()
      commit('setItem', { resource: 'posts', item: updatedPost })
    },
    fetchPost: ({ dispatch }, { id }) => dispatch('fetchItem', { emoji: '💬', resource: 'posts', id }),
    fetchPosts: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'posts', ids, emoji: '💬' })
  },
  mutations: {}
}
