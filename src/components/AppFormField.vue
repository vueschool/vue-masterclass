<template>
  <div class="form-group">
    <label :for="name">{{ label }}</label>
    <VeeField
      :modelValue="modelValue"
      @input="$emit('modelUpdate', $event)"
      :label="label"
      :name="name"
      v-bind="$attrs"
      v-slot="{ field, errorMessage }"
    >
      <component :is="as" v-bind="{...field, ...$attrs}" :class="{ 'input-error': errorMessage }" class="form-input" :id="name">
        <slot v-if="as === 'select'"></slot>
      </component>
      <slot v-if="as !== 'select'"></slot>
      <VeeErrorMessage :name="name" class="form-error" />
    </VeeField>
  </div>
</template>
<script>
export default {
  props: {
    modelValue: { type: String, default: '' },
    name: { type: String, required: true },
    label: { type: String, required: true },
    as: { type: String, default: 'input' }
  }
}
</script>
