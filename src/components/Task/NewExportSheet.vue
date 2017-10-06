<template>
  <section>
    <div class="columns">
      <div class="column">
        <b-panel has-custom-template>
          <div class="is-size-3 tile" slot="header">
            <strong class="tile is-child has-text-primary">
              Phiếu xuất kho
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
            <b-table :data="entries" narrowed bordered
            :row-class="(row, index) => row.inv_w < 0 ? 'is-warning' : ''">
              <template slot="header" scope="props">
                <strong class="is-size-5">
                  {{ props.column.label }}
                </strong>
              </template>
              <template scope="props">
                <b-table-column label="Sản Phẩm">
                  {{ props.row.product.product_name }}
                </b-table-column>
                <b-table-column label="Tồn" width="140">
                  {{ props.row.product.quantity+ ' ' + props.row.product.uom_wsale }} 
                  {{ props.row.product.remainder ? props.row.product.remainder + ' ' + props.row.product.uom_retail : '' }}
                </b-table-column>
                <b-table-column label="Xuất" width="140">
                  {{(props.row.quan_w ? props.row.quan_w + ' ' + props.row.uom_wsale : '') }} 
                  {{(props.row.quan_r ? props.row.quan_r + ' ' + props.row.uom_retail : '')}}
                </b-table-column>

                <b-table-column label="Còn" width="140">
                  {{ props.row.inv_w + ' ' + props.row.uom_wsale }} 
                  {{ (props.row.inv_r ? props.row.inv_r + ' ' + props.row.uom_retail : '')}}
                </b-table-column>

                <b-table-column label="Thành Tiền" width="160">
                  {{ toCurrency(props.row.total) }}
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
              <template slot="detail" scope="props">
                <article class="media">
                  <div class="media-content">
                    <div class="content">
                      <p>
                        <strong>Ghi chú</strong>
                        <br> 
                        {{ props.row.note }}
                      </p>
                    </div>
                  </div>
                </article>
              </template>
            </b-table>
          </div>
          <div class="panel-block">
            <div class="tile">
              <strong class="tile is-child is-3 is-size-5">Tổng tiền</strong>
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
              Thêm Dữ liệu
            </strong>
          </div>
          <div class="panel-block tile is-vertical">
            <div class="tile is-child">
              <strong>Sản phẩm</strong>
              <b-field :type="selectedProduct === null ? 'is-danger':''">
                <b-autocomplete ref="inputProduct" v-model="productValue" :data="filteredProducts" @select="selectProduct" field="product_name" expanded keep-first>
                </b-autocomplete>
              </b-field>
            </div>      
            <div class="tile is-child">
              <strong>Đơn vị xuất</strong>
              <b-switch v-model="isWSale" size="is-medium" @input="switchChange">
                <strong>
                  {{ selectedProduct ? (isWSale ? 
                    selectedProduct.uom_wsale : selectedProduct.uom_retail ):''
                  }}
                </strong>
              </b-switch>
            </div> 
            <div class="tile is-child">
              <strong>Giá</strong>
              {{ toCurrency(unitPrice) }}
            </div> 
            <div class="tile is-child">
              <strong>Số lượng xuất</strong>
              <b-input v-model="quantity" type="number"></b-input>
            </div>           
            <div class="tile is-child">
              <strong>Ghi chú</strong>
              <b-input v-model="entryNote" type="textarea"></b-input>
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
        sheet_date: new Date(),
        note: null,
        productValue: '',
        selectedProduct: null,
        isWSale: false,
        quantity: 0,
        unitPrice: 0,
        entryNote: null
      }
    },
    firebase: {
      exports: db.ref('exports'),
      inventory: db.ref('inventory')
    },
    computed: {
      filteredProducts () {
        return this.inventory.filter((option) => {
          return option.product_name
            .toString()
            .toLowerCase()
            .indexOf(this.productValue.toLowerCase()) >= 0
        })
      },
      grandTotal () {
        return _.sumBy(this.entries, e => e.total)
      }
    },
    methods: {
      switchChange () {
        var val = this.selectedProduct
        if (val) {
          this.unitPrice = this.isWSale ? val.wsale_price : val.retail_price
        }
      },
      selectProduct (val) {
        if (val) {
          this.selectedProduct = val
          this.unitPrice = this.isWSale ? val.wsale_price : val.retail_price
        }
      },
      resetForm () {
        this.productValue = ''
        this.selectedProduct = null
        this.quantity = 0
        this.isWSale = false
        this.unitPrice = 0
        this.entryNote = 0
      },
      addRow () {
        if (!this.selectedProduct) return

        var ind = _.find(this.entries, e => {
          return e.product['.key'] === this.selectedProduct['.key']
        })

        if (ind) {
          ind.quan_w += this.isWSale ? parseInt(this.quantity) : 0
          ind.quan_r += this.isWSale ? 0 : parseInt(this.quantity)
          if (this.isWSale) {
            ind.inv_w -= this.quantity
          } else {
            ind.inv_w -= Math.floor(this.quantity / this.selectedProduct.uom_rate)
            ind.inv_r -= this.quantity % this.selectedProduct.uom_rate
            if (ind.inv_r < 0) {
              ind.inv_w -= 1
              ind.inv_r += parseInt(this.selectedProduct.uom_rate)
            }
          }
          ind.total += this.quantity * this.unitPrice
        } else {
          ind = {
            id: _.random(1111, 9999),
            product: this.selectedProduct,
            quan_w: this.isWSale ? parseInt(this.quantity) : 0,
            quan_r: this.isWSale ? 0 : parseInt(this.quantity),
            inv_w: this.selectedProduct.quantity,
            inv_r: this.selectedProduct.remainder,
            uom_wsale: this.selectedProduct.uom_wsale,
            uom_retail: this.selectedProduct.uom_retail,
            total: this.quantity * this.unitPrice
          }
          if (this.isWSale) {
            ind.inv_w -= this.quantity
          } else {
            ind.inv_w -= Math.floor(this.quantity / this.selectedProduct.uom_rate)
            ind.inv_r -= this.quantity % this.selectedProduct.uom_rate
            if (ind.inv_r < 0) {
              ind.inv_w -= 1
              ind.inv_r += parseInt(this.selectedProduct.uom_rate)
            }
          }
          this.entries.push(ind)
        }
        this.resetForm()
        this.$refs.inputProduct.focus()
        window.scrollTo(0, 0)
      },
      deleteRow (obj) {
        this.entries = this.entries.filter(o => o.id !== obj.id)
      },
      newSheetValidate () {
        return new Promise((resolve, reject) => {
          var condition = this.entries.length !== 0

          if (condition) {
            var failed = this.entries.filter(e => e.inv_w < 0).length > 0
            if (failed) {
              this.$dialog.confirm({
                title: 'Vượt quá tồn kho',
                message: `Có sản phẩm vượt quá tồn kho. Có muốn tiếp tục?`,
                confirmText: 'Tiếp tục',
                type: 'is-danger',
                hasIcon: true,
                onConfirm: () => resolve({
                  date: this.sheet_date.getTime(),
                  note: this.note,
                  grand_total: this.grandTotal
                })
              })
            } else {
              resolve({
                date: this.sheet_date.getTime(),
                note: this.note,
                grand_total: this.grandTotal
              })
            }
          }
        })
      },
      importSheet () {
        return new Promise((resolve, reject) => {
          this.newSheetValidate().then((newSheet) => {
            var key = Date.now()
            this.$firebaseRefs.exports.child(key).set(newSheet)
            var tmp = this.exports[this.exports.length - 1]
            this.entries.forEach((e) => {
              var update = {
                product_name: e.product.product_name,
                quan_w: parseInt(e.quan_w),
                quan_r: parseInt(e.quan_r),
                inv_w: parseInt(e.inv_w),
                inv_r: parseInt(e.inv_r),
                wsale_price: e.product.wsale_price,
                retail_price: e.product.retail_price,
                uom_wsale: e.uom_wsale,
                uom_retail: e.uom_retail,
                total: parseInt(e.total)
              }
              this.$firebaseRefs.exports.child(tmp['.key'])
                .child('entries').child(e.product['.key']).set(update)

              this.$firebaseRefs.inventory.child(e.product['.key'] + '/quantity')
                .set(update.inv_w)
              this.$firebaseRefs.inventory.child(e.product['.key'] + '/remainder')
                .set(update.inv_r)
              this.$firebaseRefs.inventory.child(e.product['.key'] + '/logs')
                .child(key).set({
                  type: 'Export',
                  quan_r: update.quan_r,
                  quan_w: update.quan_w,
                  inv_w: update.inv_w,
                  inv_r: update.inv_r
                })
            })
            resolve()
          }).catch(() => {
            reject()
          })
        })
      },
      importSheetAndClose () {
        this.importSheet().then(() => {
          this.$store.dispatch('pushNotif', { message: 'Cập nhật Phiếu nhập thành công.', type: 'is-success' })
          this.$router.replace('/inventory')
        }).catch(() => {
          this.$store.dispatch('pushNotif', { message: 'Cập nhật thất bại.', type: 'is-danger' })
        })
      },
      importSheetAndReload () {
        this.importSheet().then(() => {
          this.$store.dispatch('pushNotif', { message: 'Cập nhật Phiếu nhập thành công.', type: 'is-success' })
          this.resetForm()
          this.sheet_date = new Date()
          this.note = null
          this.entries = []
          window.scrollTo(0, 0)
        }).catch(() => {
          this.$store.dispatch('pushNotif', { message: 'Cập nhật thất bại.', type: 'is-danger' })
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

<style>
tr.is-warning {
  background: hsl(48, 100%, 67%) !important;
}
</style>