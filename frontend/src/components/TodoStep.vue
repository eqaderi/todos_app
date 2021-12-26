<template>
  <div class="mb-1">
    <b-checkbox
      v-model="value.done"
      class="checkbox-is-transparent"
      type="is-light"
      @input="value => updateStep(value)">
      <div :class="[value.done ? 'is-step-done' : '', 'mr-2']">
        {{ value.order }}. {{ value.text }}
      </div>
    </b-checkbox>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  methods: {
    updateStep (value) {
      this.value.done = value
      this.$emit('input', this.value)
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
