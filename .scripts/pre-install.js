const fs = require('fs')
const path = require('path')

/* Create .venv folder */
// when .venv folder exists, pipenv will generate virtual env here
venvPath = path.join(__dirname, '../py-api/.venv')
if (!fs.existsSync(venvPath)) fs.mkdirSync(venvPath)

/* Set node-gyp path, avoid 403 handle issue of current default node-gyp used by node (v5.0.5)*/
const gypPath = path.join(__dirname, '../node_modules/node-gyp/bin/node-gyp.js')
const npmrcPath = path.join(__dirname, '../.npmrc')
let npmrc = fs.readFileSync(npmrcPath).toString()
npmrc = npmrc.replace(/^node_gyp.*$/m, `node_gyp="node ${gypPath}"`)
fs.writeFileSync(npmrcPath, npmrc)