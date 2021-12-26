<template>
  <div class="mb-1">
    <b-checkbox
      class="checkbox-is-transparent"
      type="is-light"
      :value="stepCopy.done"
      @input="value => updateStep(value)">
      <div :class="[stepCopy.done ? 'is-step-done' : '', 'mr-2']">
        {{ stepCopy.order }}. {{ stepCopy.text }}
      </div>
    </b-checkbox>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
export default {
  props: {
    step: {
      type: Object,
      required: true,
      default: () => ({
        order: null,
        text: null,
        done: null
      })
    }
  },
  data () {
    return {
      stepCopy: cloneDeep(this.step)
    }
  },
  watch: {
    step: {
      immediate: true,
      deep: true,
      handler (newValue, oldValue) {
        this.stepCopy = cloneDeep(newValue)
      }
    }
  },
  methods: {
    updateStep (value) {
      this.stepCopy.done = value
      this.$emit('update:step', this.stepCopy)
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
