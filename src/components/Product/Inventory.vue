<template>
  <section>
    <div class="columns">
      <div class="column">
        <b-panel has-custom-template>
          <div class="is-size-3 tile is-ancestor" slot="header">
            <strong class="tile is-parent is-5 has-text-primary">
              Thông tin Kho thuốc
            </strong>
            <div class="tile is-parent has-text-right">
              <b-field class="tile is-child">
                <b-input v-model="searchText"
                  placeholder="Enter để tìm theo Tên và Hoạt chất..." expanded
                  @keydown.enter.native="searchData">
                </b-input>     
                <button class="button" @click="clearSearch">
                  <b-icon icon="close">                      
                  </b-icon>
                </button>           
              </b-field> 
              <div class="tile is-child is-5">
                <button class="button is-primary">
                  <b-icon icon="print"></b-icon>
                  <span>Print</span>
                </button>
              </div>
            </div>
          </div>
          <div class="content">
            <b-table :data="dataTable" bordered striped detailed narrowed 
              :loading="dataTable.length === 0"
              default-sort="category" default-sort-direction="asc">
              <template slot="header" scope="props">
                <strong class="is-size-6">
                  {{ props.column.label }}
                </strong>
              </template>
              <template scope="props">
                <b-table-column field="category" label="Danh Mục" width="200" sortable>
                  <p>{{ props.row.category }}</p>
                </b-table-column>

                <b-table-column label="Sản Phẩm">
                  <strong class="is-size-5">
                    {{ props.row.product_name }}
                  </strong>
                </b-table-column>

                <b-table-column label="Số Lô" width="100">
                  <p>{{ props.row.stock_number }}</p>
                </b-table-column>

                <b-table-column label="Số Lượng" width="130" centered>
                  <strong class="tag is-info is-size-6">
                    {{ toNumber(props.row.quantity) }}
                  </strong>
                </b-table-column>

                <b-table-column label="Hạn Dùng" width="130" centered>
                  <strong class="tag is-success is-size-6">
                    {{ moment(props.row.exp_date) }}
                  </strong>
                </b-table-column>

                <b-table-column label="Giá Bán Sỉ" width="130" centered>
                  <strong class="tag is-dark is-size-6">
                    {{ toCurrency(props.row.wsale_price) }}
                  </strong>
                </b-table-column>

                <b-table-column label="Giá Bán Lẻ" width="130" centered>
                  <strong class="tag is-dark is-size-6">
                    {{ toCurrency(props.row.retail_price) }}
                  </strong>
                </b-table-column>

                <b-table-column width="100">
                  <div class="tile">
                    <div class="tile is-child">
                      <button class="button is-dark is-outlined" @click="editRow(props.row)">
                        <b-icon icon="pencil"></b-icon>
                      </button>
                    </div>
                    <div class="tile is-child">
                      <button class="button is-danger is-outlined" @click="confirmRemoveProduct(props.row)">
                        <b-icon icon="trash-o"></b-icon>
                      </button>
                    </div>
                  </div>
                </b-table-column>
              </template>

              <template slot="detail" scope="props">
                <article class="media">
                  <div class="media-content">
                    <div class="content">
                      <p>
                        <strong>Nhóm dược</strong>
                        <br> {{ props.row.class }}
                      </p>
                      <p>
                        <strong>Hoạt chất</strong>
                        <br> {{ props.row.chemical }}
                      </p>
                      <p>
                        <strong>Giá mua</strong>
                        <br> {{ toCurrency(props.row.unit_price) }}
                      </p>
                    </div>
                  </div>
                </article>
              </template>
            </b-table>
          </div>
        </b-panel>
      </div>
      <div v-if="isEditMode" class="column is-4">
        <b-panel has-custom-template>
          <div class="tile is-size-3" slot="header">           
            <strong class="tile is-child">
              Sửa Dữ liệu
            </strong>
            <div class="tile is-child is-1 has-text-right">
              <button class="button" @click="isEditMode = false">
                <b-icon icon="times"></b-icon>
              </button>
            </div>
          </div>
          <div class="panel-block tile is-vertical">
            <div class="tile is-child">
              <strong>Danh mục</strong>
              {{ currentEditProduct.category }}
            </div>
            <div class="tile is-child">
              <strong>Tên sản phẩm</strong>
              {{ currentEditProduct.product_name }}
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
              <strong>Giá bán sỉ</strong>
              <b-input v-model="wSalePrice" type="number"></b-input>
            </div>      
            <div class="tile is-child">
              <strong>Giá bán lẻ</strong>
              <b-input v-model="retailPrice" type="number"></b-input>
            </div>      
          </div>
          <div class="panel-block">
            <b-field>
              <div class="control">
                <button class="button is-dark" @click="editProduct">Sửa</button>
              </div>                  
            </b-field>
          </div>
        </b-panel>
      </div>
    </div>
  </section>
