<template>
  <img :src="src || '/user-placeholder.png'" />
</template>
<script>
export default {
  props: {
    src: { type: String }
  }
}
</script>
