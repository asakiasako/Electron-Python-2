const fs = require('fs')
const path = require('path')

/* Set node-gyp path, avoid 403 handle issue of current default node-gyp used by node (v5.0.5)*/
const gypPath = path.join(__dirname, '../node_modules/node-gyp/bin/node-gyp.js')
const npmrcPath = path.join(__dirname, '../.npmrc')
let npmrc = fs.readFileSync(npmrcPath).toString()
npmrc = npmrc.replace(/^node_gyp.*$/m, `node_gyp=${gypPath}`)
fs.writeFileSync(npmrcPath, npmrc)