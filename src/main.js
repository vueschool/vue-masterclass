import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import firebase from 'firebase'
import firebaseConfig from '@/config/firebase'
import FontAwesome from '@/plugins/FontAwesome'

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
firebase.auth().onAuthStateChanged(user => {
  store.dispatch('unsubscribeAuthUserSnapshot')
  if (user) {
    store.dispatch('fetchAuthUser')
  }
})

const forumApp = createApp(App)
forumApp.use(router)
forumApp.use(store)
forumApp.use(FontAwesome)

const requireComponent = require.context('./components', true, /App[A-Z]\w+\.(vue|js)$/)
requireComponent.keys().forEach(function (fileName) {
  let baseComponentConfig = requireComponent(fileName)
  baseComponentConfig = baseComponentConfig.default || baseComponentConfig
  const baseComponentName = baseComponentConfig.name || (
    fileName
      .replace(/^.+\//, '')
      .replace(/\.\w+$/, '')
  )
  forumApp.component(baseComponentName, baseComponentConfig)
})

forumApp.mount('#app')
