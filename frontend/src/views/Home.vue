<template>
  <div class="home">
    <div class="container">
      <TodosList />
    </div>
  </div>
</template>

<script>
import TodosList from '@/components/TodosList.vue'
export default {
  name: 'Home',
  components: {
    TodosList
  }
}
</script>
