export default {
  /** 车牌号校验，历史数据有小写 */
  regexp_car_plate_number: /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z0-9]{4,5}[A-Z0-9\u4e00-\u9fa5]{1}$/i,
  /** 车架号 */
  regexp_car_vin: /^[A-HJ-NPR-Z\d]{17}$/i,
  /** 发动机号后六位 */
  regexp_car_engine_number: /^[A-Za-z0-9]{6}$/,
  /** 手机号 */
  regexp_mobile: /^1\d{10}$/,
  /** 手机号中间4位显示* */
  regexp_mobile_star: /(\d{3})\d{4}(\d{4})/,
  /** vin最后7位显示* */
  regexp_vin_star: /(\w{10})\w{7}/,
  /** 身份证 */
  regexp_idcard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
}
