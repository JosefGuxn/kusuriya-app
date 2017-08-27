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

    firebase.database().ref().update(updates).then(() => {
      commit('PUSH_NOTIF', { type: 'is-success', message: 'Cập nhật Sản phẩm thành công.' })
    }).catch(error => {
      commit('PUSH_NOTIF', { type: 'is-danger', message: 'Cập nhật thất bại!' })
      console.log(error)
    })
  },
  receiveProducts ({ commit }) {
    // TODO: do async, notifi
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
