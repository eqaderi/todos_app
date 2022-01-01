import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import Color from 'color'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import relativeTime from 'dayjs/plugin/relativeTime'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import axios from 'axios'

dayjs.extend(calendar)
dayjs.extend(relativeTime)
gsap.registerPlugin(Flip)

Vue.prototype.$color = Color
Vue.prototype.$dayjs = dayjs
Vue.prototype.$gsap = gsap
Vue.prototype.$Flip = Flip

Vue.use(Buefy)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  created () {
    const userString = localStorage.getItem('currentUser')
    if (userString) {
      const userData = JSON.parse(userString)
      this.$store.commit('SET_CURRENT_USER', userData)
    }
    //
    axios.interceptors.response.use(
      response => response,
      error => {
        console.log(error.response)
        if (error.response.status === 401) {
          this.$router.push('/login')
          this.$store.dispatch('logout')
        }
        return Promise.reject(error)
      }
    )
  },
  render: h => h(App)
}).$mount('#app')
