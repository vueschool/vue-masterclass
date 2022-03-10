import { db } from '@/helpers/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { makeFetchItemAction, makeFetchItemsAction } from '@/helpers'
export default {
  namespaced: true,
  state: {
    items: []
  },

  getters: {},

  actions: {
    fetchCategory: makeFetchItemAction({ emoji: '🏷', resource: 'categories' }),
    fetchCategories: makeFetchItemsAction({
      emoji: '🏷',
      resource: 'categories'
    }),

    fetchAllCategories({ commit }) {
      return new Promise(resolve => {
        getDocs(collection(db, 'categories')).then(querySnapshot => {
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
