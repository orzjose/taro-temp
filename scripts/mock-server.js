/* eslint-disable import/no-commonjs */
const Koa = require('koa')
const path = require('path')
const Mock = require('mockjs')

const mockRules = require(path.resolve(__dirname, '..', 'mock'))
const { mockServerPort: port } = require(path.resolve(__dirname, '..', 'config/dev'))
// const { IPAdress: host } = require('./utils')

const app = new Koa()

const request = (ctx, next) => {
  let { method, url } = ctx.request
  url = url.slice(0, url.indexOf('?') !== -1 ? url.indexOf('?') : url.length + 1)
  const rule = mockRules.find((r) => {
    return r.regex.test(url) && method === r.method.toLocaleUpperCase()
  })
  if (!rule) {
    ctx.status = 404
    return
  }
  // 生成 template 数据
  ctx.body = Mock.mock(rule.mockData)
}

app
  .use(request)
  .listen(port, () => {
    console.log(`mock server start success ip: localhost host: ${port}`)
  })