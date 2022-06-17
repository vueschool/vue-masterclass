import { defineStore } from 'pinia'
import store from '@/store'
import firebase from '@/helpers/firebase'
import useNotifications from '@/composables/useNotifications'

export const useAuthStore = defineStore('AuthStore', {
  state: () => {
    return {
      authId: null,
      authUserUnsubscribe: null,
      authObserverUnsubscribe: null
    }
  },
  getters: {
    authUser: (state) => {
      return store.getters['users/user'](state.authId)
    }
  },
  actions: {
    signInWithEmailAndPassword ({ email, password }) {
      return firebase.auth().signInWithEmailAndPassword(email, password)
    },
    async signOut () {
      await firebase.auth().signOut()
      this.authId = null
    },
    async updateEmail ({ email }) {
      return firebase.auth().currentUser.updateEmail(email)
    },
    async reauthenticate ({ email, password }) {
      const credential = firebase.auth.EmailAuthProvider.credential(email, password)
      await firebase.auth().currentUser.reauthenticateWithCredential(credential)
    },
    initAuthentication () {
      if (this.authObserverUnsubscribe) this.authObserverUnsubscribe()
      return new Promise((resolve) => {
        const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          this.unsubscribeAuthUserSnapshot()
          if (user) {
            await this.fetchAuthUser()
            resolve(user)
          } else {
            resolve(null)
          }
        })
        this.authObserverUnsubscribe = unsubscribe
      })
    },
    async registerUserWithEmailAndPassword ({ avatar = null, email, name, username, password }) {
      const result = await firebase.auth().createUserWithEmailAndPassword(email, password)
      avatar = await this.uploadAvatar({ authId: result.user.uid, file: avatar })
      await store.dispatch('users/createUser', { id: result.user.uid, email, name, username, avatar }, { root: true })
    },
    async uploadAvatar ({ authId, file, filename }) {
      if (!file) return null
      authId = authId || this.authId
      filename = filename || file.name
      try {
        const storageBucket = firebase.storage().ref().child(`uploads/${authId}/images/${Date.now()}-${filename}`)
        const snapshot = await storageBucket.put(file)
        const url = await snapshot.ref.getDownloadURL()
        return url
      } catch (error) {
        const { addNotification } = useNotifications()
        addNotification({ message: 'Error uploading avatar image', type: 'error' })
      }
    },
    async signInWithGoogle () {
      const provider = new firebase.auth.GoogleAuthProvider()
      const response = await firebase.auth().signInWithPopup(provider)
      const user = response.user
      const userRef = firebase.firestore().collection('users').doc(user.uid)
      const userDoc = await userRef.get()
      if (!userDoc.exists) {
        return store.dispatch('users/createUser',
          { id: user.uid, name: user.displayName, email: user.email, username: user.email, avatar: user.photoURL },
          { root: true }
        )
      }
    },
    async fetchAuthUser () {
      const userId = firebase.auth().currentUser?.uid
      if (!userId) return
      await store.dispatch('fetchItem', {
        emoji: '🙋',
        resource: 'users',
        id: userId,
        handleUnsubscribe: (unsubscribe) => {
          this.authUserUnsubscribe = unsubscribe
        }
      })
      this.authId = userId
    },
    async fetchAuthUsersPosts ({ startAfter }) {
      // limit(10)
      // startAfter(doc)
      // orderBy()
      let query = await firebase.firestore().collection('posts')
        .where('userId', '==', this.authId)
        .orderBy('publishedAt', 'desc')
        .limit(10)
      if (startAfter) {
        const doc = await firebase.firestore().collection('posts').doc(startAfter.id).get()
        query = query.startAfter(doc)
      }
      const posts = await query.get()
      posts.forEach(item => {
        store.commit('setItem', { resource: 'posts', item }, { root: true })
      })
    },
    async unsubscribeAuthUserSnapshot () {
      if (this.authUserUnsubscribe) {
        this.authUserUnsubscribe()
        this.authObserverUnsubscribe = null
      }
    }
  }
})
