const PluginAlertError = {
  install (Vue) {
    Vue.prototype.$alertError = function (err, callback) {
      this.$alert(`[${err.name}] ${err.message}`, 'ERROR', {
        confirmButtonText: 'OK',
        type: 'error'
      })
      if (callback) {
        callback()
      }
    }
  }
}

export default PluginAlertError
