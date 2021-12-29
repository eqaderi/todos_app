<template>
  <div class="columns is-multiline is-tablet">
    <div
      id="pop-up-container"
      ref="pop-up-container" />
    <div
      v-for="todo in todos"
      :key="todo.id"
      class="column is-6 is-4-desktop is-3-widescreen">
      <TodoCard
        :id="todo.id"
        :todop="todo" />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TodoCard from '@/components/TodoCard.vue'
export default {
  components: {
    TodoCard
  },
  computed: mapState(['todos']),
  beforeMount () {
    this.loadTodos()
  },
  methods: mapActions(['loadTodos'])
}
</script>
<style lang="sass" scoped>
#pop-up-container
  position: fixed
  // overflow: hidden
  border-radius: 1em
  top: 20vh
  bottom: 20vh
  left: 25vw
  right: 25vw
  z-index: 1000
  visibility: hidden
</style>
