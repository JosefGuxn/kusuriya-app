import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import Buefy from 'buefy'
import 'buefy/lib/buefy.css'

import VueFire from 'vuefire'
import './firebase'
// import * as firebase from 'firebase'

Vue.use(Buefy, {
  defaultIconPack: 'fa'
})

Vue.use(VueFire)
// if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
  created () {
  }
}).$mount('#app')
