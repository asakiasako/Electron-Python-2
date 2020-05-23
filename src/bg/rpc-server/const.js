/* global __static */
const path = require('path')
// select rpc-server port (if occupied, will try += 1)
const DEFAULT_SERVER_PORT = 23300
const PYTHON_PATH = process.env.NODE_ENV !== 'production' ? path.join(__dirname, '../py-code/.venv/Scripts/python.exe') : null
const PROCESS_PATH = process.env.NODE_ENV !== 'production' ? path.join(__dirname, '../py-code/src/__main__.py') : path.join(__static, 'ElectronPythonSubProcess', 'ElectronPythonSubProcess.exe')

module.exports = {
  DEFAULT_SERVER_PORT,
  PYTHON_PATH,
  PROCESS_PATH
}
