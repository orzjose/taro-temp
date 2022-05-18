import Taro from '@tarojs/taro'

export default function checkVersion() {
  if (Taro.getUpdateManager) {
    const updateManager = Taro.getUpdateManager()
    updateManager.onCheckForUpdate((res) => {
      if (!res.hasUpdate) {
        return
      }
      updateManager.onUpdateReady(() => {
        Taro.showModal({
          title: '更新提示',
          content: '新版本已准备好，请先更新到最新版本再使用',
          success(rs) {
            if (rs.confirm) {
              updateManager.applyUpdate()
            }
          }
        })
      })
      updateManager.onUpdateFailed(() => {
        Taro.showModal({
          title: '已经有新版本咯~',
          content: '请您退出当前微信，重新登录微信，再次打开当前小程序'
        })
      })
    })
  }
}
