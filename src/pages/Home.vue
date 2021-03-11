<template>
  <h1>Welcome to the Forum</h1>
  <ForumList :forums="forums"/>
</template>

<script>
import ForumList from '@/components/ForumList'
import sourceData from '@/data.json'
export default {
  components: {
    ForumList
  },
  data () {
    return {
      forums: sourceData.forums
    }
  }
}
</script>
