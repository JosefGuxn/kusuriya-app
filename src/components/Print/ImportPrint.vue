<template>
  <section>
    <div class="tile is-vertical print-content">
      <div class="tile is-child hide-content">
        <button class="button is-primary" @click="print">
          <b-icon icon="print"></b-icon>
          <span>In phiếu</span>
        </button>
        <button class="button is-primary" @click="newSheet">
          <b-icon icon="file-o"></b-icon>
          <span>Phiếu mới</span>
        </button>
      </div>
      <div class="tile is-child">
        <p class="is-size-6">
          <b class="subtitle">NHÀ THUỐC SỐ 41</b> <br>
          Địa chỉ: Số 1, Đường Ni Sư Huỳnh Liên, Phường 10, Q.Tân Bình<br>
          Sđt: 08 38 600 847
        </p>
      </div>
      <div class="tile is-child">
        <p class="title has-text-centered">
          PHIẾU NHẬP
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
              {{moment(importsheet.date)}}
            </div>
          </div>
          <div class="tile is-parent">
            <div class="tile is-child is-3">
              Nhà cung cấp:
            </div>
            <div class="tile is-child">
              {{ importsheet.supplier }}
            </div>
          </div>
        </div>
      </div>
      <div class="tile is-child">
        <b-table :data="dataTable" bordered striped narrowed>
          <template scope="props">
            <b-table-column label="Sản Phẩm">
              <p>{{ props.row.product.name }}</p>
            </b-table-column>
            <b-table-column label="Số Lô">
              {{ props.row.stock_number }}
            </b-table-column>
            <b-table-column label="Số Lượng Nhập" width="170">
              {{ props.row.wsale_qty }}
            </b-table-column>          
            <b-table-column label="Giá Mua">
              {{ toCurrency(props.row.wsale_cost) }}
            </b-table-column>
            <b-table-column label="Thành Tiền">
              <p>{{ toCurrency(props.row.wsale_qty * props.row.wsale_cost) }}</p>
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
      importsheet: []
    }
  },
  computed: {
    dataTable () {
      return Object.values(this.importsheet.entries)
    }
  },
  methods: {
    print () {
      window.print()
    },
    newSheet () {
      this.$router.replace('/newimportsheet')
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
    db.ref('imports').child(this.$route.params.key).once('value', (val) => {
      this.importsheet = val.val()
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
