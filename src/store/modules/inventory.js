import * as firebase from 'firebase'
import _ from 'lodash'

const state = {
  all: []
}

const getters = {
  inventoryGetter: state => state.all,
  inventoryArrGetter: state => Object.values(state.all)
}

const mutations = {
  RECEIVE_INVENTORY (state, { inventory }) {
    state.all = inventory.val() || []
  }
}

const actions = {
  importInventory ({ commit }, entries) {
    var data = Object.values(state.all)

    var updates = {}

    entries.forEach(function (entry) {
      var newEntryKey = firebase.database().ref().child('inventory').push().key
      entry.key = newEntryKey
      var res = _.find(data, entry)
      if (res) {
        entry.quantity += res.quantity
        // TODO: check
        updates['/inventory/' + res.key] = null
      }
      updates['/inventory/' + newEntryKey] = entry
    })

    firebase.database().ref().update(updates).then(() => {
      commit('PUSH_NOTIF', { type: 'is-success', message: 'Cập nhật kho dược thành công.' })
    }).catch(error => {
      commit('PUSH_NOTIF', { type: 'is-danger', message: 'Cập nhật thất bại!' })
      console.log(error)
    })
  },
  removeProduct ({ commit }, product) {
    firebase.database().ref('products/' + product.key).remove()
      .then(() => {
        commit('PUSH_NOTIF', { type: 'is-success', message: 'Xóa Sản phẩm thành công.' })
      })
      .catch(err => {
        commit('PUSH_NOTIF', { type: 'is-danger', message: 'Cập nhật thất bại!' })
        console.log(err)
      })
  },
  receiveInventory ({ commit }) {
    // TODO: do async, notifi
    firebase.database().ref('inventory').on('value', inventory => {
      commit('RECEIVE_INVENTORY', { inventory })
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
