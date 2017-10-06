<template>
  <section>
    <div class="columns">
      <div class="column is-3">
        <div class="box">
          <strong class="is-size-4">
            Nhà Thuốc 41
          </strong>
          <br>
          <small>
            Số 1, Ni Sư Huỳnh Liên, P.10, Q.TB
          </small>
        </div>
      </div>
      <div class="column is-6">
        <div class="notification is-danger">
          <button class="delete" onclick="((this).parentNode.remove())"></button>
          Có {{ data.length }} sản phẩm sắp hết hạn.
        </div>
        <div class="box">
          <article v-for="row in dataTable" :key="row.product_name" class="media">
            <div class="media-left">
              <figure class="image is-16x32">
              </figure>
            </div>
            <div class="media-content">
              <strong class="is-size-5">{{row.product_name}}</strong>
              <small>@{{row.category}}</small>
              <small style="float:right;">{{lastUpdate(row.logs)}}</small>
              <br>
              &nbsp;&nbsp;Còn <b>{{row.quantity}} {{row.uom_wsale}} 
                {{row.remainder ? row.remainder + ' ' + row.uom_retail : ''}}</b>
              <br>
              &nbsp;&nbsp;Hạn dùng đến <b>{{moment(row.exp_date)}}</b>
            </div>
          </article>
        </div>
        <b-pagination
            :total="data.length"
            :current.sync="currentPage"
            order="is-centered"
            size="is-medium"
            :per-page="perPage">
        </b-pagination>
      </div>
      <div class="column is-3">
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
      data: [],
      currentPage: 1,
      perPage: 5
    }
  },
  firebase: {
    inventory: db.ref('inventory')
  },
  computed: {
    dataTable () {
      return this.data.slice((this.currentPage - 1) * this.perPage, this.currentPage * this.perPage)
    }
  },
  methods: {
    moment (time) {
      return moment(time).format('DD-MM-YYYY')
    },
    toCurrency (number) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number)
    },
    toNumber (number) {
      return new Intl.NumberFormat('vi-VN').format(number)
    },
    lastUpdate (logs) {
      var tmp = Object.keys(logs)
      moment.defineLocale('vn', {
        relativeTime: {
          future: '%s sau',
          past: '%s trước',
          s: 'vài giây',
          m: 'một phút',
          mm: '%d phút',
          h: 'một giờ',
          hh: '%d giờ',
          d: 'một ngày',
          dd: '%d ngày',
          M: 'một tháng',
          MM: '%d tháng',
          yy: '%d năm'
        }
      })
      return moment(parseInt(tmp[tmp.length - 1])).fromNow()
    }
  },
  beforeCreate () {
    if (!this.$store.getters.isLoggedIn) {
      this.$router.replace('/login')
    }
  },
  created () {
    var tmp = moment().add(6, 'M')
    this.data = this.inventory.filter(i => {
      return moment(i.exp_date) <= tmp
    }).sort((a, b) => {
      return parseInt(a.exp_date) - parseInt(b.exp_date)
    })
  }
}
</script>

<style scoped>

</style>