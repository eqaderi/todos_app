<template>
  <div
    class="todo-color is-clickable"
    :style="{ backgroundColor: color, borderColor }" />
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: '#ff0000'
    },
    borderColor: {
      type: [String, Object],
      default: '#ff0000'
    }
  }
  // computed: {
  //   colorModel: {
  //     get: function () {
  //       return this.color
  //     },
  //     set: function (newValue) {
  //       this.$emit('update:color', newValue)
  //     }
  //   }
  // }
}
</script>

<style lang="sass" scoped>

.todo-color
  position: relative
  height: 2em
  width: 2em
  border-radius: 999px
  background-color: #ff0993
  border: 2px solid #8b8b8b
  &::after
    content: ""
    position: absolute
    top: 0
    right: 0
    bottom: 0
    left: 0
    box-shadow: inset 0 5px 4px -2px rgb(255 255 255 / 70%)
    border-radius: 999px
    mix-blend-mode: overlay
    border: 3px solid #0000
</style>
