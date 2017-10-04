<template>
  <section>
    <div class="tile is-vertical print-content">
      <div class="tile is-child hide-content">
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
        <p class="title has-text-centered">
          PHIẾU XUẤT
        </p>
      </div>
      <div class="tile is-child">
        <div class="tile is-ancestor is-vertical">
          <div class="tile is-parent is-1">
          </div>
          <div class="tile is-parent">
            <div class="tile is-child is-3">
              Ngày:
            </div>
            <div class="tile is-child">
              {{moment(exportsheet.date)}}
            </div>
          </div>
          <div class="tile is-parent">
            <div class="tile is-child is-3">
              Tổng tiền:
            </div>
            <div class="tile is-child">
              {{toCurrency(exportsheet.grand_total)}}
            </div>
          </div>
        </div>
      </div>
      <div class="tile is-child">
        <b-table :data="dataTable" bordered striped narrowed>
          <template scope="props">
            <b-table-column label="Sản Phẩm">
              <p>{{ props.row.product_name }}</p>
            </b-table-column>
            <b-table-column label="Số Lượng Xuất">
              {{(props.row.quan_w ? + props.row.quan_w + ' ' + props.row.uom_wsale : '')
                  + ' ' 
                  + (props.row.quan_r ? + props.row.quan_r + ' ' + props.row.uom_retail : '')}}
            </b-table-column>
            <b-table-column label="Thành Tiền">
              <p>{{ toCurrency(props.row.total) }}</p>
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
      exportsheet: null
    }
  },
  computed: {
    dataTable () {
      return Object.values(this.exportsheet.entries)
    }
  },
  methods: {
    print () {
      window.print()
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
  },
  beforeMount () {
    db.ref('exports').child(this.$route.params.key).on('value', (val) => {
      this.exportsheet = val.val()
    })
  }
}
</script>

<style>
  @media print {
    .hide-content {
      display: none;
    }
  }
</style>
