<template>
  <form @submit.prevent="save">
    <div class="form-group">
      <label for="thread_title">Title:</label>
      <input
        v-model="form.title"
        type="text"
        id="thread_title"
        class="form-input"
        name="title"
      />
    </div>

    <div class="form-group">
      <label for="thread_content">Content:</label>
      <textarea
        v-model="form.text"
        id="thread_content"
        class="form-input"
        name="content"
        rows="8"
        cols="140"
      ></textarea>
    </div>

    <div class="btn-group">
      <button @click.prevent="$emit('cancel')" class="btn btn-ghost">Cancel</button>
      <button class="btn btn-blue" type="submit" name="Publish">
        {{existing ? 'Update' : 'Publish'}}
      </button>
    </div>
  </form>
</template>

<script setup>
import { defineProps, reactive, computed, defineEmit } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  text: { type: String, default: '' }
})

const emit = defineEmit(['save'])

const form = reactive({
  title: props.title,
  text: props.text
})

const existing = computed(() => {
  return !!props.title
})

function save () {
  emit('save', { ...form })
}
</script>
