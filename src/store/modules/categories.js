import firebase from '@/helpers/firebase'
import { makeFetchItemAction, makeFetchItemsAction } from '@/helpers'
export default {
  namespaced: true,
  state: {
    items: []
  },
  getters: {},
  actions: {
    fetchCategory: makeFetchItemAction({ emoji: '🏷', resource: 'categories' }),
    fetchCategories: makeFetchItemsAction({ emoji: '🏷', resource: 'categories' }),
    fetchAllCategories ({ commit }) {
      console.log('🔥', '🏷', 'all')
      return new Promise((resolve) => {
        firebase.firestore().collection('categories').onSnapshot((querySnapshot) => {
          const categories = querySnapshot.docs.map(doc => {
            const item = { id: doc.id, ...doc.data() }
            commit('setItem', { resource: 'categories', item }, { root: true })
            return item
          })
          resolve(categories)
        })
      })
    }
  },
  mutations: {}
}
