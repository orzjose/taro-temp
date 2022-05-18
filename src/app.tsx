import { Component } from 'react'
import { Provider } from 'react-redux'
import Taro from '@tarojs/taro'
import utils from '@/utils'
import checkVersion from '@/utils/check-version'
import '@/styles/index.less'
import store from './store'

import './app.less'

// lodash 的 polyfill
Object.assign(global, {
  Array,
  Date,
  Error,
  Function,
  Math,
  Object,
  RegExp,
  String,
  TypeError,
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval
})

class App extends Component {
  constructor(props) {
    super(props)

    /** 生产环境数据上报 */
    if (utils.isProd) {
      require('./report')
    }

    /** 检测版本 */
    checkVersion()
  }

  onLaunch() {
    Taro.loadFontFace({
      family: 'NOBK',
      source: `url("${CDN_URL}/font/NOBK____0.ttf")`,
      global: true
    })
  }

  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    )
  }
}

export default App
