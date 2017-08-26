import * as firebase from 'firebase'

const state = {
  all: []
}

const getters = {
  uomsGetter: state => state.all,
  uomsArrGetter: state => Object.values(state.all)
}

const mutations = {
  RECEIVE_UOMS (state, { uoms }) {
    state.all = uoms.val() || []
  }
}

const actions = {
  addUom ({ commit }, newUom) {
    var newUomKey = firebase.database().ref().child('uoms').push().key

    newUom.last_update = firebase.database.ServerValue.TIMESTAMP
    newUom.key = newUomKey
    var updates = {}
    updates['/uoms/' + newUomKey] = newUom

    // TODO: do async, notifi
    firebase.database().ref().update(updates)
  },
  receiveUoms ({commit}) {
    firebase.database().ref('uoms').on('value', uoms => {
      commit('RECEIVE_UOMS', { uoms })
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
