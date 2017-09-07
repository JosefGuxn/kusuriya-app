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
              <button class="button is-primary" @click="importSheetAndClose">
                <b-icon icon="floppy-o"></b-icon>
                <span>Lưu</span>
              </button>
              <button class="button is-primary" @click="importSheetAndReload">
                <span>Lưu & Tạo mới</span>
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
                  {{ props.row.product.product_name }}
                </b-table-column>

                <b-table-column label="Số Lô" width="110">
                  {{ props.row.stock_number }}
                </b-table-column>

                <b-table-column label="Số Lượng Nhập" width="140">
                  {{ toNumber(props.row.quantity) }}
                </b-table-column>

                <b-table-column label="Hạn Dùng" width="140">
                  {{ moment(props.row.exp_date) }}
                </b-table-column>

                <b-table-column label="Giá Mua" width="120">
                  {{ toCurrency(props.row.unit_price) }}
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
        </b-panel>
      </div>
      <div class="column is-4">
        <b-panel has-custom-template>
          <div class="tile is-size-3" slot="header">
            <strong class="tile is-child">
              Thêm Dữ liệu
            </strong>
          </div>
          <div class="panel-block tile is-vertical">
            <div class="tile is-child">
              <strong>Sản phẩm</strong>
              <b-field :type="seletedProduct === null ? 'is-danger':''">
                <b-autocomplete ref="inputProduct" v-model="productValue" :data="filteredProducts" @select="selectProduct" field="product_name" expanded keep-first>
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
              <money v-model="unitPrice" class="input"></money>
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
import moment from 'moment'
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
      productValue: '',
      seletedProduct: null,
      quantity: 0,
      stockNumber: '',
      expDate: new Date(),
      unitPrice: 0,
      wSalePrice: 0,
      retailPrice: 0
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
        return option.product_name
          .toString()
          .toLowerCase()
          .indexOf(this.productValue.toLowerCase()) >= 0
      })
    },
    profit () {
      if (this.unitPrice !== 0) {
        return Math.round(((this.wSalePrice - this.unitPrice) / this.unitPrice) * 100) / 100
      }
      return 0
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
      this.productValue = ''
      this.seletedProduct = null
      this.stockNumber = null
      this.quantity = 0
      this.expDate = new Date()
      this.unitPrice = 0
      this.wSalePrice = 0
      this.retailPrice = 0
    },
    newRowVadilate () {
      if (this.seletedProduct) {
        return {
          id: _.random(1111, 9999),
          product: this.seletedProduct,
          stock_number: this.stockNumber,
          quantity: this.quantity,
          exp_date: this.expDate,
          unit_price: this.unitPrice,
          wsale_price: this.wSalePrice,
          retail_price: this.retailPrice
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
        this.$store.dispatch('pushNotif', { message: 'Chưa chọn Sản phẩm.', type: 'is-warning' })
      }
    },
    deleteRow (obj) {
      this.entries = this.entries.filter(o => o.id !== obj.id)
    },
    newSheetValidate () {
      var condition = this.supplier && this.entries.length !== 0
      if (condition) {
        return {
          supplier: this.supplier,
          date: this.sheet_date.getTime(),
          note: this.note
        }
      }
    },
    importSheet () {
      var newSheet = this.newSheetValidate()
      if (newSheet) {
        this.$firebaseRefs.imports.child(newSheet.date).set(newSheet)
        var tmp = this.imports[this.imports.length - 1]
        this.entries.forEach((e) => {
          var update = {
            product_name: e.product.product_name,
            stock_number: e.stock_number,
            quantity: parseInt(e.quantity),
            exp_date: e.exp_date.getTime(),
            unit_price: parseInt(e.unit_price),
            wsale_price: parseInt(e.wsale_price),
            retail_price: parseInt(e.retail_price)
          }
          this.$firebaseRefs.imports.child(tmp['.key'])
            .child('entries').child(e.product['.key']).set(update)

          update.category = e.product.category
          update.chemical = e.product.chemical
          update.class = e.product.class
          update.uom_wsale = e.product.uom_wsale
          update.uom_retail = e.product.uom_retail
          update.uom_rate = e.product.uom_rate
          update.remainder = e.product.remainder || 0

          var ind = _.find(this.inventory, i => { return i['.key'] === e.product['.key'] })

          if (ind) {
            update.quantity += parseInt(ind.quantity)
            this.$firebaseRefs.inventory.child(e.product['.key'] + '/quantity')
              .set(update.quantity)
            this.$firebaseRefs.inventory.child(e.product['.key'] + '/quantity')
              .set(update.remainder)
            this.$firebaseRefs.inventory.child(e.product['.key'] + '/exp_date')
              .set(update.exp_date)
            this.$firebaseRefs.inventory.child(e.product['.key'] + '/unit_price')
              .set(update.unit_price)
            this.$firebaseRefs.inventory.child(e.product['.key'] + '/wsale_price')
              .set(update.wsale_price)
            this.$firebaseRefs.inventory.child(e.product['.key'] + '/retail_price')
              .set(update.retail_price)
          } else {
            this.$firebaseRefs.inventory.child(e.product['.key']).set(update)
          }
          this.$firebaseRefs.inventory.child(e.product['.key'] + '/logs')
            .child(Date.now()).set({
              type: 'Import',
              quantity: update.quantity
            })
        })
        this.$store.dispatch('pushNotif', { message: 'Cập nhật Phiếu nhập thành công.', type: 'is-success' })
        return true
      } else {
        this.$store.dispatch('pushNotif', { message: 'Cập nhật thất bại.', type: 'is-danger' })
        return false
      }
    },
    importSheetAndClose () {
      var tmp = this.importSheet()
      if (tmp) {
        this.$router.push('/inventory')
      }
    },
    importSheetAndReload () {
      if (this.importSheet()) {
        this.resetForm()
        this.supplier = null
        this.sheet_date = new Date()
        this.note = null
        this.entries = []
        window.scrollTo(0, 0)
      }
    },
    addSupplier () {
      this.$dialog.prompt({
        title: `Nhà Cung Cấp Mới`,
        confirmText: 'OK',
        onConfirm: (value) => this.$firebaseRefs.suppliers.push({
          value: value,
          last_update: Date.now()
        }).then(() => {
          this.$store.dispatch('pushNotif', { type: 'is-success', message: 'Cập nhật Nhà cung cấp thành công.' })
        }).catch(error => {
          this.$store.dispatch('pushNotif', { type: 'is-danger', message: 'Cập nhật thất bại!' })
          console.log(error)
        })
      })
    },
    moment (time) {
      return moment(time).format('DD/MM/YYYY')
    },
    toCurrency (number) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number)
    },
    toNumber (number) {
      return new Intl.NumberFormat('vi-VN').format(number)
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

</style>