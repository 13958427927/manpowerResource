import { constantRoutes } from '@/router'
export default {
  namespaced: true,
  state: {
    routes: []
  },
  mutations: {
    setRoutes(state, payload) {
      state.routes = [...constantRoutes, ...payload]
    }
  }

}

