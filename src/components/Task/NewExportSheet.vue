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

                <b-table-column label="Kiểu xuất">
                  {{ props.row.is_wsale ? "Sỉ" : "Lẻ" }}
                </b-table-column>

                <b-table-column label="Số Lượng Xuất" width="140">
                  {{ toNumber(props.row.quantity) }}
                </b-table-column>               

                <b-table-column label="Đơn Vị" width="120">
                  {{ props.row.uom }}
                </b-table-column>

                <b-table-column label="Giá Bán" width="140">
                  {{ toCurrency(props.row.price) }}
                </b-table-column>

                <b-table-column label="Tổng" width="140">
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
              <strong>Kiểu xuất</strong>
              <b-switch v-model="isWSale" size="is-medium" @input="switchChange">
                <strong>{{ isWSale ? "Sỉ" : "Lẻ" }}</strong>
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
        grandTotal: 0,
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
      newRowVadilate () {
        if (this.selectedProduct) {
          return {
            id: _.random(1111, 9999),
            product: this.selectedProduct,
            is_wsale: this.isWSale,
            quantity: this.quantity,
            price: this.unitPrice,
            uom: this.isWSale ? this.selectedProduct.uom_wsale : this.selectedProduct.uom_retail,
            total: this.quantity * this.unitPrice
          }
        }
        return null
      },
      addRow () {
        var newRow = this.newRowVadilate()
        if (newRow) {
          this.entries.push(newRow)
          this.grandTotal += newRow.total
          this.resetForm()
          this.$refs.inputProduct.focus()
          window.scrollTo(0, 0)
        } else {
          this.$store.dispatch('pushNotif', { message: 'Chưa chọn Sản phẩm.', type: 'is-warning' })
        }
      },
      deleteRow (obj) {
        this.entries = this.entries.filter(o => o.id !== obj.id)
        this.grandTotal -= obj.total
      },
      newSheetValidate () {
        return new Promise((resolve, reject) => {
          var condition = this.entries.length !== 0

          if (condition) {
            var failed = false
            this.entries.forEach(e => {
              var ind = _.find(this.inventory, i => { return i['.key'] === e.product['.key'] })
              var tmp = e.is_wsale ? e.quantity * ind.uom_rate : e.quantity
              if (ind.quantity * ind.uom_rate + ind.remainder - tmp < 0) {
                failed = true
              }
            })
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
            this.$firebaseRefs.exports.child(newSheet.date).set(newSheet)
            var tmp = this.exports[this.exports.length - 1]
            this.entries.forEach((e) => {
              var update = {
                product_name: e.product.product_name,
                is_wsale: e.is_wsale,
                quantity: parseInt(e.quantity),
                uom: e.uom,
                price: parseInt(e.price),
                total: parseInt(e.total)
              }
              this.$firebaseRefs.exports.child(tmp['.key'])
                .child('entries').child(e.product['.key']).set(update)

              var ind = _.find(this.inventory, i => { return i['.key'] === e.product['.key'] })

              if (e.is_wsale) {
                update.quantity = ind.quantity - update.quantity
                update.remainder = ind.remainder
              } else {
                var quo = Math.floor(update.quantity / ind.uom_rate)
                var rem = update.quantity % ind.uom_rate
                if (rem > ind.remainder) {
                  quo += 1
                  rem = rem - ind.uom_rate
                }
                update.quantity = ind.quantity - quo
                update.remainder = ind.remainder - rem
              }
              this.$firebaseRefs.inventory.child(e.product['.key'] + '/quantity')
                .set(update.quantity)
              this.$firebaseRefs.inventory.child(e.product['.key'] + '/remainder')
                .set(update.remainder)
              this.$firebaseRefs.inventory.child(e.product['.key'] + '/logs')
                .child(Date.now()).set({
                  type: 'Export',
                  quantity: update.quantity,
                  remainder: update.remainder
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
          this.$router.push('/inventory')
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

<style scoped>

</style>