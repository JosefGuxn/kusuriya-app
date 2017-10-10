<template>
  <section>
    <div class="columns">
      <div class="column">
        <b-panel has-custom-template>
          <div class="is-size-3 tile is-ancestor" slot="header">
            <strong class="tile is-parent is-4 has-text-primary">
              Thông tin Phiếu Nhập
            </strong>
            <b-field class="tile is-parent">
              <div class="control">
                <DatePicker v-model="date" type="date" size="large" format="dd/MM/yyyy"></DatePicker>
              </div>   
              <button class="button" @click="searchData">
                <b-icon icon="search">
                </b-icon>
              </button>           
            </b-field>
          </div>
          <div class="content">
            <b-table :data="dataTable" bordered striped detailed narrowed 
              per-page="10" pagination-simple paginated
              :loading="dataTable.length === 0"
              default-sort="date" default-sort-direction="desc">
              <template slot="header" scope="props">
                <strong class="is-size-6">
                  {{ props.column.label }}
                </strong>
              </template>
              <template scope="props">
                <b-table-column field="date" label="Ngày Nhập" sortable>
                  <p>{{ moment(props.row.date) }}</p>
                </b-table-column>              

                <b-table-column label="Số Sản Phẩm Nhập" width="200" centered>
                  <p>{{ props.row.entries ? Object.keys(props.row.entries).length : 0 }}</p>
                </b-table-column>               

                <b-table-column label="Nhà Cung Cấp" centered>
                  {{ props.row.supplier }}
                </b-table-column>

                <b-table-column width="100">
                  <div class="tile">
                    <div class="tile is-child">
                      <button class="button is-danger is-outlined" @click="confirmRemoveRow(props.row)">
                        <b-icon icon="trash-o"></b-icon>
                      </button>
                      <a class="button is-primary is-outlined" :href="'/importprint/'+props.row['.key']" target="_blank">
                        <b-icon icon="print"></b-icon>
                      </a>
                    </div>
                  </div>
                </b-table-column>
              </template>

              <template slot="detail" scope="props">
                <article class="media">
                  <div class="media-content">
                    <b-table :data="Object.values(props.row.entries)" bordered striped narrowed>
                      <template scope="props">
                        <b-table-column label="Sản Phẩm">
                          <p>{{ props.row.product_name }}</p>
                        </b-table-column>
                        <b-table-column label="Số Lô">
                          {{ props.row.stock_number }}
                        </b-table-column>
                        <b-table-column label="Số Lượng Nhập" width="180">
                          {{ props.row.quantity }}
                        </b-table-column>                       
                        <b-table-column label="Giá Mua">
                          {{ toCurrency(props.row.unit_price) }}
                        </b-table-column>
                        <b-table-column label="Thành Tiền">
                          <p>{{ toCurrency(props.row.quantity * props.row.unit_price) }}</p>
                        </b-table-column>
                      </template>
                    </b-table>
                  </div>
                </article>
              </template>
            </b-table>
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
        date: 0,
        dataTable: []
      }
    },
    firebase: {
      imports: db.ref('imports')
    },
    computed: {
    },
    methods: {
      searchData () {
        this.dataTable = this.exports.filter((option) => {
          return (option.date >= this.date)
        })
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
      print () {
        this.$router.replace('/printexport')
      },
      moment (time) {
        return moment(time).format('DD-MM-YYYY')
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
      this.dataTable = this.imports
    }
  }
</script>

<style scoped>

</style>