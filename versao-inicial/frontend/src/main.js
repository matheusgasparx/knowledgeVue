import Vue from 'vue'

import App from './App'

import './config/bootstrap'
import store from './config/store' // armazenando no store.js

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
