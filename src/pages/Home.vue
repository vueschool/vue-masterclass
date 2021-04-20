<template>
  <h1 class="push-top">Welcome to the Forum</h1>
  <CategoryList :categories="categories"/>
</template>

<script>
import CategoryList from '@/components/CategoryList'
export default {
  components: {
    CategoryList
  },
  computed: {
    categories () {
      return this.$store.state.categories
    }
  },
  beforeCreate () {
    console.log('before create', this.categories)
  },
  created () {
    console.log('created', this.categories)
  },
  beforeMount () {
    console.log('beforeMount', this.categories)
  },
  mounted () {
    console.log('mounted', this.categories, this.$el)
  },
  beforeUnmount () {
    console.log('beforeUnmount', this.categories, this.$el)
  },
  unmounted () {
    console.log('unmounted', this.categories)
  }
}
</script>
