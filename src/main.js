import { createApp } from 'vue'
import App from './App.vue'
import PageHome from '@/components/PageHome'
import PageThreadShow from '@/components/PageThreadShow'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: PageHome
  },
  {
    path: '/thread/:id',
    name: 'ThreadShow',
    component: PageThreadShow,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const forumApp = createApp(App)
forumApp.use(router)
forumApp.mount('#app')
