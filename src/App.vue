<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <div class="container">
    <page-home/>
  </div>
</template>

<script>
import PageHome from '@/components/PageHome'
export default {
  name: 'App',
  components: {
    PageHome
  }
}
</script>

<style>
@import "assets/style.css";
</style>
