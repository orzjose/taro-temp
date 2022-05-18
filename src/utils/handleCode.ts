import Taro from '@tarojs/taro'
import utils from '@/utils'

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
 * 异常 code 码处理
 * @param {number} code 请求状态码
 * @param {string} message 请求异常信息
 */
function handleCode(code, message = '网络异常') {
  const { route } = Taro.getCurrentPages().pop() as any
  // 判断用户是否已经注册，如果未注册，则跳转到登录页
  if (code === 412) {
    showModal(
      '提示',
      '您还没有注册，请重新登录注册',
      (res) => res.confirm && route !== 'pages/login/index' && Taro.navigateTo({ url: '/pages/login/index' })
    )
    return
  }
  /**
   * 403：用户被冻结 (提示并跳转到登录页)
   */
  if (code === 403) {
    showModal(
      '账号已停用',
      '您的账号已被平台停用，如有疑问请联系客服400-628-0808转3',
      (res) => res.confirm && route !== 'pages/login/index' && Taro.navigateTo({ url: '/pages/login/index' })
    )
    return
  }

  /** 其他异常处理 */
  let errMsg: string = ''
  if (code === 0) {
    /** 请求未发出，如网络不可用、baseURL不正确等 */
    errMsg = '网络异常，请稍后重试'
  } else if (code === 1) {
    /** 请求超时 */
    errMsg = '请求超时，请稍后重试'
  } else if (code === 404) {
    errMsg = '请求链接未找到，请稍后重试'
  } else if (/^5\d{2}/.test(code)) {
    errMsg = '服务器异常，请稍后重试'
  }
  if (errMsg) {
    utils.showToast(errMsg || message)
  }
}

export default handleCode
