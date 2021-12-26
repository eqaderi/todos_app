<template>
  <div class="columns is-tablet">
    <div
      v-for="todo in todos"
      :key="todo.id"
      class="column is-6 is-4-desktop is-3-widescreen">
      <TodoCard :todo="todo" />
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
  methods: {
    ...mapActions(['loadTodos'])
  }
}
</script>
