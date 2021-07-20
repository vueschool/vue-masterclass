import { createStore } from 'vuex'
import getters from '@/store/getters'
import actions from '@/store/actions'
import mutations from '@/store/mutations'
import categories from './modules/categories'
import forums from './modules/forums'
import threads from './modules/threads'
import posts from './modules/posts'
import users from './modules/users'
import auth from './modules/auth'
export default createStore({
  modules: {
    categories,
    forums,
    threads,
    posts,
    users,
    auth
  },
  state: {
    unsubscribes: []
  },
  getters,
  actions,
  mutations
})
