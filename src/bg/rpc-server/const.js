/* global __static */
const path = require('path')
// select rpc-server port
const DEFAULT_SERVER_PORT = 23300
const PYTHON_PATH = process.env.NODE_ENV !== 'production' ? path.join(__dirname, '../py-api/.venv/Scripts/python.exe') : null
const PROCESS_PATH = process.env.NODE_ENV !== 'production' ? path.join(__dirname, '../py-api/main.py') : path.join(__static, 'api', 'api.exe')

module.exports = {
  DEFAULT_SERVER_PORT,
  PYTHON_PATH,
  PROCESS_PATH
}
