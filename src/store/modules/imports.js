import * as firebase from 'firebase'

const state = {
  all: []
}

const getters = {
  importSheetsGetter: state => state.all,
  importSheetsArrGetter: state => Object.values(state.all)
}

const mutations = {
  RECEIVE_IMPORT_SHEET (state, { sheets }) {
    state.all = sheets.val() || []
  }
}

const actions = {
  addImportSheet ({ commit }, newSheet) {
    var newSheetKey = firebase.database().ref().child('imports').push().key

    newSheet.last_update = firebase.database.ServerValue.TIMESTAMP
    newSheet.key = newSheetKey
    var updates = {}
    updates['/imports/' + newSheetKey] = newSheet

    firebase.database().ref().update(updates).then(() => {
      commit('PUSH_NOTIF', { type: 'is-success', message: 'Cập nhật Phiếu nhập thành công.' })
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
  receiveSheets ({ commit }) {
    // TODO: do async, notifi
    firebase.database().ref('imports').on('value', sheets => {
      commit('RECEIVE_IMPORT_SHEET', { sheets })
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
