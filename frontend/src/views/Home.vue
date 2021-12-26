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
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Home',
  components: {
    TodosList
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
