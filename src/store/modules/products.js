import * as firebase from 'firebase'

const state = {
  all: []
}

const getters = {
  productsGetter: state => state.all,
  productsArrGetter: state => Object.values(state.all)
}

const mutations = {
  RECEIVE_PRODUCTS (state, { products }) {
    state.all = products.val() || []
  }
}

const actions = {
  addProduct ({ commit }, newProduct) {
    var newProductKey = firebase.database().ref().child('products').push().key

    newProduct.last_update = firebase.database.ServerValue.TIMESTAMP
    newProduct.key = newProductKey
    var updates = {}
    updates['/products/' + newProductKey] = newProduct

    // TODO: do async, notifi
    firebase.database().ref().update(updates)
  },
  receiveProducts ({commit}) {
    firebase.database().ref('products').on('value', products => {
      commit('RECEIVE_PRODUCTS', { products })
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
