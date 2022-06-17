<template>
  <AppHead>
    <title>Vue.js 3 Master Class Forum</title>
    <meta name="description" content="An awesome Vue.js 3 powered forum!">

    <!-- Social -->
    <meta property="og:title" content="Vue.js 3 Master Class Forum">
    <meta property="og:description" content="An Awesome Vue.js 3 powered forum!">
    <meta property="og:image" content="https://vueschool.io/media/f007f6057444d9a7f567163391d2b366/vuejs-3-master-class-not-transparent.jpg">

    <!-- Twitter -->
    <meta name="twitter:title" content="Vue.js 3 Master Class Forum">
    <meta name="twitter:description" content="An Awesome Vue.js 3 powered forum!">
    <meta name="twitter:image" content="https://vueschool.io/media/f007f6057444d9a7f567163391d2b366/vuejs-3-master-class-not-transparent.jpg">
    <meta name="twitter:card" content="summary_large_image">
  </AppHead>
  <the-navbar/>
  <div class="container">
    <router-view v-show="showPage" @ready="onPageReady" :key="`${$route.path}${JSON.stringify($route.query)}`"/>
    <AppSpinner v-show="!showPage" />
    <AppNotifications />
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar'
import NProgress from 'nprogress'
import AppNotifications from '@/components/AppNotifications'
import { useAuthStore } from '@/stores/AuthStore'

export default {
  name: 'App',
  components: { TheNavbar, AppNotifications },
  setup () {
    const { fetchAuthUser } = useAuthStore()
    return { fetchAuthUser }
  },
  computed: {
    store () {
      return this.$store.state
    }
  },
  data () {
    return {
      showPage: false
    }
  },
  methods: {
    onPageReady () {
      this.showPage = true
      NProgress.done()
    }
  },
  created () {
    this.fetchAuthUser()
    NProgress.configure({
      speed: 200,
      showSpinner: false
    })
    this.$router.beforeEach(() => {
      this.showPage = false
      NProgress.start()
    })
  }
}
</script>

<style>
@import "assets/style.css";
@import "~nprogress/nprogress.css";
#nprogress .bar{
  background: #57AD8D !important;
}
</style>
