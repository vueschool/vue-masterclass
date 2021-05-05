<template>
  <the-navbar/>
  <div class="container">
    <router-view/>
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar'
import { mapActions } from 'vuex'
export default {
  name: 'App',
  components: { TheNavbar },
  methods: {
    ...mapActions(['fetchAuthUser'])
  },
  created () {
    this.fetchAuthUser()
  }
}
</script>

<style>
@import "assets/style.css";
</style>
