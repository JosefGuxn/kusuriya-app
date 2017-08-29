import * as firebase from 'firebase'

const state = {
  all: []
}

const getters = {
  suppliersGetter: state => state.all,
  suppliersArrGetter: state => Object.values(state.all)
}

const mutations = {
  RECEIVE_SUPPLIERS (state, { suppliers }) {
    state.all = suppliers.val() || []
  }
}

const actions = {
  addSupplier ({ commit }, newSupplier) {
    var newSupplierKey = firebase.database().ref().child('suppliers').push().key

    newSupplier.last_update = firebase.database.ServerValue.TIMESTAMP
    newSupplier.key = newSupplierKey
    var updates = {}
    updates['/suppliers/' + newSupplierKey] = newSupplier

    firebase.database().ref().update(updates).then(() => {
      commit('PUSH_NOTIF', { type: 'is-success', message: 'Cập nhật Nhà cung cấp thành công.' })
    }).catch(error => {
      commit('PUSH_NOTIF', { type: 'is-danger', message: 'Cập nhật thất bại!' })
      console.log(error)
    })
  },
  removeSupplier ({ commit }, supplier) {
    firebase.database().ref('suppliers/' + supplier.key).remove()
      .then(() => {
        commit('PUSH_NOTIF', { type: 'is-success', message: 'Xóa Sản phẩm thành công.' })
      })
      .catch(err => {
        commit('PUSH_NOTIF', { type: 'is-danger', message: 'Cập nhật thất bại!' })
        console.log(err)
      })
  },
  receiveSuppliers ({ commit }) {
    // TODO: do async, notifi
    firebase.database().ref('suppliers').on('value', suppliers => {
      commit('RECEIVE_SUPPLIERS', { suppliers })
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
