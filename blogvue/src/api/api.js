import axios from 'axios'
import { message } from 'ant-design-vue'

/**
 * ajax请求通用方法，基于axios
 * @param {String} method  异步请求的方式，如：post、get等
 * @param {String} url     异步请求的地址
 * @param {Object} data    发送的数据
 * @param {Boolean} withCredentials
 */
const api = (params)=>{
  const { method, url, data, withCredentials = true } = params
  return new Promise((resolve, reject) => {
    axios({
      method: method,
      url: url,
      data: data,
      withCredentials: withCredentials
    })
      .then(res => {
        const result = res.data
        if (result.success) {
          result.message && message.success(result.message)
          resolve(result.data)
        } else {
          result.message && message.warning(result.message)
          if (result.unlogin) {
            if (window.location.pathname !== '/login') {
              window.location.href = window.location.origin + '/login'
            }
          }
        }
      })
      .catch(error => {
        message.error( '服务器异常，请联系网站工作人员处理！', 2)
        reject(error)
      })
  })
}

export default api
