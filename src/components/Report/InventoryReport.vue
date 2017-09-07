<template>
  <section>
    <div class="tile is-vertical">
      <div class="tile is-child">
        <button class="button is-primary" @click="print">
          <b-icon icon="print"></b-icon>
          <span>Print</span>
        </button>
      </div>
      <div class="tile is-child">
        <p class="is-size-6">
          <b class="subtitle">NHÀ THUỐC SỐ 41</b> <br>
          Địa chỉ:<br>
          Sđt:
        </p>
      </div>
      <div class="tile is-child">
        <p class="title has-text-centered is-size-1">
          THÔNG TIN KHO THUỐC
        </p>
      </div>
      <div class="tile is-child">
        <b-table :data="dataTable" bordered narrowed striped>
          <template slot="header" scope="props">
            <strong class="is-size-6">
              {{ props.column.label }}
            </strong>
          </template>
          <template scope="props">
            <b-table-column label="Danh Mục" width="200">
              <p>{{ props.row.category }}</p>
            </b-table-column>

            <b-table-column label="Sản Phẩm">
              <strong class="subtitle">
                {{ props.row.product_name }}
              </strong>
            </b-table-column>

            <b-table-column label="Nhóm Dược" width="200">
              <p>{{ props.row.class }}</p>
            </b-table-column>

            <b-table-column label="Hoạt Chất" width="200">
              <p>{{ props.row.chemical }}</p>
            </b-table-column>

            <b-table-column label="Số Lô" width="100">
              <p>{{ props.row.stock_number }}</p>
            </b-table-column>

            <b-table-column label="Số Lượng" width="130" centered>
              {{ toNumber(props.row.quantity) }} {{ props.row.uom_wsale }} {{ props.row.remainder > 0 ? (toNumber(props.row.remainder) + ' ' + props.row.uom_retail) : '' }}
            </b-table-column>

            <b-table-column label="Hạn Dùng" width="130" centered>
              {{ moment(props.row.exp_date) }}
            </b-table-column>

            <b-table-column label="Giá Bán Sỉ" width="130" centered>
              {{ toCurrency(props.row.wsale_price) }}
            </b-table-column>

            <b-table-column label="Giá Bán Lẻ" width="130" centered>
              {{ toCurrency(props.row.retail_price) }}
            </b-table-column>           
          </template>
        </b-table>
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
        dataTable: []
      }
    },
    firebase: {
      inventory: db.ref('inventory')
    },
    methods: {
      print () {
        window.print()
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