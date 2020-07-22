import lodash from 'lodash'

const PluginLodash = {
  install (Vue) {
    Vue.prototype.$lodash = lodash
  }
}

export default PluginLodash
