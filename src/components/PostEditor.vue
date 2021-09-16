<template>
  <div class="col-full">
    <VeeForm @submit="save">
      <AppFormField name="text" v-model="postCopy.text" as="textarea" rows="10" cols="30" rules="required"/>
      <div class="form-actions">
        <button class="btn-blue">{{post.id ? 'Update Post' : 'Submit post'}}</button>
      </div>
    </VeeForm>
  </div>
</template>

<script>
export default {
  props: {
    post: { type: Object, default: () => ({ text: null }) }
  },
  data () {
    return {
      postCopy: { ...this.post }
    }
  },
  methods: {
    save () {
      this.$emit('save', { post: this.postCopy }) // access under eventData.post
      this.postCopy.text = ''
    }
  }
}
</script>

<style scoped>

</style>
