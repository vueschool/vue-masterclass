import { makeAppendChildToParentMutation } from '@/helpers'
export default {
  namespaced: true,
  state: {
    items: []
  },
  getters: {},
  actions: {
    fetchForum: ({ dispatch }, { id }) => dispatch('fetchItem',
      { emoji: '🏁', resource: 'forums', id },
      { root: true }
    ),
    fetchForums: ({ dispatch }, { ids }) => dispatch('fetchItems',
      { resource: 'forums', ids, emoji: '🏁' },
      { root: true }
    )
  },
  mutations: {
    appendThreadToForum: makeAppendChildToParentMutation({ parent: 'forums', child: 'threads' })
  }
}
