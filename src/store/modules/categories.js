import * as firebase from 'firebase'

const state = {
  all: []
}

const getters = {
  categoriesGetter: state => state.all,
  categoriesArrGetter: state => Object.values(state.all)
}

const mutations = {
  RECEIVE_CATEGORIES (state, { categories }) {
    state.all = categories.val() || []
  }
}

const actions = {
  addCategory ({ commit }, newCategory) {
    var newCategoryKey = firebase.database().ref().child('categories').push().key

    newCategory.last_update = firebase.database.ServerValue.TIMESTAMP
    newCategory.key = newCategoryKey
    var updates = {}
    updates['/categories/' + newCategoryKey] = newCategory

    // TODO: do async, notifi
    firebase.database().ref().update(updates)
  },
  receiveCategories ({commit}) {
    firebase.database().ref('categories').on('value', categories => {
      commit('RECEIVE_CATEGORIES', { categories })
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
