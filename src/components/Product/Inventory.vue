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
                <a class="button is-primary" href="/inventoryprint" target="_blank">
                  <b-icon icon="print"></b-icon>
                  <span>Print</span>
                </a>
              </div>
            </div>
          </div>
          <div class="content">
            <b-table :data="dataTable" bordered striped detailed narrowed 
              per-page="10" pagination-simple striped paginated
              :loading="dataTable.length === 0"
              default-sort="category" default-sort-direction="asc">
              <template slot="header" scope="props">
                <strong class="is-size-6">
                  {{ props.column.label }}
                </strong>
              </template>
              <template scope="props">
                <b-table-column field="category" label="Danh Mục" width="200" sortable>
                  <p>{{ props.row.product.category }}</p>
                </b-table-column>

                <b-table-column label="Sản Phẩm">
                  <strong class="is-size-5">
                    {{ props.row.product.name }}
                  </strong>
                </b-table-column>

                <b-table-column label="Số Lô" width="100">
                  <p>{{ props.row.stock_number }}</p>
                </b-table-column>

                <b-table-column label="Tồn" width="130" centered>
                  <strong class="tag is-info is-size-6">
                    {{ toNumber(props.row.wsale_qty) }} {{ props.row.product.wsale_unit }} 
                    {{ props.row.retail_qty > 0 ? (toNumber(props.row.retail_qty) + ' ' + props.row.product.retail_unit) : '' }}
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
                    <div class="content columns">
                      <div class="column">
                        <p>
                          <strong>Nhóm dược</strong>
                          <br> {{ props.row.product.class }}
                        </p>
                        <p>
                          <strong>Hoạt chất</strong>
                          <br> {{ props.row.product.chemical }}
                        </p>
                        <p>
                          <strong>Giá mua gần nhất</strong>
                          <br> {{ toCurrency(props.row.wsale_cost) }}
                        </p>
                      </div>
                      <div class="column">
                        <p>
                          <strong>Đv bán sỉ</strong>
                          <br> {{ props.row.product.wsale_unit }}
                        </p>
                        <p>
                          <strong>Đv bán lẻ</strong>
                          <br> {{ props.row.product.retail_unit }}
                        </p>
                        <p>
                          <strong>Tỉ lệ</strong>
                          <br> {{ props.row.product.unit_ratio}}
                        </p>
                      </div>
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
          <div class="tile" slot="header">
            <strong class="tile is-child">
              {{ current.product.name }}
            </strong>
            <div class="tile is-child is-1 has-text-right">
              <button class="button" @click="isEditMode = false">
                <b-icon icon="times"></b-icon>
              </button>
            </div>
          </div>
          <div class="panel-block tile is-vertical">     
            <div class="tile is-child">
              <strong>Số lô</strong>
              <b-input v-model="stockNumber"></b-input>
            </div>         
            <div class="tile is-child">
              <strong>Số lượng Sỉ</strong>
              <b-input v-model="wSaleQty" type="number"></b-input>
            </div>
            <div class="tile is-child">
              <strong>Số lượng Lẻ</strong>
              <b-input v-model="retailQty" type="number"></b-input>
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
              <money v-model="wSalePrice" class="input"></money>
            </div>      
            <div class="tile is-child">
              <strong>Giá bán lẻ</strong>
              <money v-model="retailPrice" class="input"></money>
            </div>      
          </div>
          <div class="panel-block">
            <b-field>
              <div class="control">
                <button class="button is-dark" @click="updateInventory">Cập nhật</button>
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
  export default {
    data () {
      return {
        isEditMode: false,
        searchText: '',
        dataTable: [],
        current: null,
        stockNumber: null,
        expDate: null,
        wSaleQty: null,
        retailQty: null,
        wSalePrice: null,
        retailPrice: null
      }
    },
    firebase: {
      inventory: db.ref('inventory')
    },
    methods: {
      searchData () {
        this.dataTable = this.inventory.filter((option) => {
          return (option.product) && (option.product.name
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
          message: `Xác nhận <b>XÓA</b> Dữ liệu ${obj.product.name}?`,
          confirmText: 'Xóa Dữ liệu',
          type: 'is-danger',
          hasIcon: true,
          onConfirm: () => this.removeProduct(obj)
        })
      },
      removeProduct (product) {
        this.$firebaseRefs.inventory.child(product['.key']).remove().then(() => {
          this.$store.dispatch('pushNotif', { type: 'is-success', message: 'Xóa Dữ liệu thành công.' })
          window.location.reload(true)
        }).catch(error => {
          this.$store.dispatch('pushNotif', { type: 'is-danger', message: 'Cập nhật thất bại!' })
          console.log(error)
        })
      },
      editRow (obj) {
        this.isEditMode = true
        this.current = obj
        this.wSaleQty = obj.wsale_qty
        this.retailQty = obj.retail_qty
        this.stockNumber = obj.stock_number
        this.expDate = new Date(obj.exp_date)
        this.wSalePrice = obj.wsale_price
        this.retailPrice = obj.retail_price
      },
      updateInventory () {
        var update = {
          product: this.current.product,
          logs: this.current.logs,
          wsale_cost: this.current.wsale_cost,
          wsale_qty: this.wSaleQty,
          retail_qty: this.retailQty,
          stock_number: this.stockNumber,
          exp_date: this.expDate.getTime(),
          wsale_price: this.wSalePrice,
          retail_price: this.retailPrice
        }
        if (!update.logs) update.logs = {}
        update.logs[Date.now()] = {
          type: 'Edit',
          o_w_qty: this.current.wsale_qty,
          o_r_qty: this.current.retail_qty,
          w_qty: this.wSaleQty,
          r_qty: this.retailQty
        }
        this.$firebaseRefs.inventory.child(this.current['.key']).set(update).then(() => {
          this.$store.dispatch('pushNotif', { type: 'is-success', message: 'Cập nhật Dữ liệu thành công.' })
          this.dataTable = this.inventory
          this.isEditMode = false
        }).catch(error => {
          this.$store.dispatch('pushNotif', { type: 'is-danger', message: 'Cập nhật thất bại!' })
          console.log(error)
        })
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