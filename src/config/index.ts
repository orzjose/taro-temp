/**
 * 不同环境配置
 */
type Config = {
  readonly rootURL: string;
  readonly baseURL: string;
  readonly cdnURL: string;
  readonly homePageURL: string;
}

type Configs = {
  readonly development: Config;
  readonly testing: Config;
  readonly production: Config;
}

type CommonConfig = {
  env: string;
  authURL: string;
}

type EnvConfig = Config & CommonConfig;

const configs: Configs = {
  development: {
    rootURL: '',
    baseURL: '',
    cdnURL: '',
    homePageURL: '/pages/index/index',
  },
  testing: {
    rootURL: '',
    baseURL: '',
    cdnURL: '',
    homePageURL: '/pages/index/index',
  },
  production: {
    rootURL: '',
    baseURL: '',
    cdnURL: '',
    homePageURL: '/pages/index/index',
  },
};

const env: string = process.env.RUN_ENV;
const config: Config = configs[env];
const commonConfig: CommonConfig = {
  env,
  authURL: '/auth/login',
};
// @ts-ignore
// const baseURL: string = process.env.MOCK === 'true' ? mock_base_url : config.baseURL;
const baseURL: string = process.env.MOCK === 'true' ? `http://localhost:3000/api/v1` : config.baseURL;

const envConfig: EnvConfig = {
  ...config,
  ...commonConfig,
  baseURL,
};

export default envConfig;
