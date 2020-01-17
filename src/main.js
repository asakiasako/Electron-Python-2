import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins'
import '@/styles/general.scss'

Vue.config.productionTip = false

/* mount Vue instance to DOM */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
