import Taro from '@tarojs/taro'
import { captureMessage, captureException } from 'sentry-mina'
import Decimal from 'big.js'
import store from '@/store'
import login from '@/utils/login'
import appConfig from '@/config'

const menuButtonInfo = Taro.getMenuButtonBoundingClientRect
  ? Taro.getMenuButtonBoundingClientRect()
  : null
const systemInfo = Taro.getSystemInfoSync()

type utils = {
  isIphoneX: boolean;
  isIOS: boolean;
  isProd: boolean;
  navHeight: number;
  menuButtonInfo: any;
  systemInfo: any;
  showToast: (message?: string) => void;
  checkWxSessionKey: () => Promise<string>;
  getStoreAccessToken: (url?: string) => string;
  fenToWan: (fen: number) => string;
  fenToYuan: (fen: number, dig?: number) => number | string;
  kilometerToWanKilometer: (kilometer: number) => number;
  goHome: () => void;
  goBack: () => void;
  log: () => void;
  reportMessage: (msg: String) => void;
  reportException: (err: Error) => void;
  getDistance: (lat1: number, lng1: number, lat2: number, lng2: number) => number;
  addHalfHour: (ting: string) => string;
  isTabPage: (url: string) => boolean;
  getPageUrlWithArgs: (any) => string;
  showModal: (params: any) => void;
  wanToFenByDecimal: (val: number) => number
  compactObj: (obj: {[k:string]: any}) => {[k:string]: any} | any
  cashToChinese: (val: number | string) => string
  formatNumberThousands: (val: number | string) => string
}

