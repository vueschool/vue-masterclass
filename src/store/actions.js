import { db } from '@/helpers/firebase'
import { doc, onSnapshot } from 'firebase/firestore'
import { findById } from '@/helpers'
export default {
  fetchItem(
    { state, commit },
    { id, resource, handleUnsubscribe = null, once = false, callBack = null }
  ) {
    return new Promise(resolve => {
      const docRef = doc(db, resource, id)
      const unsubscribe = onSnapshot(docRef, doc => {
        if (once) unsubscribe()

        if (doc.exists()) {
          const item = { ...doc.data(), id: doc.id }
          let previousItem = findById(state[resource].items, id)
          previousItem = previousItem ? { ...previousItem } : null
          commit('setItem', { resource, item })
          if (typeof callBack === 'function') {
            const isLocal = doc.metadata.hasPendingWrites
            callBack({ item: { ...item }, previousItem, isLocal })
          }
          resolve(item)
        } else {
          resolve(null)
        }
      })
      if (handleUnsubscribe) {
        handleUnsubscribe(unsubscribe)
      } else {
        commit('appendUnsubscribe', { unsubscribe })
      }
    })
  },
  fetchItems({ dispatch }, { ids, resource, emoji, callBack = null }) {
    ids = ids || []
    return Promise.all(
      ids.map(id => dispatch('fetchItem', { id, resource, emoji, callBack }))
    )
  },
  async unsubscribeAllSnapshots({ state, commit }) {
    state.unsubscribes.forEach(unsubscribe => unsubscribe())
    commit('clearAllUnsubscribes')
  },
  clearItems({ commit }, { modules = [] }) {
    commit('clearItems', { modules })
  }
}
