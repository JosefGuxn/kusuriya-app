<template>
  <section>
    <div class="columns">
      <div class="column">
        <b-panel has-custom-template>
          <div class="is-size-3 tile" slot="header">
            <strong class="tile is-child has-text-primary">
              Phiếu nhập kho
            </strong>
            <div class="tile is-child is-4 has-text-right">
              <button class="button is-primary" @click="saveSheet">
                <b-icon icon="floppy-o"></b-icon>
                <span>Lưu</span>
              </button>
            </div>
          </div>
          <div class="panel-block">
            <div class="tile">
              <strong class="tile is-child is-3 is-size-5">Nhà cung cấp</strong>
              <div class="tile is-child is-6">
                <b-field :type="supplier ? '':'is-danger'" grouped>
                  <b-select placeholder="Chọn nhà cung cấp" v-model="supplier" expanded>
                    <option :value="supplier.value" v-for="supplier in suppliers" :key="supplier['.key']">
                      {{ supplier.value }}
                    </option>
                  </b-select>
                  <button class="button" @click="addSupplier">
                    <b-icon icon="plus"></b-icon>
                  </button>
                </b-field>
              </div>
            </div>
          </div>
          <div class="panel-block">
            <div class="tile">
              <strong class="tile is-child is-3 is-size-5">Ngày lập</strong>
              <div class="tile is-child is-3">
                <b-field>
                  <div class="control">
                    <DatePicker v-model="sheet_date" type="date" size="large" format="dd/MM/yyyy" placement="right" :clearable="false"></DatePicker>
                  </div>
                </b-field>
              </div>
            </div>
          </div>
          <div class="panel-block">
            <div class="tile">
              <strong class="tile is-child is-3 is-size-5">Ghi chú</strong>
              <div class="tile is-child is-6">
                <b-field>
                  <div class="control">
                    <b-input v-model="note" type="textarea"></b-input>
                  </div>
                </b-field>
              </div>
            </div>
          </div>
          <div class="content" style="margin-top: 20px">
            <b-table :data="entries" narrowed bordered>
              <template slot="header" scope="props">
                <strong class="is-size-5">
                  {{ props.column.label }}
                </strong>
              </template>
              <template scope="props">
                <b-table-column label="Sản Phẩm">
                  {{ props.row.product.name }}
                </b-table-column>

                <b-table-column label="Số Lô" width="110">
                  {{ props.row.stock_number }}
                </b-table-column>

                <b-table-column label="Số Lượng Nhập" width="140">
                  {{ toNumber(props.row.wsale_qty) }}
                </b-table-column>

                <b-table-column label="Hạn Dùng" width="140">
                  {{ moment(props.row.exp_date) }}
                </b-table-column>

                <b-table-column label="Giá Mua" width="120">
                  {{ toCurrency(props.row.wsale_cost) }}
                </b-table-column>

                <b-table-column label="Giá Bán Sỉ" width="140">
                  {{ toCurrency(props.row.wsale_price) }}
                </b-table-column>

                <b-table-column label="Giá Bán Lẻ" width="140">
                  {{ toCurrency(props.row.retail_price) }}
                </b-table-column>

                <b-table-column width="50">
                  <button class="button is-danger" @click="deleteRow(props.row)">
                    <b-icon icon="trash-o"></b-icon>
                  </button>
                </b-table-column>
              </template>
              <template slot="empty">
                <section class="section">
                  <div class="content has-text-grey has-text-centered">
                    <i>Chưa có dữ liệu.</i>
                  </div>
                </section>
              </template>
            </b-table>
          </div>
          <div class="panel-block">
            <div class="tile">
              <strong class="tile is-child is-3 is-size-5">Tổng tiền mua</strong>
              <div class="tile is-child is-6">
                <strong>{{ toCurrency(grandTotal) }}</strong>
              </div>
            </div>
          </div>
        </b-panel>
      </div>
      <div class="column is-4">
        <b-panel has-custom-template>
          <div class="tile is-size-3" slot="header">
            <strong class="tile is-child">
              Nhập Dữ liệu
            </strong>
          </div>
          <div class="panel-block tile is-vertical">
            <div class="tile is-child">
              <strong>Sản phẩm</strong>
              <b-field :type="seletedProduct === null ? 'is-danger':''">
                <b-autocomplete ref="inputProduct" v-model="productName" :data="filteredProducts" @select="selectProduct" field="name" expanded keep-first>
                </b-autocomplete>
              </b-field>
            </div>
            <div class="tile is-child">
              <strong>Số lô</strong>
              <b-input v-model="stockNumber"></b-input>
            </div>
            <div class="tile is-child">
              <strong>Số lượng</strong>
              <b-input v-model="quantity" type="number"></b-input>
            </div>
            <div class="tile is-child">
              <div class="tile is-vertical">
                <div class="tile">
                  <strong>Hạn dùng</strong>
                </div>
                <div class="tile is-child">
                  <DatePicker v-model="expDate" type="date" size="large" format="dd/MM/yyyy" placement="top-start" :clearable="false"></DatePicker>
                </div>
              </div>
            </div>
            <div class="tile is-child">
              <strong>Giá mua</strong>
              <money v-model="wsaleCost" class="input"></money>
            </div>
            <div class="tile is-child">
              <strong>Giá bán sỉ</strong>
              <money v-model="wSalePrice" class="input"></money>
            </div>
            <div class="tile is-child">
              <strong>Giá bán lẻ</strong>
              <money v-model="retailPrice" class="input"></money>
            </div>
            <div class="tile is-child">
              <strong>Lợi nhuận {{ profit }}%</strong>
            </div>
          </div>
          <div class="panel-block">
            <button class="button is-success is-fullwidth" @click="addRow">
              <b-icon icon="plus"></b-icon>
              <strong>Thêm</strong>
            </button>
          </div>
        </b-panel>
      </div>
    </div>
  </section>
