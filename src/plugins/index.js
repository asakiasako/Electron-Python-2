import Vue from 'vue'
import Element from 'element-ui'
import '../styles/theme-poetry/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import RpcClient from './rpc-client'
import EventBus from './event-bus'
import VueElectron from 'vue-electron'

Vue.use(Element, { locale })
Vue.use(EventBus)
Vue.use(RpcClient)
Vue.use(VueElectron)
