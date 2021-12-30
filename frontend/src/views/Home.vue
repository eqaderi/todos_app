<template>
  <div class="home">
    <CreateTodo
      :search-phrase.sync="searchPhrase"
      @clear-search="searchPhrase=''" />
    <div class="container">
      <TodosList :todos="filteredTodos" />
      <EmptyState
        v-if="!filteredTodos.length"
        @clear-search="searchPhrase=''" />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { cloneDeep, debounce } from 'lodash'
import TodosList from '@/components/TodosList.vue'
import CreateTodo from '../components/CreateTodo.vue'
import EmptyState from '../components/EmptyState.vue'
export default {
  name: 'Home',
  components: {
    TodosList,
    CreateTodo,
    EmptyState
  },
  data () {
    return {
      searchPhrase: '',
      filteredTodos: []
    }
  },
  computed: {
    ...mapState(['todos'])
  },
  watch: {
    todos: {
      immediate: true,
      deep: true,
      handler (newValue, oldValue) {
        if (newValue.length) this.filteredTodos = cloneDeep(newValue)
      }
    },
    searchPhrase (val) {
      this.search(val)
    }
  },
  beforeMount () {
    this.loadTodos()
  },
  methods: {
    ...mapActions(['loadTodos']),
    ...mapGetters(['getTodosByName']),
    search: debounce(function (phrase) {
      this.filteredTodos = this.todos.filter(({ title, description }) => {
        return title.toLowerCase().includes(phrase.toLowerCase()) ||
          description.toLowerCase().includes(phrase.toLowerCase())
      })
    }, 500)
  }
}
</script>
