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
import TodoCard from '@/components/TodoCard.vue'
export default {
  components: {
    TodoCard
  },
  props: {
    todos: {
      type: Array,
      default: () => []
    }
  }
}
</script>
