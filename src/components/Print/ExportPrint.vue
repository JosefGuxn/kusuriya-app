<template>
  <section>
    <div class="tile is-vertical print-content">
      <div class="tile is-child hide-content">
        <button class="button is-primary" @click="print">
          <b-icon icon="print"></b-icon>
          <span>Print</span>
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
              {{moment(sheet.date)}}
            </div>
          </div>
          <div class="tile is-parent">
            <div class="tile is-child is-3">
              Tổng tiền:
            </div>
            <div class="tile is-child">
              {{toCurrency(sheet.grand_total)}}
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
            <b-table-column label="Số Lượng Xuất">
              {{(props.row.qty_w ? props.row.qty_w + ' ' + props.row.product.wsale_unit : '') }}
               {{ (props.row.qty_r ? props.row.qty_r + ' ' + props.row.product.retail_unit : '')}}
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
export default {
  data () {
    return {
      sheet: [],
      dataTable: []
    }
  },
  methods: {
    print () {
      window.print()
    },
    newSheet () {
      this.$router.replace('/newexportsheet')
    }
  },
  created () {
    if (!this.$store.getters.isLoggedIn) {
      return this.$router.replace('/login')
    }
  },
  beforeMount () {
    db.ref('exports').child(this.$route.params.key).once('value', (val) => {
      this.sheet = val.val()
      this.dataTable = Object.values(val.child('entries').val())
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
