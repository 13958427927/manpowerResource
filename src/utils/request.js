// 对axios二次封装
import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'
const TimeOut = 3600

function IsCheckTimeOut() {
  const currentTime = Date.now()
  const timeStamp = (currentTime - store.getters.hrsaasTime) / 1000
  return timeStamp > TimeOut // ture 超时 / false
}

// 创建了一个新的axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // 超时时间
})

service.interceptors.request.use(config => {
  if (store.getters.token) {
    // 时间二 - 时间一 > token 超时的时间  ==》 token 登陆失败
    if (IsCheckTimeOut()) { // 超时
      store.dispatch('user/logout')
      router.push('login')
      return Promise.reject(new Error('请求超时'))
    }
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
  // error 信息 里面 response的对象
  if (error.response && error.response.status === 401) {
    // 当等于401的时候 表示 后端告诉我token超时了
    store.dispatch('user/logout')// 登出action 删除token
    router.push('login')
    Message.error('token超时')
  } else {
    Message.error(error.message)// 提示错误信息
  }
  return Promise.reject(error)
})

export default service // 导出axios实例
