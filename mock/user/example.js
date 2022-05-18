/**
 * 用户模块
 */
module.exports = [
  /**
   * 获取用户个人信息
   */
  [/user\/profile$/, 'get', {
    'code': 0,
    'message': 'ok',
    'data': {
      'nick_name': 'tom',
      'gender': 1,
      'city': 'Shenzhen',
      'province': 'Guangdong',
      'country': 'China',
      'avatar': 'https://dummyimage.com/80x80/eee/eee',
      'mobile_number': '17711111111'
    }
  }]

]
