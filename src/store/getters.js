import { findById } from '@/helpers'
export default {
  authUser: (state, getters) => {
    return getters.user(state.authId)
  },
  user: state => {
    return (id) => {
      const user = findById(state.users, id)
      if (!user) return null
      return {
        ...user,
        get posts () {
          return state.posts.filter(post => post.userId === user.id)
        },
        get postsCount () {
          return user.postsCount || 0
        },
        get threads () {
          return state.threads.filter(post => post.userId === user.id)
        },
        get threadsCount () {
          return user.threads?.length || 0
        }
      }
    }
  },
  thread: state => {
    return (id) => {
      const thread = findById(state.threads, id)
      if (!thread) return {}
      return {
        ...thread,
        get author () {
          return findById(state.users, thread.userId)
        },
        get repliesCount () {
          return thread.posts.length - 1
        },
        get contributorsCount () {
          return thread.contributors.length
        }
      }
    }
  }
}
