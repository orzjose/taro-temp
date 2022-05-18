import Taro from '@tarojs/taro'
import appConfig from '@/config'
import utils from '@/utils'

/**
 * 上传图片
 */
export const uploadOcrImage = async (filePath :string): Promise<string> => {
  Taro.showLoading({
    title: '加载中...',
    mask: true
  })

  const { statusCode, data: uploadFileRes } = await Taro.uploadFile({
    url: `${appConfig.baseURL}/upload/ocr_vehicle_license`,
    filePath,
    name: 'file',
    header: { 'access-token': utils.getStoreAccessToken() }
  })
  Taro.hideLoading()

  if (statusCode !== 200) {
    if (statusCode === 413) {
      utils.showToast('图片过大，请重新选择')
      throw new Error('图片过大，请重新选择')
    }
    utils.showToast('图片上传失败，请稍后重试')
    utils.reportException(new Error(uploadFileRes))
    throw new Error('图片上传失败，请稍后重试')
  }

  /** 默认返回字符串格式数据 */
  const uploadFileObj = JSON.parse(uploadFileRes)
  const { code, message, data: fileURL } = uploadFileObj

  if (code !== 0) {
    const msg = message || '图片上传失败，请稍后重试'
    utils.showToast(msg)
    utils.reportException(uploadFileObj)
    throw new Error(msg)
  }

  return fileURL
}
