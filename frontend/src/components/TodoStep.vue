<template>
  <div class="mb-1">
    <b-checkbox
      v-model="step.done"
      class="checkbox-is-transparent"
      type="is-light"
      @input="$emit('step:update', step)">
      <div :class="[step.done ? 'is-step-done' : '', 'mr-2']">
        {{ step.order }}. {{ step.text }}
      </div>
    </b-checkbox>
  </div>
</template>

<script>
export default {
  props: {
    step: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="sass" scoped>
::v-deep .checkbox-is-transparent
  input[type=checkbox]:checked + .check
    border-color: transparent !important
    background-color: transparent !important

  &:hover
    input[type=checkbox]
      &:not(:disabled) + .check
        border-color: #4a4a4a !important

      &:checked + .check
        border-color: transparent !important
</style>
