import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import pDebounce from 'p-debounce'
import { debounce, cloneDeep, mapKeys, camelCase, snakeCase } from 'lodash'
import { register, login, logout, fetchTodos, addTodo, deleteTodo, updateTodo } from '@/api'
import router from '@/router'

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
    newTodo: false,
    currentUser: {}
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
    },
    SET_CURRENT_USER (state, data) {
      if (data.access_token) {
        state.currentUser = data
        localStorage.setItem('currentUser', JSON.stringify(data))
        axios.defaults.headers.common.Authorization = `Bearer ${data.access_token}`
      } else {
        localStorage.removeItem('currentUser')
      }
    }
  },
  actions: {
    async loadTodos ({ commit, dispatch }) {
      commit('UPDATE_LOADER', { status: true, todoId: 'allTodos' })

      let rawTodos = []
      try {
        rawTodos = await fetchTodos()
      } catch (error) {
        console.error('eeeee', error)
        dispatch('updateMessage', {
          code: error.status,
          type: 'is-danger',
          text: error.message,
          todoId: null // TODO
        })
      }
      const todos = rawTodos.map(normalizeForJavascript)

      commit('SET_TODOS', { todos })
      commit('UPDATE_LOADER', { status: false, todoId: null })
    },

    async addTodo ({ commit, dispatch }, todoObj) {
      commit('SET_DISABLE_INTERACTION', { status: true, todoId: todoObj.id })
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
          code: error.status,
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
      commit('SET_DISABLE_INTERACTION', { status: true, todoId: todoId })
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
          code: error.status,
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

    updateTodo: pDebounce(async ({ state, commit, dispatch }, { id, todoObj }) => {
      commit('SET_DISABLE_INTERACTION', { status: true, todoId: todoObj.id })
      const commitLoaderUpdate = () =>
        commit('UPDATE_LOADER', { status: true, todoId: todoObj.id })
      const debouncedCommitLoaderUpdate = debounce(commitLoaderUpdate, 500)
      debouncedCommitLoaderUpdate()

      const reqId = todoObj.id
      const index = state.todos.findIndex(({ id }) => +id === +reqId)

      const reqAllStepsDone = todoObj.steps.every(({ done }) => done)
      const reqDone = todoObj.done
      const currentAllStepsDone = state.todos[index].steps.every(({ done }) => done)

      if (todoObj.steps.length) {
        if (reqAllStepsDone && !currentAllStepsDone && !reqDone) {
          todoObj.done = true
        } else if (!reqAllStepsDone && currentAllStepsDone && reqDone) {
          todoObj.done = false
        } else if (!reqAllStepsDone && reqDone) {
          todoObj.steps.forEach((element) => {
            element.done = true
          })
        } else if (currentAllStepsDone && !reqDone) {
          todoObj.steps.forEach((element) => {
            element.done = false
          })
        }
      }

      const pyNormalized = normalizeForPython(todoObj)
      let rawTodo = {}
      try {
        rawTodo = await updateTodo(id, pyNormalized)

        dispatch('updateMessage', {
          code: 200,
          type: 'is-success',
          text: 'Todo updated.',
          todoId: todoObj.id
        })
      } catch (error) {
        dispatch('updateMessage', {
          code: error.status,
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
    },
    async register ({ commit, dispatch }, credentials) {
      let data = {}
      try {
        data = await register(credentials)
      } catch (error) {
        const err = error.toJSON()
        const msg = +err.status === 409 ? 'This username already exists' : err.message
        dispatch('updateMessage', {
          code: err.status,
          type: 'is-danger',
          text: msg,
          todoId: null
        })
      }

      commit('SET_CURRENT_USER', data)
      dispatch('updateMessage', {
        code: 200,
        type: 'is-success',
        text: 'User registered!',
        todoId: null
      })
    },
    async login ({ commit, dispatch }, credentials) {
      let data = {}
      try {
        data = await login(credentials)
      } catch (error) {
        const err = error.toJSON()
        dispatch('updateMessage', {
          code: err.status,
          type: 'is-danger',
          text: err.message,
          todoId: null
        })
      }

      commit('SET_CURRENT_USER', data)
      dispatch('updateMessage', {
        code: 200,
        type: 'is-success',
        text: 'User logged in!',
        todoId: null
      })
    },
    async logout ({ commit, dispatch }) {
      try {
        await logout()
      } catch (error) {
        const err = error.toJSON()
        dispatch('updateMessage', {
          code: err.status,
          type: 'is-danger',
          text: err.message,
          todoId: null
        })
      }

      commit('SET_CURRENT_USER', {
        message: '', access_token: '', refresh_token: ''
      })
      dispatch('updateMessage', {
        code: 200,
        type: 'is-success',
        text: 'User logged out!',
        todoId: null
      })
      router.push({ name: 'Login' })
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
