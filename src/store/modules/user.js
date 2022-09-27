import { login } from '@/api/login'
import { getuserInfo, getUserDetailById } from '@/api/user'
export default {
  namespaced: true,
  state: {
    token: null,
    userInfo: {},
    hrsaasTime: 0
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_USER_INFO(state, userInfo) {
      // console.log('userInfo', userInfo)
      state.userInfo = userInfo || {}
    },
    RMOVE_USER_INFO(state) {
      state.userInfo = {}
    },
    RMOVE_TOKEN(state) {
      state.token = null
    },
    SET_HRSAA_TIME(state, hrsaasTime) {
      state.hrsaasTime = hrsaasTime
    }
  },
  actions: {
    async loginAction({ commit }, loginData) {
      // 接口
      const data = await login(loginData)
      commit('SET_TOKEN', data)
      commit('SET_HRSAA_TIME', new Date().getTime())
    },
    async getUserInfo({ commit }) {
      const res = await getuserInfo()// result就是用户的基本资料
      const res1 = await getUserDetailById(res.userId)// 为了获取头像
      const result = { ...res, ...res1 }// 将两个接口结果合并
      commit('SET_USER_INFO', result) // 把两个接口的内容存到state里面
      return JSON.parse(JSON.stringify(res)) // 后面会用
    },
    logout({ commit }) {
      // 清除用户数据  token
      commit('RMOVE_USER_INFO')
      commit('RMOVE_TOKEN')
    }
  }
}