</template>

<script>
import { db } from '@/firebase'
import _ from 'lodash'
export default {
  data () {
    return {
      entries: [],
      formProps: {
        info: '',
        action: ''
      },
      supplier: null,
      sheet_date: new Date(),
      note: null,
      productName: '',
      seletedProduct: null,
      quantity: 0,
      stockNumber: '',
      expDate: new Date(),
      wsaleCost: 0,
      wSalePrice: 0,
      retailPrice: 0,
      isSaved: false
    }
  },
  firebase: {
    products: db.ref('products'),
    suppliers: db.ref('suppliers'),
    imports: db.ref('imports'),
    inventory: db.ref('inventory')
  },
  computed: {
    filteredProducts () {
      return this.products.filter((option) => {
        return option.name
          .toString()
          .toLowerCase()
          .indexOf(this.productName.toLowerCase()) >= 0
      })
    },
    profit () {
      if (this.wsaleCost !== 0) {
        return Math.round(((this.wSalePrice - this.wsaleCost) / this.wsaleCost) * 100) / 100
      }
      return 0
    },
    grandTotal () {
      return _.sumBy(this.entries, e => e.wsale_qty * e.wsale_cost)
    }
  },
  methods: {
    selectProduct (val) {
      if (val) {
        this.seletedProduct = val
        var tmp = _.find(this.inventory, e => e['.key'] === val['.key'])
        this.wSalePrice = tmp ? tmp.wsale_price : 0
        this.retailPrice = tmp ? tmp.retail_price : 0
      }
    },
    resetForm () {
      this.productName = ''
      this.seletedProduct = null
      this.stockNumber = ''
      this.quantity = 0
      this.expDate = new Date()
      this.wsaleCost = 0
      this.wSalePrice = 0
      this.retailPrice = 0
    },
    newRowVadilate () {
      if (this.seletedProduct) {
        return {
          product: this.seletedProduct,
          stock_number: this.stockNumber,
          wsale_qty: parseInt(this.quantity),
          exp_date: this.expDate.getTime(),
          wsale_cost: parseInt(this.wsaleCost),
          wsale_price: parseInt(this.wSalePrice),
          retail_price: parseInt(this.retailPrice)
        }
      }
      return null
    },
    addRow () {
      var newRow = this.newRowVadilate()
      if (newRow) {
        this.entries.push(newRow)
        this.resetForm()
        this.$refs.inputProduct.focus()
        window.scrollTo(0, 0)
      } else {
        this.$store.dispatch('pushNotif', { message: 'Xin chọn Sản phẩm.', type: 'is-warning' })
      }
    },
    deleteRow (obj) {
      this.entries = this.entries.filter(o => o !== obj)
    },
    newSheetValidate () {
      var condition = this.supplier && this.entries.length !== 0
      if (condition) {
        return {
          supplier: this.supplier,
          date: this.sheet_date.getTime(),
          note: this.note,
          grand_total: this.grandTotal
        }
      }
      return null
    },
    saveSheet () {
      try {
        var newSheet = this.newSheetValidate()
        if (!newSheet) throw new Error('thiếu dữ liệu.')
        var sheetKey = Date.now()
        this.$firebaseRefs.imports.child(sheetKey).set(newSheet)
        this.entries.forEach((e) => {
          var productKey = e.product['.key']
          delete e.product['.key']
          this.$firebaseRefs.imports.child(sheetKey).child('entries')
            .child(productKey).set(e)

          var ind = _.find(this.inventory, o => o['.key'] === productKey)
          e.retail_qty = 0
          e.logs = {}
          e.logs[Date.now()] = {
            type: 'Import',
            o_w_qty: 0,
            o_r_qty: 0,
            w_qty: e.wsale_qty,
            r_qty: e.retail_qty
          }
          if (ind) {
            e.wsale_qty += parseInt(ind.wsale_qty)
            e.retail_qty = ind.retail_qty
            e.logs = ind.logs || {}
            e.logs[Date.now()] = {
              type: 'Import',
              o_w_qty: ind.wsale_qty || 0,
              o_r_qty: ind.retail_qty || 0
            }
          }
          this.$firebaseRefs.inventory.child(productKey).set(e)
        })
        this.$store.dispatch('pushNotif', { message: 'Cập nhật thành công.', type: 'is-success' })
        this.isSaved = true
        this.$router.replace('/importprint/' + sheetKey)
      } catch (error) {
        this.$store.dispatch('pushNotif', { message: `Cập nhật thất bại.\nLỗi ${error.message}`, type: 'is-danger' })
      }
    },
    addSupplier () {
      this.$dialog.prompt({
        title: `Thêm Nhà Cung Cấp`,
        confirmText: 'OK',
        onConfirm: (value) => this.$firebaseRefs.suppliers.push({
          value: value
        }).then(() => {
          this.$store.dispatch('pushNotif', { type: 'is-success', message: 'Cập nhật Nhà cung cấp thành công.' })
        }).catch(error => {
          this.$store.dispatch('pushNotif', { type: 'is-danger', message: 'Cập nhật thất bại!' })
          console.log(error)
        })
      })
    }
  },
  created () {
    if (!this.$store.getters.isLoggedIn) {
      this.$router.replace('/login')
    }
  }
}
</script>

<style scoped>
  .b-table {
    margin-right: 5px;
    margin-left: 5px;
  }
  .panel {
    border: 1px solid black;
  }
  .tile.is-vertical > .tile.is-child:not(:last-child) {
    margin-bottom: 0rem !important;
  }
</style>