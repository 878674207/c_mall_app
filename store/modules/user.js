import config from '@/config'
import storage from '@/utils/storage'
import constant from '@/utils/constant'
import {
  userLoginV2,
  logout,
  login,
} from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { encrypt } from '@/utils/jsencrypt'

const baseUrl = config.baseUrl

const user = {
  state: {
    token: getToken(),
    name: storage.get(constant.name),
    avatar: storage.get(constant.avatar),
    roles: storage.get(constant.roles),
    permissions: storage.get(constant.permissions)
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
      storage.set(constant.name, name)
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
      storage.set(constant.avatar, avatar)
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
      storage.set(constant.roles, roles)
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
      storage.set(constant.permissions, permissions)
    }
  },

  actions: {
    // 登录
    Login({
      commit
    }, userInfo) {
      uni.clearStorageSync();
      const phone = userInfo.item.phone.trim()
      const code = userInfo.item.code
      const salesUserId = userInfo.item.salesUserId
      return new Promise((resolve, reject) => {
        if (userInfo.rolse === 0) {
          if (phone) {
            login(phone, code, salesUserId, userInfo.item.openId).then(res => {
              setToken(res.data.token)
              commit('SET_TOKEN', res.data.token)
              commit('SET_ID', res.data.id)
              commit('SET_NAME', res.data.name)
              commit('SET_PHONE', res.data.phone)
              commit('SET_GENDER', res.data.gender)
              resolve(res)
            }).catch(error => {
              reject(error)
            })
          } else {
            userLoginV2(userInfo.item).then(res => {
              setToken(res.data.token)
              commit('SET_TOKEN', res.data.token)
              commit('SET_ID', res.data.id)
              commit('SET_NAME', res.data.name)
              commit('SET_PHONE', res.data.phone)
              commit('SET_GENDER', res.data.gender)
              resolve(res)
            }).catch(error => {
              reject(error)
            })
          }
        }
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          const user = res.user
          const avatar = (user == null || user.avatar == "" || user.avatar == null) ? require("@/static/images/profile.jpg") : baseUrl + user.avatar
          const username = (user == null || user.userName == "" || user.userName == null) ? "" : user.userName
          if (res.roles && res.roles.length > 0) {
            commit('SET_ROLES', res.roles)
            commit('SET_PERMISSIONS', res.permissions)
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          commit('SET_NAME', username)
          commit('SET_AVATAR', avatar)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          storage.clean()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user
