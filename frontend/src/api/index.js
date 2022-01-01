import axios from 'axios'

const apiUrl = '//localhost:5000'

export function fetchTodos () {
  return axios.get(`${apiUrl}/todos`)
    .then(({ data }) => {
      return data
    })
}
export function register (credentials) {
  return axios.post(`${apiUrl}/registration`, credentials)
    .then(({ data }) => {
      return data
    })
}
export function login (credentials) {
  return axios.post(`${apiUrl}/login`, credentials)
    .then(({ data }) => {
      return data
    })
}
export function logout () {
  return axios.post(`${apiUrl}/logout`)
    .then(({ data }) => {
      return data
    })
}

export function updateTodo (id, req) {
  return axios.patch(`${apiUrl}/todos/${id}`, req)
    .then(({ data }) => {
      return data
    })
}

export function addTodo (req) {
  return axios.post(`${apiUrl}/todos`, req)
    .then(({ data }) => {
      return data
    })
}

export function deleteTodo (reqId) {
  return axios.delete(`${apiUrl}/todos/${reqId}`)
    .then(({ data }) => {
      return data
    })
}
