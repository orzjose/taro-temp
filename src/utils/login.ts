/* eslint-disable import/no-commonjs */
import Taro from '@tarojs/taro'
import utils from '@/utils'
import store from '@/store'
import { actions as commonActions } from '@/store/common'
import appConfig from '@/config'
import handleCode from './handleCode'

const Fly = require('flyio/dist/npm/wx')

const fly: typeof Fly = new Fly()
const timeout: number = 10000
const { baseURL, authURL } = appConfig
const accountInfo = Taro.getAccountInfoSync()

/**
 * 提示框封装
 * @param {string} content 展示内容
 * @param {function} success 回调
 */
function showModal(title, content, success = any => any) {
  utils.showModal({
    title,
    content,
    showCancel: false,
    confirmText: '我知道了',
    success
  })
}

/**
 * 登录授权
 */
async function login() {
  // Taro.showLoading({
  //   title: '加载中...',
  //   mask: true
  // })

  /** 获取微信 code */
  const { code: wxCode } = await Taro.login()
  // return
  // @ts-ignore
  const params = {
    code: wxCode,
    type: 1 // 1: 微信登录；2: 手机号登录
  }

  fly.interceptors.request.use((request) => {
    // 携带小程序appid
    request.headers['X-APPID'] = accountInfo.miniProgram.appId
    return request
  })

  /** 发送请求 */
  /* eslint-disable consistent-return */
  return fly.post(baseURL + authURL, params, { timeout })
    .then((response) => {
      /** 请求成功 */
      // Taro.hideLoading()

      const { code, data } = response.data
      if (code !== 0) {
        throw response
      }

      /** 授权成功，分发 access token */
      store.dispatch(commonActions.updateAccessToken(data.access_token))
      return data.access_token
    })
    .catch((reason) => {
      /** 请求失败 */
      // Taro.hideLoading()
      // @ts-ignore
      utils.log('login fail: ', reason)
      const { status, response: { data } } = reason
      if (status !== 0) {
        handleCode(status, data.message)
        // throw response
      }

      /** 请求异常上报，网络异常不上报 */
      if (reason.status !== 0) {
        utils.reportException(reason)
      }
      throw reason
    })
}

export default login
