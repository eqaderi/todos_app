import Vue from 'vue'
import Vuex from 'vuex'
import { fetchTodos, addTodo, deleteTodo, updateTodo } from '@/api'
import pDebounce from 'p-debounce'
import { debounce, cloneDeep, mapKeys, camelCase, snakeCase } from 'lodash'

Vue.use(Vuex)

const normalizeForJavascript = (object) => {
  const clone = cloneDeep(object)
  const normalizedObject = mapKeys(clone, (_, key) => camelCase(key))
  normalizedObject.createdAt =
    normalizedObject.createdAt && new Date(normalizedObject.createdAt)
  normalizedObject.dueDate =
    normalizedObject.dueDate && new Date(normalizedObject.dueDate)
  return normalizedObject
}
const normalizeForPython = (object) => {
  let normalizedObject = cloneDeep(object)
  normalizedObject.createdAt = normalizedObject.createdAt?.toISOString()
  normalizedObject.dueDate = normalizedObject.dueDate?.toISOString()
  normalizedObject = mapKeys(object, (_, key) => snakeCase(key))
  return normalizedObject
}

let sti = null

export default new Vuex.Store({
  state: {
    todos: [
      // {
      //   id: 0,
      //   createdAt: null,
      //   color: '#ffffff',
      //   title: '',
      //   description: '',
      //   steps: [
      //     {
      //       order: null,
      //       text: '',
      //       done: false
      //     }
      //   ],
      //   dueDate: null,
      //   done: false
      // }
    ],
    loader: {
      status: false,
      todoId: null
    },
    backdrop: false,
    cardPoppedUp: {
      status: false,
      todoId: null
    },
    formValidationStatus: {
      status: true,
      todoId: null
    },
    cardIsShaking: {
      status: true,
      todoId: null
    },
    message: {
      code: null,
      type: null,
      text: null,
      todoId: null
    },
    disableInteraction: {
      status: false,
      todoId: null
    },
    newTodo: false
  },
  mutations: {
    SET_TODOS (state, payload) {
      payload.todos.forEach((element, index) => {
        Vue.set(state.todos, index, element)
      })
    },
    UPDATE_LOADER (state, { status, todoId }) {
      state.loader.status = status
      state.loader.todoId = todoId
    },
    ADD_TODO (state, payload) {
      // Vue.set(state.todos, 0, payload)
      state.todos.unshift(payload)
    },
    DELETE_TODO (state, todoId) {
      const index = state.todos.findIndex(({ id }) => +id === +todoId)
      state.todos.splice(index, 1)
      // Vue.set(state.todos, index, payload)
    },
    UPDATE_TODO (state, payload) {
      const todoId = payload.id
      const index = state.todos.findIndex(({ id }) => +id === +todoId)
      Vue.set(state.todos, index, payload)
    },
    SET_BACKDROP (state, status) {
      state.backdrop = status
    },
    SET_CARD_POPPED_UP (state, { status, todoId }) {
      state.cardPoppedUp.status = status
      state.cardPoppedUp.todoId = todoId
    },
    SET_FORM_IS_VALID (state, { status, todoId }) {
      state.formValidationStatus.status = status
      state.formValidationStatus.todoId = todoId
    },
    SET_SHAKE (state, { status, todoId }) {
      state.cardIsShaking.status = status
      state.cardIsShaking.todoId = todoId
    },
    SET_MESSAGE (state, { code, type, text, todoId }) {
      state.message.code = code
      state.message.type = type
      state.message.text = text
      state.message.todoId = todoId
    },
    SET_DISABLE_INTERACTION (state, { status, todoId }) {
      state.disableInteraction.status = status
      state.disableInteraction.todoId = todoId
    },
    SET_NEW_TODO (state, status) {
      state.newTodo = status
    }
  },
  actions: {
    async loadTodos ({ commit }) {
      const commitLoaderUpdate = () =>
        commit('UPDATE_LOADER', { status: true, todoId: 'all' })
      const debounced = debounce(commitLoaderUpdate, 500)

      debounced()
      const rawTodos = await fetchTodos()
      const todos = rawTodos.map(normalizeForJavascript)

      debounced.cancel()
      commit('SET_TODOS', { todos })
      commit('UPDATE_LOADER', { status: false, todoId: 'all' })
    },

    async addTodo ({ commit, dispatch }, todoObj) {
      console.log('action', todoObj)
      commit('UPDATE_LOADER', { status: true, todoId: 'new' })

      const pyNormalized = normalizeForPython(todoObj)
      let rawTodo = {}
      try {
        rawTodo = await addTodo(pyNormalized)
        dispatch('updateMessage', {
          code: 200,
          type: 'is-success',
          text: 'Todo added.',
          todoId: null // TODO
        })
      } catch (error) {
        dispatch('updateMessage', {
          code: error.code,
          type: 'is-danger',
          text: error.message,
          todoId: null // TODO
        })
        commit('SET_SHAKE', { status: true, todoId: 'new' })

        throw error
      } finally {
        commit('SET_DISABLE_INTERACTION', { status: false, todoId: null })
        commit('UPDATE_LOADER', { status: false, todoId: 'new' })
      }
      const todo = normalizeForJavascript(rawTodo)
      commit('ADD_TODO', todo)
    },

    async deleteTodo ({ commit, dispatch }, todoId) {
      commit('UPDATE_LOADER', { status: true, todoId: 'delete' })

      // let res = {}
      try {
        await deleteTodo(todoId)
        dispatch('updateMessage', {
          code: 200,
          type: 'is-success',
          text: 'Todo deleted.',
          todoId: todoId
        })
      } catch (error) {
        dispatch('updateMessage', {
          code: error.code,
          type: 'is-danger',
          text: error.message,
          todoId: todoId
        })
        commit('SET_SHAKE', { status: true, todoId: todoId })

        throw error
      } finally {
        commit('SET_DISABLE_INTERACTION', { status: false, todoId: todoId })
        commit('UPDATE_LOADER', { status: false, todoId: todoId })
      }

      commit('DELETE_TODO', todoId)
    },

    updateTodo: pDebounce(async ({ commit, dispatch }, todoObj) => {
      // commit('SET_DISABLE_INTERACTION', { status: true, todoId: todoObj.id })
      const commitLoaderUpdate = () =>
        commit('UPDATE_LOADER', { status: true, todoId: todoObj.id })
      const debouncedCommitLoaderUpdate = debounce(commitLoaderUpdate, 500)
      debouncedCommitLoaderUpdate()

      const pyNormalized = normalizeForPython(todoObj)
      let rawTodo = {}
      try {
        rawTodo = await updateTodo(pyNormalized)

        dispatch('updateMessage', {
          code: 200,
          type: 'is-success',
          text: 'Todo updated.',
          todoId: todoObj.id
        })
      } catch (error) {
        dispatch('updateMessage', {
          code: error.code,
          type: 'is-danger',
          text: error.message,
          todoId: todoObj.id
        })
        commit('SET_SHAKE', { status: true, todoId: todoObj.id })

        throw error
      } finally {
        commit('SET_DISABLE_INTERACTION', { status: false, todoId: null })
        commit('UPDATE_LOADER', { status: false, todoId: todoObj.id })
      }

      debouncedCommitLoaderUpdate.cancel()

      const todo = normalizeForJavascript(rawTodo)
      commit('UPDATE_TODO', todo)
    }, 1000),

    updateBackdrop ({ commit }, status) {
      commit('SET_BACKDROP', status)
    },

    updateCardPoppedUp ({ commit }, payload) {
      commit('SET_CARD_POPPED_UP', payload)
    },

    updateFormValidationStatus ({ commit }, payload) {
      commit('SET_FORM_IS_VALID', payload)
    },

    updateCardIsShaking ({ commit }, payload) {
      commit('SET_SHAKE', payload)
    },

    updateDisableInteraction ({ commit }, payload) {
      commit('SET_DISABLE_INTERACTION', payload)
    },

    updateMessage ({ commit }, payload) {
      clearTimeout(sti)
      commit('SET_MESSAGE', payload)

      sti = setTimeout(() => {
        commit('SET_MESSAGE', {
          code: null,
          type: null,
          text: null,
          todoId: null
        })
      }, 1)
    },
    updateNewTodo ({ commit }, status) {
      commit('SET_NEW_TODO', status)
    }
  },
  getters: {
    todoIds: (state) => {
      return state.todos.map((todo) => todo.id)
    },
    getTodoById: (state) => (id) => {
      return state.todos.find((todo) => todo.id === id)
    }
  },
  modules: {}
})
