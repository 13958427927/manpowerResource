// 对axios二次封装
import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'
// 创建了一个新的axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // 超时时间
})

service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  Promise.reject(new Error(error))
})

service.interceptors.response.use(response => {
  // 1. 考虑把那些数据跑出去
  // 2. 接口成功 并且 业务成功
  // 3. 没有成功 Promise.reject 抛出错误
  // console.log(response)
  const { data, message, success } = response.data
  if (success) { // 业务逻辑成功
    return data
  }
  // 业务没成功
  Message.error(message)
  return Promise.reject(new Error(message))
}, error => {
  Message.error(error.message)
  return Promise.reject(error)
})

export default service // 导出axios实例
