import Vue from 'vue'
import Vuex from 'vuex'
import { fetchTodos, updateTodo } from '@/api'
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
    error: {
      code: null,
      message: '',
      todoIs: null
    }
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
    SET_ERROR (state, { code, message, todoId }) {
      state.error.code = code
      state.error.message = message
      state.error.todoId = todoId
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

      debounced.cancel()
      commit('SET_TODOS', { todos })
      commit('UPDATE_LOADER', { status: false, todoId: 'all' })
    },

    updateTodo: pDebounce(async ({ commit, state, dispatch }, todoObj) => {
      const commitLoaderUpdate = () =>
        commit('UPDATE_LOADER', { status: true, todoId: todoObj.id })
      const debouncedCommitLoaderUpdate = debounce(commitLoaderUpdate, 500)
      debouncedCommitLoaderUpdate()
      const pyNormalized = normalizeForPython(todoObj)
      let rawTodo = {}
      try {
        rawTodo = await updateTodo(pyNormalized)
        if (state.error.code) {
          commit('SET_ERROR', {
            code: null,
            message: '',
            todoIs: null
          })
        }
      } catch (error) {
        commit('UPDATE_LOADER', { status: false, todoId: todoObj.id })
        dispatch('toggleError', {
          code: error.code,
          message: error.message,
          todoId: todoObj.id
        })
        commit('SET_SHAKE', { status: true, todoId: todoObj.id })

        throw error
      }

      debouncedCommitLoaderUpdate.cancel()

      const todo = normalizeForJavascript(rawTodo)
      commit('UPDATE_TODO', todo)
      commit('UPDATE_LOADER', { status: false, todoId: todoObj.id })
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

    toggleError ({ commit }, payload) {
      clearTimeout(sti)
      commit('SET_ERROR', payload)

      sti = setTimeout(() => {
        commit('SET_ERROR', {
          code: null,
          message: '',
          todoIs: null
        })
      }, 1)
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
