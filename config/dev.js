/* eslint-disable import/no-commonjs */
const { IPAdress } = require('../scripts/utils')
const path = require('path')

const mockServerPort = 3000

module.exports = {
  env: {
    NODE_ENV: '"production"',
    RUN_ENV: '"development"',
    MOCK: process.env.MOCK === 'true' ? '"true"' : '"false"'
  },
  defineConstants: {
    MOCK_BASE_URL: `http://${IPAdress}:${mockServerPort}/api/v1`,
    CDN_URL: '"https://g.lxstatic.com/dos/car-shopping-mall/dev"'
  },
  mockServerPort,
  mini: {},
  h5: {}
}
