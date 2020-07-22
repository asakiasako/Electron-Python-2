import Vue from 'vue'
import Element from 'element-ui'
import '../styles/theme-poetry/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import RpcClient from './rpc-client'
import lodash from './lodash'
import EventBus from './event-bus'
import AlertError from './alert-error'
import VueElectron from 'vue-electron'

Vue.use(lodash)
Vue.use(Element, { locale })
Vue.use(AlertError)
Vue.use(EventBus)
Vue.use(RpcClient)
Vue.use(VueElectron)
