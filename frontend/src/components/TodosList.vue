<template>
  <div>
    <transition-group
      name="fade"
      tag="div"
      class="columns is-multiline is-tablet"
      @before-leave="beforeLeave">
      <TodoCard
        v-for="todo in todos"
        :id="todo.id"
        :key="todo.id"
        :todop="todo"
        class="column is-6 is-4-desktop is-3-widescreen" />
    </transition-group>
  </div>
</template>

<script>
import TodoCard from '@/components/TodoCard.vue'
import { mapState } from 'vuex'
export default {
  components: {
    TodoCard
  },
  computed: mapState(['todos']),
  methods: {
    beforeLeave (el) {
      const { marginLeft, marginTop, width, height } = window.getComputedStyle(el)
      el.style.left = `${el.offsetLeft - parseFloat(marginLeft, 10)}px`
      el.style.top = `${el.offsetTop - parseFloat(marginTop, 10)}px`
      el.style.width = width
      el.style.height = height
    }
  }
}
</script>
<style lang="sass" scoped>
.fade-enter-active, .fade-leave-active
  transition: opacity .24s ease-out, transform .24s ease-out

.fade-leave-active
  position: absolute

.fade-move
  transition: transform .24s ease-out

.fade-enter, .fade-leave-to
  opacity: 0
  transform: scale(.8)

</style>
