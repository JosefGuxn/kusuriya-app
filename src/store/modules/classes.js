import * as firebase from 'firebase'

const state = {
  all: []
}

const getters = {
  classesGetter: state => state.all,
  classesArrGetter: state => Object.values(state.all)
}

const mutations = {
  RECEIVE_CLASSES (state, { classes }) {
    state.all = classes.val() || []
  }
}

const actions = {
  addClass ({ commit }, newClass) {
    var newClassKey = firebase.database().ref().child('classes').push().key

    newClass.last_update = firebase.database.ServerValue.TIMESTAMP
    newClass.key = newClassKey
    var updates = {}
    updates['/classes/' + newClassKey] = newClass

    // TODO: do async, notifi
    firebase.database().ref().update(updates)
  },
  receiveClasses ({commit}) {
    firebase.database().ref('classes').on('value', classes => {
      commit('RECEIVE_CLASSES', { classes })
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