</template>

<script>
  import { db } from '@/firebase'
  import moment from 'moment'
  export default {
    data () {
      return {
        isEditMode: false,
        searchText: '',
        dataTable: [],
        currentEditProduct: null,
        stockNumber: null,
        expDate: null,
        quantity: null,
        wSalePrice: null,
        retailPrice: null
      }
    },
    firebase: {
      inventory: db.ref('inventory')
    },
    computed: {
    },
    methods: {
      searchData () {
        this.dataTable = this.inventory.filter((option) => {
          return (option.product_name
            .toString()
            .toLowerCase()
            .indexOf(this.searchText.toLowerCase()) >= 0) ||
            (option.chemical
              .toString()
              .toLowerCase()
              .indexOf(this.searchText.toLowerCase()) >= 0)
        })
      },
      clearSearch () {
        this.searchText = ''
        this.dataTable = this.inventory
      },
      confirmRemoveProduct (obj) {
        this.$dialog.confirm({
          title: 'Xóa Dữ liệu',
          message: `Bạn có chắc chắn muốn <b>xóa</b> Dữ liệu ${obj.product_name} không?`,
          confirmText: 'Xóa Dữ liệu',
          type: 'is-danger',
          hasIcon: true,
          onConfirm: () => this.removeProduct(obj)
        })
      },
      removeProduct (product) {
        this.$firebaseRefs.inventory.child(product['.key']).remove().then(() => {
          this.$store.dispatch('pushNotif', { type: 'is-success', message: 'Xóa Dữ liệu thành công.' })
          this.dataTable = this.inventory
        }).catch(error => {
          this.$store.dispatch('pushNotif', { type: 'is-danger', message: 'Cập nhật thất bại!' })
          console.log(error)
        })
      },
      editRow (obj) {
        this.isEditMode = true
        this.currentEditProduct = obj
        this.quantity = obj.quantity
        this.stockNumber = obj.stock_number
        this.expDate = obj.exp_date
        this.wSalePrice = obj.wsale_price
        this.retailPrice = obj.retail_price
      },
      editProduct () {
        var update = {
          product_name: this.currentEditProduct.product_name,
          category: this.currentEditProduct.category,
          chemical: this.currentEditProduct.chemical,
          class: this.currentEditProduct.class,
          uom_wsale: this.currentEditProduct.uom_wsale,
          uom_retail: this.currentEditProduct.uom_retail,
          uom_rate: this.currentEditProduct.uom_rate,
          unit_price: this.currentEditProduct.unit_price,
          logs: this.currentEditProduct.logs,
          quantity: this.quantity,
          stock_number: this.stockNumber,
          exp_date: this.expDate,
          wsale_price: this.wSalePrice,
          retail_price: this.retailPrice
        }
        update.logs[Date.now().toString()] = {
          type: 'Edit',
          quantity: this.quantity
        }
        this.$firebaseRefs.inventory.child(this.currentEditProduct['.key']).set(update).then(() => {
          this.$store.dispatch('pushNotif', { type: 'is-success', message: 'Cập nhật Dữ liệu thành công.' })
          this.dataTable = this.inventory
          this.isEditMode = false
        }).catch(error => {
          this.$store.dispatch('pushNotif', { type: 'is-danger', message: 'Cập nhật thất bại!' })
          console.log(error)
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
        return this.$router.replace('/login')
      }
      this.dataTable = this.inventory
    }
  }
</script>

<style scoped>

</style>