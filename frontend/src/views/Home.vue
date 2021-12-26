<template>
  <div class="home">
    <div class="container">
      <TodosList :todos="todos" />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import TodosList from '@/components/TodosList.vue'

export default {
  name: 'Home',
  components: {
    TodosList
  }
}
</script>
