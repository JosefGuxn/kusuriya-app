import { db } from '@/firebase'
import _ from 'lodash'

const state = {
  user: JSON.parse(localStorage.getItem('token'))
}

const getters = {
  userGetter: state => state.user,
  isLoggedIn: state => state.user !== null
}

const mutations = {
  LOGIN (state) {
    state.pending = true
  },
  LOGIN_SUCCESS (state, user) {
    state.user = user
    state.pending = false
  },
  LOGOUT (state) {
    localStorage.removeItem('token')
    state.user = null
  }
}

const actions = {
  login ({ commit }, creds) {
    commit('LOGIN')
    return new Promise((resolve, reject) => {
      db.ref('users').on('value', (users) => {
        var user = _.find(Object.values(users.val()), {
          id: creds.id
        })
        if (user) {
          if (user.pwd === creds.pwd) {
            localStorage.setItem('token', JSON.stringify(user))
            commit('LOGIN_SUCCESS', user)
            resolve()
          } else {
            reject({isIdFailed: false})
          }
        } else {
          reject({isIdFailed: true})
        }
      })
    })
  },
  logout ({ commit }) {
    commit('LOGOUT')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
