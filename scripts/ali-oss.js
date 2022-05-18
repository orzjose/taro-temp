/* eslint-disable import/no-commonjs */
/**
 * 通过jssdk管理阿里oss
 */
var path = require('path')
var through2 = require('through2')
var OSS = require('ali-oss')

var client = null

async function put(prefix, file, maxAge) {
  try {
    const dest = prefix + '/' + path.relative(file.base, file.path).replace(/\\/g, '/')
    // 上传文件
    await client.put(dest, file.path, {
      headers: {
        'Cache-Control': 'max-age=' + maxAge // 默认缓存一年
      }
    })
  } catch (e) {
    process.exitCode = 1
    console.log(e)
  }
}

function oss(options) {
  if (!client) {
    client = new OSS({
      accessKeyId: options.accessKeyId,
      accessKeySecret: options.accessKeySecret,
      region: options.region,
      bucket: options.bucket
    })
  }
  // 缓存时间，默认一年
  const maxAge = options.maxAge || 3600 * 24 * 365
  // 通过through2获取文件
  return through2.obj(function (file, enc, cb) {
    if (file.isDirectory()) return cb()
    if (file.isStream()) {
      return cb()
    }
    put(options.prefix, file, maxAge)
    return cb()
  })
}

module.exports = oss;
