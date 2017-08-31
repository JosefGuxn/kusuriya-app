<template>
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
              <span>Lưu & Tạo mới mới</span>
            </button>
          </div>
        </div>
        <div class="panel-block">
          <div class="tile">
            <strong class="tile is-child is-3 is-size-5">Nhà cung cấp</strong>
            <div class="tile is-child is-6">
              <b-field grouped>
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
                  <b-datepicker v-model="sheet_date" :date-formatter="formatter">
                  </b-datepicker>
                </div>
              </b-field>
            </div>
          </div>
        </div>
        <div class="panel-block">
          <div class="tile">
            <strong class="tile is-child is-3 is-size-5">Ký gửi</strong>
            <div class="tile is-child is-3">
              <b-field>
                <div class="control">
                  <b-checkbox v-model="is_consigned"></b-checkbox>
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

              <b-table-column label="Số Lượng" width="140">
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
            Thêm sản phẩm
          </strong>         
        </div>
        <div class="panel-block tile is-vertical">         
          <div class="tile is-child">
            <strong>Sản phẩm</strong>
            <b-field :type="seletedProduct === null ? 'is-danger':''">
              <b-autocomplete ref="inputProduct" v-model="productValue" 
              :data="filteredProducts" 
              @select="o => seletedProduct = o" 
              field="product_name" expanded keep-first>
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
                <DatePicker v-model="expDate" type="date" size="large" 
                format="dd/MM/yyyy" placement="top-start" 
                :clearable="false"></DatePicker>
              </div>
            </div>
          </div>              
          <div class="tile is-child">
            <strong>Giá mua</strong>
            <b-input v-model="unitPrice" type="number"></b-input>
          </div>
          <div class="tile is-child">
            <strong>Giá bán sỉ</strong>
            <b-input v-model="wSalePrice" type="number"></b-input>
          </div>
          <div class="tile is-child">
            <strong>Giá bán lẻ</strong>
            <b-input v-model="retailPrice" type="number"></b-input>
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
    <b-modal :active.sync="isModalActive" has-modal-card>
      <modal-form v-bind="formProps"></modal-form>
    </b-modal>
  </div>
</template>

<script>
  import ModalForm from '@/components/Modal/ModalForm'
  import { db } from '@/firebase'
  import moment from 'moment'
  import _ from 'lodash'
  export default {
    components: {
      ModalForm
    },
    data () {
      return {
        entries: [],
        formatter: (date) => date.toLocaleDateString('vi-VN'),
        formProps: {
          info: '',
          action: ''
        },
        isModalActive: false,
        supplier: null,
        sheet_date: new Date(),
        is_consigned: false,
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
      }
    },
    methods: {
      moment (time) {
        return moment(time).format('DD/MM/YYYY')
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
        //
        return {
          supplier: this.supplier,
          date: this.sheet_date.getTime(),
          is_consigned: this.is_consigned,
          note: this.note
        }
      },
      importSheet () {
        var newSheet = this.newSheetValidate()
        new Promise((resolve, reject) => {
          if (newSheet) {
            this.$firebaseRefs.imports.push(newSheet)
            var tmp = this.imports[this.imports.length - 1]
            this.entries.forEach((e) => {
              var update = {
                product_name: e.product.product_name,
                category: e.product.category,
                class: e.product.class,
                stock_number: e.stock_number,
                quantity: parseInt(e.quantity),
                exp_date: e.exp_date.getTime(),
                unit_price: parseInt(e.unit_price),
                wsale_price: parseInt(e.wsale_price),
                retail_price: parseInt(e.retail_price)
              }
              this.$firebaseRefs.imports.child(tmp['.key'])
                .child('entries').child(e.product['.key']).set(update)

              var ind = _.find(this.inventory, i => { return i['.key'] === e.product['.key'] })

              if (ind) {
                update.quantity += parseInt(ind.quantity)
              }
              this.$firebaseRefs.inventory.child(e.product['.key']).set(update)
            })
            resolve()
          } else {
            reject()
          }
        }).then(() => {
          this.$store.dispatch('pushNotif', { message: 'Cập nhật Phiếu nhập thành công.', type: 'is-success' })
        }).catch(() => {
          this.$store.dispatch('pushNotif', { message: 'Cập nhật thất bại.', type: 'is-danger' })
        })
      },
      importSheetAndClose () {
        this.importSheet()
        this.$router.push('/dashboard')
      },
      importSheetAndReload () {
        this.importSheet()
        this.resetForm()
        this.supplier = null
        this.sheet_date = new Date()
        this.is_consigned = false
        this.note = null
        this.entries = []
        window.scrollTo(0, 0)
      },
      addSupplier () {
        this.formProps.info = 'Nhà cung cấp'
        this.formProps.action = 'addSupplier'
        this.isModalActive = true
      },
      toCurrency (number) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number)
      },
      toNumber (number) {
        return new Intl.NumberFormat('vi-VN').format(number)
      }
    }
  }
</script>

<style scoped>

</style>