/* eslint-disable import/no-commonjs */
const gulp = require('gulp')
const aoss = require('./ali-oss')
const argv = require('yargs').argv
const path = require('path')
const fs = require('fs-extra')

/**
 * 上传 cdn 文件
 */
gulp.task('oss', function () {
  const { ACCESSKEYID, ACCESSKEYSECRET } = process.env
  const options = {
    prefix: argv.prefix,
    accessKeyId: ACCESSKEYID,
    accessKeySecret: ACCESSKEYSECRET,
    region: 'oss-cn-shanghai',
    bucket: 'lixin-assets'
  }
  return gulp
    .src([path.resolve(__dirname, '..', 'src/assets/remote-images/**/*.*')])
    .pipe(aoss(options))
})

/**
 * 清除文件
 */
gulp.task('clean', function (done) {
  const { type } = argv

  // dist
  if (type === 'dist') {
    fs.removeSync('../dist')
  }

  // mock
  if (type === 'mock') {
    fs.removeSync('../dist/mock')
    fs.removeSync('../dist/npm/mockjs')
  }

  done()
})

/**
 * 根据环境设置对应的appid
 */
gulp.task('setappid', done => {
  const isProd = process.env.RUN_ENV === 'production'
  const projectConfig = fs.readJSONSync('../project.config.json')
  projectConfig.appid = isProd ? 'wx37628a5b2973866c' : 'wx7f220a34b47a7627'
  console.log('appid::', projectConfig.appid, process.env.RUN_ENV)
  fs.writeJSONSync('../project.config.json', projectConfig)
  done()
})

/**
 * 用途：拷贝 wxapp-lui 到 src 静态资源目录
 */
gulp.task('copyWxappluiToSrcAssets', function () {
  const sourcePath = path.resolve(__dirname, '../node_modules/@lx-frontend/wxapp-lui/dist/**/*');
  const targetPath = path.resolve(__dirname, '../src/assets/wxapp-lui');
  return gulp.src(sourcePath)
    .pipe(gulp.dest(targetPath));
})
