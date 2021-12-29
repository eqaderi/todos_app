import Vue from 'vue'
import Vuex from 'vuex'
import { fetchTodos, updateTodo } from '@/api'
import { debounce, cloneDeep, mapKeys, camelCase, snakeCase } from 'lodash'
// import pDebounce from 'p-debounce'

Vue.use(Vuex)

const normalizeForJavascript = object => {
  const clone = cloneDeep(object)
  const normalizedObject = mapKeys(clone, (_, key) => camelCase(key))
  // normalizedObject.createdAt = new Date(normalizedObject.createdAt)
  // normalizedObject.dueDate = new Date(normalizedObject.dueDate)
  return normalizedObject
}
const normalizeForPython = object => {
  let normalizedObject = cloneDeep(object)
  // normalizedObject.createdAt = normalizedObject.createdAt.toISOString()
  // normalizedObject.dueDate = normalizedObject.dueDate.toISOString()
  normalizedObject = mapKeys(object, (_, key) => snakeCase(key))
  return normalizedObject
}

export default new Vuex.Store({
  state: {
    todos: [],
    loader: {
      status: false,
      todoId: null
    },
    backdrop: false,
    cardPoppedUp: {
      status: false,
      todoId: null
    },
    formIsValid: true,
    cardIsShaking: false
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
      // console.log(4, 'commit mutation', todo)
      const todoId = todo.id
      const index = state.todos.findIndex(({ id }) => +id === +todoId)
      Vue.set(state.todos, index, todo)
      // state.todos[index] = todo
    },
    SET_BACKDROP (state, status) {
      state.backdrop = status
    },
    SET_CARD_POPPED_UP (state, { status, todoId }) {
      state.cardPoppedUp.status = status
      state.cardPoppedUp.todoId = todoId
    },
    SET_FORM_IS_VALID (state, status) {
      state.formIsValid = status
    },
    SET_SHAKE (state, status) {
      state.cardIsShaking = status
    }
  },
  actions: {
    async loadTodos ({ commit }) {
      const commitLoaderUpdate = () =>
        commit('UPDATE_LOADER', { status: true, todoId: 'all' })
      const debounced = debounce(commitLoaderUpdate, 500)

      debounced()
      const response = await fetchTodos()
      debounced.cancel()

      const todos = response.map(normalizeForJavascript)

      commit('SET_TODOS', { todos })
      commit('UPDATE_LOADER', { status: false, todoId: 'all' })
    },
    updateTodo: async ({ commit }, todoObj) => {
      const commitLoaderUpdate = () =>
        commit('UPDATE_LOADER', { status: true, todoId: todoObj.id })
      const debouncedCommitLoaderUpdate = debounce(commitLoaderUpdate, 500)
      const request = normalizeForPython(todoObj)
      // console.log(2, 'call api', request)
      debouncedCommitLoaderUpdate()
      console.log({ request })
      const response = await updateTodo(request)
      debouncedCommitLoaderUpdate.cancel()

      const todo = normalizeForJavascript(response)

      // console.log(3, 'result of api call', todo)

      commit('UPDATE_TODO', { todo })
      commit('UPDATE_LOADER', { status: false, todoId: todoObj.id })
    },

    // updateTodo: debounce(
    //   () => {
    //     return async ({ commit }, todoObj) => {
    //       const commitLoaderUpdate = () =>
    //         commit('UPDATE_LOADER', { status: true, todoId: todoObj.id })
    //       const debouncedCommitLoaderUpdate = debounce(commitLoaderUpdate, 500)
    //       const request = normalizeForPython(todoObj)
    //       console.log({ request })
    //       debouncedCommitLoaderUpdate()
    //       const response = await updateTodo(request)
    //       debouncedCommitLoaderUpdate.cancel()

    //       const todo = normalizeForJavascript(response)

    //       console.log({ todo })

    //       commit('UPDATE_TODO', { todo })
    //       commit('UPDATE_LOADER', { status: false, todoId: todoObj.id })
    //     }
    //   },
    //   2000
    // ),
    updateBackdrop ({ commit }, status) {
      commit('SET_BACKDROP', status)
    },
    updateCardPoppedUp ({ commit }, payload) {
      commit('SET_CARD_POPPED_UP', payload)
    },
    updateFormIsValid ({ commit }, status) {
      commit('SET_FORM_IS_VALID', status)
    },
    updateCardIsShaking ({ commit }, status) {
      commit('SET_SHAKE', status)
    }
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
