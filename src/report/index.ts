import * as Sentry from 'sentry-mina'
import config from './config'

Sentry.init({
  dsn: config.dsn
})

/** 配置额外信息 */
Sentry.configureScope((scope) => {
  scope.setExtra('version', config.version)
})

/** 捕获并记录 setTimeout、setInterval 内的异常 */
/* eslint-disable no-new */
new Sentry.Integrations.TryCatch()

/** 记录 app.onError 和 app.onPageNotFound 日志 */
/* eslint-disable no-new */
new Sentry.Integrations.GlobalHandlers()
