<template>
  <the-navbar/>
  <div class="container">
    <router-view v-show="showPage" @ready="showPage = true"/>
    <div v-show="!showPage" class="push-top">loading...</div>
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar'
import { mapActions } from 'vuex'
export default {
  name: 'App',
  components: { TheNavbar },
  data () {
    return {
      showPage: false
    }
  },
  methods: {
    ...mapActions(['fetchAuthUser'])
  },
  created () {
    this.fetchAuthUser()
    this.$router.beforeEach(() => {
      this.showPage = false
    })
  }
}
</script>

<style>
@import "assets/style.css";
</style>
