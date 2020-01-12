import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import '@/styles/general.scss'
import { rpcClient } from './plugins/rpc-client'
import VueElectron from 'vue-electron'

Vue.config.productionTip = false

Vue.use(VueElectron)

/* bind constants to Vue */
let bus = new Vue()
Vue.prototype.bus = bus
Vue.prototype.rpcClient = rpcClient

/* mount Vue instance to DOM */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
