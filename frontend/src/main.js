import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Buefy from 'buefy'
import Color from 'color'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import relativeTime from 'dayjs/plugin/relativeTime'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'

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
  render: h => h(App)
}).$mount('#app')