const utils: utils = {
  /**
   * 是否是 iphonex
   */
  isIphoneX: systemInfo.model.toLowerCase().indexOf('iphone x') > -1,

  /**
   * 是否是IOS系统
   */
  isIOS: systemInfo.platform.toLowerCase() === 'ios',

  /**
   * 是否是生产环境
   */
  isProd: appConfig.env === 'production',

  /**
   * 自定义导航栏高度
   */
  navHeight: menuButtonInfo && menuButtonInfo.top ? menuButtonInfo.top + 38 : 26 + 38,

  /**
   * 右上角胶囊按钮的位置信息
   */
  menuButtonInfo,

  /**
   * 系统信息
   */
  systemInfo,
  /**
   * 吐司
   * @param {string} message 信息
   */
  showToast(message?: string): void {
    Taro.showToast({
      icon: 'none',
      title: message || '网络异常，请稍后重试',
      duration: 2000
    })
  },

  /**
   * 校验 session_key 是否有效，失效则重登
   */
  checkWxSessionKey(): Promise<string> {
    return new Promise((resolve) => {
      Taro.checkSession()
        .then(() => {
          resolve('')
        })
        .catch(() => {
          login().then(() => {
            resolve('')
          })
        })
    })
  },

  /**
   * 获取 store 中的 access_token
   */
  getStoreAccessToken(url = ''): string {
    let accessToken = ''
    if (url === '/base_cars') {
      accessToken = Taro.getStorageSync('access_token') // 绑定车辆需要更新token（验证码）
    } else {
      accessToken = store.getState().common.accessToken
    }
    return accessToken
  },

  /**
   * 分元转万元
   * @param {number} fen 分
   * @return {number} 万元
   */
  fenToWan(fen: number): string {
    return (fen / 1000000).toFixed(2)
  },

  /**
   * 万元转分
   * @param val 价格
   */
  wanToFenByDecimal(val) {
    return new Decimal(+val).times(1000000).toNumber()
  },

  /**
   * 分元转元
   * @param {number} fen 分
   * @return {number} 万元
   */
  fenToYuan(val: number, dig: number = 2): number | string {
    if (val !== null && val !== undefined) {
      return (+val / 100).toFixed(dig)
    }
    return '--'
  },

  /**
   * 公里转万公里
   * @param {number} kilometer 公里
   * @return {number} 万公里
   */
  kilometerToWanKilometer(kilometer: number): number {
    return +(kilometer / 10000).toFixed(2)
  },

  /**
   * 回首页
   */
  goHome(): void {
    Taro.reLaunch({
      url: appConfig.homePageURL
    })
  },

  /**
   * 返回上一页或上二页（未登录场景：登录成功后返回不需要再返回登录页，直接返回上一页）
   */
  goBack(): void {
    let isLogin = false
    const pages = Taro.getCurrentPages()
    const prePage = pages[pages.length - 2]?.route
    if (prePage === 'page/login/index') {
      isLogin = true
      Taro.navigateBack({
        delta: 2
      })
    }
    if (isLogin) return

    if (Taro.getCurrentPages().length > 1) {
      Taro.navigateBack({
        delta: 1
      })
      return
    }
    Taro.reLaunch({
      url: appConfig.homePageURL
    })
  },

  /**
   * 输出日志，仅在测试环境
   */
  log(...args): void {
    if (!utils.isProd) {
      console.log(...args)
    }
  },

  /**
   * 上报信息，仅在生产环境
   * @param {string} msg 信息
   */
  reportMessage(msg: string): void {
    if (utils.isProd) {
      captureMessage(msg)
    }
  },

  /**
   * 上报异常，仅在生产环境
   * @param {Error} err 异常
   */
  reportException(err: Error): void {
    if (utils.isProd) {
      captureException(err)
    }
  },

  /**
   * 计算两坐标点之间的距离
   * @param {*} lat1 第一个点纬度
   * @param {*} lng1 第一个点经度
   * @param {*} lat2 第二个点纬度
   * @param {*} lng2 第二个点经度
   * @returns
   */
  /* eslint-disable no-restricted-properties */
  getDistance(lat_1, lng_1, lat_2, lng_2) {
    const lat1 = lat_1 || 0
    const lng1 = lng_1 || 0
    const lat2 = lat_2 || 0
    const lng2 = lng_2 || 0
    const rad1 = (lat1 * Math.PI) / 180.0
    const rad2 = (lat2 * Math.PI) / 180.0
    const a = rad1 - rad2
    const b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0
    const r = 6378137
    return parseInt(
      (
        r
        * 2
        * Math.asin(
          Math.sqrt(
            Math.pow(Math.sin(a / 2), 2)
              + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)
          )
        )
      ).toFixed(0),
      10
    )
  },

  /**
   * 针对养修预约模块中出现大量形如 2018-12-02 09:00 要展示成 2018-12-02 09:00 -- 09：30
   * @param timeStr 2018-12-02 09:00 || 09:00
   * @returns {string} 2018-12-02 09:00 -- 09：30 || 09:00 -- 09：30
   */
  addHalfHour(timeStr) {
    if (!timeStr || !timeStr.indexOf(':')) {
      return timeStr
    }
    const arr = timeStr.split(':')
    const toTen = (num) => (num < 10 ? `0${num}` : `${num}`)
    const hour = arr[0].length === 2 ? arr[0] : arr[0].substr(11)
    const halfHourLater = +arr[1] >= 30 ? `${toTen(Math.floor(+hour) + 1)}:00` : `${hour}:30`
    return `${timeStr}-${halfHourLater.length <= 5 ? halfHourLater : halfHourLater.substr(11)}`
  },

  /**
   * 判断页面是否是 tab 页面
   * @param url 需要判断的页面
   * @return {boolean}
   */
  isTabPage(url) {
    const tabs = Taro.getApp().config.tabBar.list.map((i) => `/${i.pagePath}`)
    return tabs.includes(url)
  },

  /**
   * 获取某个页面完整 url
   * page: Taro.getCurrentPages()获取到的page对象
   */
  getPageUrlWithArgs(page) {
    const { route = '', options = {} } = page

    if (!route) {
      return ''
    }

    let qs = '';
    (Object.keys(options) || []).forEach((key) => {
      qs += `&${key}=${options[key]}`
    })

    return `/${route}?${qs.slice(1)}`
  },
  // 公共弹窗方法
  showModal(params) {
    Taro.showModal({
      ...params,
      confirmColor: '#fe6210',
      cancelColor: '#747885'
    })
  },
  // 压缩对象，清除空属性
  compactObj(obj) {
    const isObj = (item) => {
      return Object.prototype.toString.call(item) === '[object Object]'
    }
    if (!isObj(obj)) return obj
    Object.keys(obj).forEach((k) => {
      if (isObj(obj[k])) {
        this.compactObj(obj[k])
      } else if (obj[k] === '' || obj[k] === null || obj[k] === undefined) {
        // eslint-disable-next-line no-param-reassign
        delete obj[k]
      }
    })
    return obj
  },
  /**
   * 金额转大写
   */
  cashToChinese(val) {
    const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
    const largeUnits = ['元', '万', '亿']
    const units = ['', '拾', '佰', '仟']
    const fractions = ['角', '分']
    let cStr = ''
    const cash = val.toString()
    if (cash === '' || cash === undefined || cash === null) {
      return cStr
    }
    const preCash = cash.split('.')[0] || ''
    const lastCash = cash.split('.')[1] || '00'
    if (preCash.length > 12 || lastCash.length > 2) {
      return cStr
    }
    // 遍历小数位
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < fractions.length; i++) {
      cStr += (digits[lastCash.charAt(i)] + fractions[i]).replace(/零./, '')
    }
    cStr = cStr || '整'
    // 遍历整数位，用str来记录每4位的值
    // eslint-disable-next-line no-plusplus
    for (let i = preCash.length - 1, n = 0, str = ''; i >= 0; i--) {
      let largeUnit = ''
      str = (digits[preCash[i]] + units[n % 4]) + str
      // 用n计数每隔4位，或者遍历到头的时候加单位（'元','万','亿'）
      if ((n + 1) % 4 === 0 || i === 0) {
        largeUnit = largeUnits[Math.floor(n / 4)]
        // 考虑替换末位全是0时替换位空 或者中间连续0时替换为零
        str = str.replace(/(零.)*零$/g, '').replace(/(零.)+/g, '零')
        str += largeUnit
        cStr = str + cStr
        str = ''
      }
      // eslint-disable-next-line no-plusplus
      n++
    }
    // 考虑处理（'元','万','亿'）单位前为10的情况，和整数位为0的情况
    return cStr.replace(/壹拾(.){0,1}([元|万|亿])/g, '拾$1$2').replace(/^元/, '')
  },
  /**
   * 数字格式化（千分位加逗号）
   */
  formatNumberThousands(n) {
    if (n < 1) return n.toString()
    const num = n.toString()
    let decimals = ''
    // 判断是否有小数
    // eslint-disable-next-line prefer-destructuring
    if (num.indexOf('.') > -1) { decimals = num.split('.')[1] }
    const len = num.length
    if (len <= 3) {
      return num
    }
    let temp = ''
    const remainder = len % 3
    if (decimals) { temp = `.${decimals}` }
    if (remainder > 0) { // 不是3的整数倍
      return `${num.slice(0, remainder)},${(num.slice(remainder, len).match(/\d{3}/g) || []).join(',')}${temp}`
    } // 是3的整数倍
    return (num.slice(0, len).match(/\d{3}/g) || []).join(',') + temp
  }
}

export default utils
