import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import Buefy from 'buefy'
import 'buefy/lib/buefy.css'

import * as firebase from 'firebase'

Vue.use(Buefy, {
  defaultIconPack: 'fa'
})

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
    firebase.initializeApp({
      apiKey: 'AIzaSyD7zmr42b5YHx6gAibxGNrQIqW8VN_Thfk',
      authDomain: 'nhathuoc41-9ecce.firebaseio.com',
      databaseURL: 'https://nhathuoc41-9ecce.firebaseio.com/',
      projectId: 'nhathuoc41-9ecce',
      storageBucket: ''
    })
    this.$store.dispatch('receiveProducts')
    this.$store.dispatch('receiveCategories')
    this.$store.dispatch('receiveChemicals')
    this.$store.dispatch('receiveClasses')
    this.$store.dispatch('receiveUoms')
  }
}).$mount('#app')
