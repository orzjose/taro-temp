/* eslint-disable import/no-commonjs */
import Taro from '@tarojs/taro'
import utils from '@/utils'
import login from '@/utils/login'
import appConfig from '@/config'
import handleCode from './handleCode'
import whiteListUrl from '@/config/whiteListUrl'

const Fly = require('flyio/dist/npm/wx')

/**
 * 合并 header
 * @param {object} options 配置项
 */
function mergeOptions(options) {
  const defaultOptions = {
    headers: {
      'channel-type': 'wx',
      'content-type': 'application/json'
    }
  }
  return Object.assign(defaultOptions, options)
}

type Options = {
  baseURL: string;
  timeout: number;
  autoHandleCode: boolean;
}

type Headers = {
  [propName: string]: string;
}

type CustomOptions = {
  /** 自定义基础 url */
  baseURL?: string;
  /** 是否自动处理 code，默认 true */
  autoHandleCode?: boolean;
  /** 自定义头部 */
  headers?: Headers;
}

const initialOptions: Options = {
  baseURL: '',
  timeout: 10000,
  autoHandleCode: true
}

const accountInfo = Taro.getAccountInfoSync()

/**
 * ajax 封装
 */
class Ajax {
  private options: Options;
  private fly: typeof Fly;

  public constructor(options: Options = initialOptions) {
    this.options = options
    this.fly = new Fly()

    /** 拦截器 */
    this.setInterceptor()
  }

  /**
   * 发送请求
   * @param {string} url 请求 url
   * @param {object} data 参数
   * @param {object} options 配置项
   */
  request(url, data, options) {
    return this.fly.request(url, data, options)
  }

  /**
   * 拦截器
   */
  private setInterceptor() {
    let isAuthorizing: boolean = false

    /**
     * 请求拦截器
     */
    this.fly.interceptors.request.use((request) => {
      // @ts-ignore
      utils.log('request: ', request)
      // Taro.showLoading({
      //   title: '加载中...',
      //   mask: true
      // })

      // 携带小程序appid
      request.headers['X-APPID'] = accountInfo.miniProgram.appId

      // 白名单中的url无须携带access_token
      const isWhiteListUrl = whiteListUrl.find(url => request.url.indexOf(url) > 0 || request.url === url)
      if (isWhiteListUrl !== undefined) return request

      /** 设置请求 access token，继续请求 */
      const accessToken = utils.getStoreAccessToken(request.url)
      if (accessToken) {
        request.headers['access-token'] = accessToken
        return request
      }

      /**
       * 无 token，锁定拦截器，后续请求排队
       * 执行登录异步任务，完成后再解锁拦截器，继续请求队列任务
       */
      this.fly.lock()
      try {
        login().then((accessToken) => {
          if (accessToken) {
            request.headers['access-token'] = accessToken
          }
          this.fly.unlock()
          return request
        })
      } catch (error) {
        this.fly.unlock()
      }
      return request
    })

    /**
     * 响应拦截器
     */
    this.fly.interceptors.response.use(
      (response) => {
        /** 请求成功 */
        // @ts-ignore
        // Taro.hideLoading()
        const { data, request } = response

        /** 处理 code 为非 0 */
        if (data.code !== 0 && request.autoHandleCode) {
          utils.showToast(data.message)
          return Promise.reject(data)
        }

        return data
      },
      (reason) => {
        /** 请求失败 */
        // Taro.hideLoading()

        // @ts-ignore
        utils.log('response fail: ', reason)
        const { status, request, response: { data } } = reason

        /**
         * 401 处理，token 无效，锁定拦截器，后续请求排队
         * 登录完成再解锁拦截器，并重新发起当前请求，继续请求队列任务
         */
        if (status === 401) {
          /** 前面有请求正在进行授权，则重新发起该请求，进入请求队列 */
          if (isAuthorizing) {
            return this.fly.request(request)
          }

          isAuthorizing = true
          this.fly.lock()

          return login()
            .then((accessToken) => {
              request.headers['access-token'] = accessToken
              isAuthorizing = false
              this.fly.unlock()
              this.fly.request(request)
            })
        }
        handleCode(status, data.message)

        /** 请求异常上报，网络异常不上报 */
        if (status !== 0) {
          utils.reportException(reason)
        }
        return reason
      }
    )
  }

  /**
   * get 方法封装
   * @param {string} path 请求路径
   * @param {object} customOptions 自定义配置项
   */
  public query(path: string = '', customOptions: CustomOptions = {}) {
    return (data = {}, expandURL: string = '') => {
      /** null 转为空串 */
      Object.keys(data).forEach((k) => {
        /* eslint-disable no-param-reassign */
        if (data[k] === null) {
          data[k] = ''
        }
      })

      const reqURL: string = expandURL ? `${path}/${expandURL}` : path
      const reqOptions = mergeOptions({
        ...this.options,
        ...customOptions,
        method: 'GET'
      })
      return this.request(reqURL, data, reqOptions)
    }
  }

  /**
   * post 方法封装
   * @param {string} path 请求路径
   * @param {object} customOptions 自定义配置项
   */
  public create(path: string = '', customOptions: CustomOptions = {}) {
    return (data = {}, expandURL: string = '') => {
      const reqURL: string = expandURL ? `${path}/${expandURL}` : path
      const reqOptions = mergeOptions({
        ...this.options,
        ...customOptions,
        method: 'POST'
      })
      return this.request(reqURL, data, reqOptions)
    }
  }

  /**
   * put 方法封装
   * @param {string} path 请求路径
   * @param {object} customOptions 自定义配置项
   */
  public putWay(path: string = '', customOptions: CustomOptions = {}) {
    return (data = {}, expandURL: string = '') => {
      const reqURL: string = expandURL ? `${path}/${expandURL}` : path
      const reqOptions = mergeOptions({
        ...this.options,
        ...customOptions,
        method: 'PUT'
      })
      return this.request(reqURL, data, reqOptions)
    }
  }

  /**
   * delete 方法封装
   * @param {string} path 请求路径
   * @param {object} customOptions 自定义配置项
   */
  public delete(path: string = '', customOptions: CustomOptions = {}) {
    return (data = {}, expandURL: string = '') => {
      const reqURL: string = expandURL ? `${path}/${expandURL}` : path
      const reqOptions = mergeOptions({
        ...this.options,
        ...customOptions,
        method: 'DELETE'
      })
      return this.request(reqURL, data, reqOptions)
    }
  }
}

export default new Ajax({
  baseURL: appConfig.baseURL,
  timeout: 10000,
  autoHandleCode: true
})
