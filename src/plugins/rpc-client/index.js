import rpcClient from './client'

const PluginRpcClient = {
  install (Vue, options) {
    Vue.prototype.$rpcClient = rpcClient
  }
}

export default PluginRpcClient
