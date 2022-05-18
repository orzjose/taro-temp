/**
 * 网络请求配置清单
 */
import ajax from '@/utils/ajax'

export default {
  /**
   * 基础模块
   */
  base: {
    getCarModels: ajax.query(`${CDN_URL}/carModels.json`),
    getCarConfig: ajax.query(`${CDN_URL}/carConfig.json`)
  }
}
