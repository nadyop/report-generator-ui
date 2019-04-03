const state = {
  hasLoadedOnce: false,
  user: {},
  statusLogin: false
}

const getters = {
  user (state) {
    return state.user || {}
  },
  isLogin: state => state.statusLogin
}

const actions = {
  getUser ({commit}, {success, fail} = {}) {
    ((res) => {
      commit('setUser', res.data)
      if (success) success(res)
    }, fail)
  }
}

const mutations = {
  setUser (state, value) {
    state.user = value
  },
  isLogin (state, data) {
    state.statusLogin = data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
