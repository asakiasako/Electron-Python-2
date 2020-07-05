/* add rpcClient to Vue.prototype.$rpcClient */
import zeroRPC from 'zerorpc'
import { remote } from 'electron'

const getRpcPort = remote.getGlobal('getRpcPort')
const isServerProcessAlive = remote.getGlobal('isServerProcessAlive')

/* get current port from main process */
const clientIP = '127.0.0.1'
const clientPort = getRpcPort()
const serverAlive = isServerProcessAlive()

if (!serverAlive) {
  remote.dialog.showErrorBox('Fatal Error', `Unable to launch RPC server process. Get more information with logs in:\n${remote.app.getPath('logs')}`)
  remote.app.quit()
}

/* run RPC client */
const rpcClient = new zeroRPC.Client()

rpcClient.connectServer = function () {
  let client = this
  console.log(`tcp://${clientIP}:${clientPort}`)
  client.connect(`tcp://${clientIP}:${clientPort}`)
}

rpcClient.disconnectServer = function (address) {
  let client = this
  client._socket._zmqSocket.disconnect(`tcp://${address}:${clientPort}`)
}

rpcClient.invokes = function (...args) {
  return new Promise(function (resolve, reject) {
    rpcClient.invoke(...args, (err, res, more) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

rpcClient.request = function (params) {
  return rpcClient.invokes('request', params)
}

rpcClient.checkConnection = function () {
  return rpcClient.invokes('check_connection')
}

rpcClient.connectServer()

const PluginRpcClient = {
  install (Vue, options) {
    Vue.prototype.$rpcClient = rpcClient
  }
}

export default PluginRpcClient
