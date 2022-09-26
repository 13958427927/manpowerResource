import { login } from '@/api/login'
import { getuserInfo, getUserDetailById } from '@/api/user'
export default {
  namespaced: true,
  state: {
    token: null,
    userInfo: {}
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo
    },
    RMOVE_USER_INFO(state) {
      state.userInfo = {}
    }
  },
  actions: {
    async loginAction({ commit }, loginData) {
      // 接口
      const data = await login(loginData)
      commit('SET_TOKEN', data)
    },
    async getUserInfo({ commit }) {
      const res = await getuserInfo()// result就是用户的基本资料
      const res1 = await getUserDetailById(res.userId)// 为了获取头像
      const result = { ...res, ...res1 }// 将两个接口结果合并
      commit('SET_USER_INFO', result) // 把两个接口的内容存到state里面
      return JSON.parse(JSON.stringify(res)) // 后面会用
    }
  }
}
