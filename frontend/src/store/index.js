import Vue from 'vue'
import Vuex from 'vuex'
import { fetchTodos, updateTodo } from '@/api'
import { debounce } from 'lodash'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    todos: [],
    loader: {
      status: false,
      todoId: null
    }
  },
  mutations: {
    SET_TODOS (state, payload) {
      state.todos = payload.todos
    },
    UPDATE_LOADER (state, { status, todoId }) {
      state.loader.status = status
      state.loader.todoId = todoId
    },
    UPDATE_TODO (state, { todo }) {
      const todoId = todo.id
      const index = state.todos.findIndex(({ id }) => +id === +todoId)
      state.todos[index] = todo
    }
  },
  actions: {
    async loadTodos ({ commit }) {
      const commitLoaderUpdate = () =>
        commit('UPDATE_LOADER', { status: true, todoId: 'all' })
      const debounced = debounce(commitLoaderUpdate, 500)
      debounced()

      const todos = await fetchTodos()

      debounced.cancel()
      commit('SET_TODOS', { todos })
      commit('UPDATE_LOADER', { status: false, todoId: 'all' })
    },
    updateTodo: debounce(async ({ commit }, todoObj) => {
      const commitLoaderUpdate = () =>
        commit('UPDATE_LOADER', { status: true, todoId: todoObj.id })
      const debouncedCommitLoaderUpdate = debounce(commitLoaderUpdate, 500)
      debouncedCommitLoaderUpdate()

      const todo = await updateTodo(todoObj)

      debouncedCommitLoaderUpdate.cancel()
      commit('UPDATE_TODO', { todo })
      commit('UPDATE_LOADER', { status: false, todoId: todoObj.id })
    }, 1000)
  },
  getters: {
    todoIds: state => {
      return state.todos.map(todo => todo.id)
    },
    getTodoById: (state) => (id) => {
      return state.todos.find(todo => todo.id === id)
    }
  },
  modules: {}
})
