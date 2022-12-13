import { defineStore } from 'pinia'
import sourceData from '@/data.json'
export const useThreadsStore = defineStore('ThreadsStore', {
  state: () => {
    return {
      threads: sourceData.threads
    }
  },
  getters: {},
  actions: {}
})
