const state = {
  all: [],
  newNotif: null
}

const getters = {
  notifsGetter: state => () => state.all,
  newNotifGetter: state => state.newNotif
}

const mutations = {
  PUSH_NOTIF (state, notif) {
    state.all.push(notif)
    state.newNotif = notif
  }
}

const actions = {
  pushNotif ({ commit }, notif) {
    commit('PUSH_NOTIF', notif)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
