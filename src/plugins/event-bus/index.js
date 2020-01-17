import Vue from 'vue'

const eventBus = new Vue()

const PluginEventBus = {
  install (Vue) {
    Vue.prototype.$bus = eventBus
  }
}

export default PluginEventBus
