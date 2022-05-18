/**
 * sentry 配置
 */
type Config = {
  dsn: string;
  version: string;
}

const config: Config = {
  dsn: 'https://57b5a5c4bccf4ce7944170af2921f4e2@sentry.lixinio.com/634',
  version: VERSION
}

export default config
