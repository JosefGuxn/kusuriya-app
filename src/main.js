import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import iView from 'iview'
import locale from 'iview/dist/locale/vi-VN'
import 'iview/dist/styles/iview.css'

import Buefy from 'buefy'
import 'buefy/lib/buefy.css'

import VueFire from 'vuefire'
import './firebase'

import money from 'v-money'

import moment from 'moment'

Vue.mixin({
  methods: {
    moment (time) {
      return moment(time).format('DD/MM/YYYY')
    },
    toCurrency (number) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number)
    },
    toNumber (number) {
      return new Intl.NumberFormat('vi-VN').format(number)
    }
  }
})

Vue.use(Buefy, {
  defaultIconPack: 'fa'
})

Vue.use(VueFire)
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(iView, { locale })

Vue.use(money, {
  thousands: ',',
  prefix: 'đ ',
  precision: 0,
  masked: false
})
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
  created () {
  }
}).$mount('#app')
