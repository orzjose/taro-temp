/* eslint-disable import/no-commonjs */
// 小程序持续集成: https://developers.weixin.qq.com/miniprogram/dev/devtools/skeleton.html

const ci = require('miniprogram-ci')
const fs = require('fs')
const path = require('path')
const unzip = require('unzip')

const projectPath = path.resolve(__dirname, '../')
const privateKeyPath = path.resolve(__dirname, '../private.key')
const sourceMapSavePath = path.resolve(__dirname, '../sm.zip')
const unarchivePath = path.resolve(__dirname, '../unarchive')
const versionDesc = process.env.VERSION_DESC || 'update'
const robot = Math.floor(Math.random() * 30)

const appid = require('../dist/project.config.json').appid

console.log('appid:', appid)
const pkg = require('../package.json')

pkg.version += process.env.VERSION_AUTHOR

const isProduction = process.env.RUN_ENV === 'production'
console.log('production env:', isProduction)

// CI项目实例
const project = new ci.Project({
  appid,
  type: 'miniProgram',
  projectPath,
  privateKeyPath,
  ignores: ['node_modules/**/*'],
})

// 上传
// eslint-disable-next-line no-shadow
const upload = async (project, desc = 'update', robot = 2) => {
  try {
    const uploadResult = await ci.upload({
      project,
      version: pkg.version,
      desc,
      setting: {
        es6: false,
      },
      onProgressUpdate: () => {},
      robot,
    })
    console.log('uploadResult:', uploadResult)
  } catch (e) {
    console.log('upload:', e)
    process.exit = 1
  }
}
// 获取sourceMap
// eslint-disable-next-line no-shadow
const getSourceMap = async (project, robot = 2) => {
  try {
    await ci.getDevSourceMap({
      project,
      robot,
      sourceMapSavePath,
    })
    // 解压缩
    fs.createReadStream(sourceMapSavePath).pipe(unzip.Extract({ path: unarchivePath }))
  } catch (e) {
    console.log('getSourceMap:', e)
    process.exit = 1
  }
}
console.log('robot:', robot)
upload(project, versionDesc, robot)

