import * as firebase from 'firebase'

const state = {
  all: []
}

const getters = {
  chemicalsGetter: state => state.all,
  chemicalsArrGetter: state => Object.values(state.all)
}

const mutations = {
  RECEIVE_CHEMICALS (state, { chemicals }) {
    state.all = chemicals.val() || []
  }
}

const actions = {
  addChemical ({ commit }, newChemical) {
    var newChemicalKey = firebase.database().ref().child('chemicals').push().key

    newChemical.last_update = firebase.database.ServerValue.TIMESTAMP
    newChemical.key = newChemicalKey
    var updates = {}
    updates['/chemicals/' + newChemicalKey] = newChemical

    // TODO: do async, notifi
    firebase.database().ref().update(updates)
  },
  receiveChemicals ({commit}) {
    firebase.database().ref('chemicals').on('value', chemicals => {
      commit('RECEIVE_CHEMICALS', { chemicals })
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
