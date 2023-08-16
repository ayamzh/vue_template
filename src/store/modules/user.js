import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, setAdminName, getAdminName, removeAdminName } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    avatar: '',
    adminName: getAdminName(),
    role: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ADMIN: (state, adminName) => {
    state.adminName = adminName
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  // 新增
  SET_ROLE: (state, role) => {
    state.role = role
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then((response) => {
          const { data } = response
          // 存入state
          commit('SET_TOKEN', data.token)
          commit('SET_ADMIN', data.adminName)
          // 写入coockie
          setToken(data.token)
          setAdminName(data.adminName)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo()
        .then((response) => {
          const { data } = response

          if (!data) {
            return reject('Verification failed, please Login again.')
          }

          const { avatar, role } = data
          // 存入state
          commit('SET_AVATAR', avatar)
          commit('SET_ROLE', role)
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          removeToken() // must remove  token  first
          removeAdminName()
          resetRouter()
          commit('RESET_STATE')
          commit('SET_ROLE', '')
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
