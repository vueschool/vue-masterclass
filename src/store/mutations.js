import { upsert, docToResource } from '@/helpers'
export default {
  setItem (state, { resource, item }) {
    upsert(state[resource].items, docToResource(item))
  },
  appendUnsubscribe (state, { unsubscribe }) {
    state.unsubscribes.push(unsubscribe)
  },
  clearAllUnsubscribes (state) {
    state.unsubscribes = []
  }
}
