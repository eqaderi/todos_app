<template>
  <div :class="{ 'mb-1': !editModeIsActive, 'is-flex is-align-items-center step-edit': editModeIsActive }">
    <b-checkbox
      v-model="step.done"
      class="checkbox-is-transparent"
      type="is-light"
      size="is-small"
      @input="$emit('step:update', step)">
      <div
        v-if="!editModeIsActive"
        :class="[step.done ? 'is-step-done' : '', 'is-size-6']">
        {{ step.order }}. {{ step.text }}
      </div>
    </b-checkbox>
    <b-input
      v-if="editModeIsActive"
      :ref="`step${todoId}${index}`"
      v-model="step.text"
      :class="{'is-step-done': step.done }"
      role="textbox"
      contenteditable="true" />
    <b-tooltip
      v-if="editModeIsActive"
      label="Delete"
      type="is-dark"
      class="ml-auto"
      position="is-bottom">
      <b-icon
        size="is-small"
        class="step-delete p-3 is-clickable"
        icon="close"
        @click.native="$emit('step:delete', index)" />
    </b-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    step: {
      type: Object,
      required: true
    },
    editModeIsActive: {
      type: Boolean,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    todoId: {
      type: Number,
      required: true
    }
  }
  // watch: {
  //   step: {
  //     deep: true,
  //     handler (value) {
  //       this.$emit('step:update', value)
  //     }
  //   }
  // }
}
</script>

<style lang="sass" scoped>
.step-edit
  border-width: 1px 0 0
  border-color: transparent
  border-style: solid
  border-color: rgba(0 0 0 / .15)
  &:focus-within
    border-color: rgba(0 0 0 / .25)

::v-deep
  input
    // font-weight: 700 !important
    // font-size: 1.5rem !important
    padding: 5px 0

    height: initial
    background-color: initial
    border-color: transparent
    border-width: 0
    border-radius: 0
    box-shadow: none
    color: currentColor
    &:hover,
    &:focus
      box-shadow: none

  .checkbox-is-transparent
    input[type=checkbox]:checked + .check
      border-color: transparent !important
      background-color: transparent !important

    &:hover
      input[type=checkbox]
        &:not(:disabled) + .check
          border-color: #4a4a4a !important

        &:checked + .check
          border-color: transparent !important
  .step-delete
    border-radius: 100px
    overflow: hidden
    i::before
      font-weight: 700
    &:hover
      background-color: rgba(0 0 0 / .15)
</style>
