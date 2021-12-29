import Vue from 'vue'
import Vuex from 'vuex'
import { fetchTodos, updateTodo } from '@/api'
import { debounce } from 'lodash'
import pDebounce from 'p-debounce'

Vue.use(Vuex)

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
    formIsValid: true,
    cardIsShaking: false
  },
  mutations: {
    SET_TODOS (state, payload) {
      // state.todos = payload.todos
      payload.todos.forEach((element, index) => {
        Vue.set(state.todos, index, element)
      })
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
      const todos = await fetchTodos()
      debounced.cancel()

      // const todos = await fetchTodos()

      debounced.cancel()
      commit('SET_TODOS', { todos })
      commit('UPDATE_LOADER', { status: false, todoId: 'all' })
    },
    updateTodo: pDebounce(async ({ commit }, todoObj) => {
      const commitLoaderUpdate = () =>
        commit('UPDATE_LOADER', { status: true, todoId: todoObj.id })
      const debouncedCommitLoaderUpdate = debounce(commitLoaderUpdate, 500)
      debouncedCommitLoaderUpdate()
      let todo = []
      try {
        todo = await updateTodo(todoObj)
      } catch (error) {
        commit('UPDATE_LOADER', { status: false, todoId: todoObj.id })
        throw error
      }
      debouncedCommitLoaderUpdate.cancel()
      commit('UPDATE_TODO', { todo })
      commit('UPDATE_LOADER', { status: false, todoId: todoObj.id })
    }, 1000),
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
