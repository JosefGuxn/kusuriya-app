<template>
  <section>
    <div class="columns">
      <div class="column">
        <b-panel has-custom-template>
          <div class="is-size-3 tile" slot="header">
            <strong class="tile is-child has-text-primary">
              Phiếu XUẤT
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
                    <b-input v-model="note"></b-input>
                  </div>
                </b-field>
              </div>
            </div>
          </div>
          <div class="content" style="margin-top: 20px">
            <b-table :data="entries" narrowed bordered detailed
            :row-class="(row, index) => row.inv_w < 0 ? 'is-warning' : ''">
              <template slot="header" scope="props">
                <strong class="is-size-5">
                  {{ props.column.label }}
                </strong>
              </template>
              <template scope="props">
                <b-table-column label="Sản Phẩm">
                  {{ props.row.inv.product.name }}
                </b-table-column>
                <b-table-column label="Kho" width="140">
                  {{ props.row.inv.wsale_qty + ' ' + props.row.inv.product.wsale_unit }} 
                  {{ props.row.inv.retail_qty ? props.row.inv.retail_qty + ' ' + props.row.inv.product.retail_unit : '' }}
                </b-table-column>
                <b-table-column label="Xuất" width="140">
                  {{(props.row.qty_w ? props.row.qty_w + ' ' + props.row.inv.product.wsale_unit : '') }} 
                  {{(props.row.qty_r ? props.row.qty_r + ' ' + props.row.inv.product.retail_unit : '')}}
                </b-table-column>

                <b-table-column label="Còn" width="140">
                  {{ props.row.inv_w + ' ' + props.row.inv.product.wsale_unit }} 
                  {{ (props.row.inv_r ? props.row.inv_r + ' ' + props.row.inv.product.retail_unit : '')}}
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
                    <div class="content columns">
                      <div class="column">
                        <p>
                          <strong>Ghi chú</strong>
                          <br> {{ props.row.note }}
                        </p>
                        <p>
                          <strong>Giá mua gần nhất</strong>
                          <br> {{ toCurrency(props.row.inv.wsale_cost) }}
                        </p>
                      </div>
                      <div class="column">
                        <p>
                          <strong>Tỉ lệ</strong>
                          <br> {{ props.row.inv.product.unit_ratio}}
                        </p>
                      </div>
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
                <b-autocomplete ref="inputProduct" v-model="productValue" :data="filteredProducts" @select="selectProduct" field="product.name" expanded keep-first>
                </b-autocomplete>
              </b-field>
            </div>      
            <div class="tile is-child">
              <strong>Đơn vị xuất</strong>
              <b-switch v-model="isWSale" size="is-medium" @input="switchChange">
                <strong>
                  {{ selectedProduct ? (isWSale ? 
                    selectedProduct.product.wsale_unit : selectedProduct.product.retail_unit ):''
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
            <button class="button is-success is-fullwidth is-outlined" @click="addRow">
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
          return option.product.name
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
        this.entryNote = null
      },
      addRow () {
        if (!this.selectedProduct) return

        var ind = _.find(this.entries, e => {
          return e.inv['.key'] === this.selectedProduct['.key']
        })

        var ratio = this.selectedProduct.product.unit_ratio
        if (ind) {
          ind.qty_w += this.isWSale ? parseInt(this.quantity) : 0
          ind.qty_r += this.isWSale ? 0 : parseInt(this.quantity)
          if (this.isWSale) {
            ind.inv_w -= this.quantity
          } else {
            ind.inv_w -= Math.floor(this.quantity / ratio)
            ind.inv_r -= this.quantity % this.ratio
            if (ind.inv_r < 0) {
              ind.inv_w -= 1
              ind.inv_r += parseInt(ratio)
            }
          }
          ind.total += this.quantity * this.unitPrice
        } else {
          ind = {
            inv: this.selectedProduct,
            qty_w: this.isWSale ? parseInt(this.quantity) : 0,
            qty_r: this.isWSale ? 0 : parseInt(this.quantity),
            inv_w: this.selectedProduct.wsale_qty,
            inv_r: this.selectedProduct.retail_qty,
            total: this.quantity * this.unitPrice
          }
          if (this.isWSale) {
            ind.inv_w -= this.quantity
          } else {
            ind.inv_w -= Math.floor(this.quantity / ratio)
            ind.inv_r -= this.quantity % ratio
            if (ind.inv_r < 0) {
              ind.inv_w -= 1
              ind.inv_r += parseInt(ratio)
            }
          }
          this.entries.push(ind)
        }
        this.resetForm()
        this.$refs.inputProduct.focus()
        window.scrollTo(0, 0)
      },
      deleteRow (obj) {
        this.entries = this.entries.filter(o => o !== obj)
      },
      newSheetValidate () {
        return new Promise((resolve, reject) => {
          var condition = this.entries.length !== 0

          if (condition) {
            var newSheet = {
              date: this.sheet_date.getTime(),
              note: this.note,
              grand_total: this.grandTotal
            }
            var failed = this.entries.filter(e => e.inv_w < 0).length > 0
            if (failed) {
              this.$dialog.confirm({
                title: 'Vượt quá tồn kho',
                message: `Có sản phẩm vượt quá tồn kho. Vẫn tiếp tục xuất?`,
                confirmText: 'Tiếp tục',
                type: 'is-danger',
                hasIcon: true,
                onConfirm: () => resolve(newSheet)
              })
            } else {
              resolve(newSheet)
            }
          }
        })
      },
      saveSheet () {
        try {
          this.newSheetValidate().then((newSheet) => {
            var sheetKey = Date.now()
            this.$firebaseRefs.exports.child(sheetKey).set(newSheet)
            this.entries.forEach((e) => {
              var update = {
                product: e.inv.product,
                qty_w: parseInt(e.qty_w),
                qty_r: parseInt(e.qty_r),
                inv_w: parseInt(e.inv_w),
                inv_r: parseInt(e.inv_r),
                total: parseInt(e.total)
              }
              this.$firebaseRefs.exports.child(sheetKey)
                .child('entries').child(e.inv['.key']).set(update)

              this.$firebaseRefs.inventory.child(e.inv['.key'] + '/logs')
                .child(sheetKey).set({
                  type: 'Export',
                  o_w_qty: e.inv.wsale_qty,
                  o_r_qty: e.inv.retail_qty,
                  inv_w: update.inv_w,
                  inv_r: update.inv_r
                })
              this.$firebaseRefs.inventory.child(e.inv['.key'] + '/wsale_qty')
                .set(update.inv_w)
              this.$firebaseRefs.inventory.child(e.inv['.key'] + '/retail_qty')
                .set(update.inv_r)
            })
            this.$store.dispatch('pushNotif', { message: 'Cập nhật Phiếu nhập thành công.', type: 'is-success' })
            this.$router.replace('/exportprint/' + sheetKey)
          }).catch(() => {
            throw new Error('thiếu dữ liệu.')
          })
        } catch (error) {
          this.$store.dispatch('pushNotif', { message: `Cập nhật thất bại.\nLỗi ${error.message}`, type: 'is-danger' })
        }
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