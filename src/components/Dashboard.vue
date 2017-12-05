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
        <div class="notification is-danger is-size-5">
          <button class="delete" onclick="((this).parentNode.remove())"></button>
          Có <b>{{ warning.length }}</b> sản phẩm sắp hết hạn.
        </div>
        <div class="box">
          <article v-for="row in dataTable" :key="row.product.name" class="media">
            <div class="media-left">
              <figure class="image is-16x32">
              </figure>
            </div>
            <div class="media-content">
              <strong class="is-size-5">{{row.product.name}}</strong>
              <small>@{{row.product.category}}</small>
              <small style="float:right;">Cập nhật {{lastUpdate(row.logs)}}</small>
              <br>
              &nbsp;&nbsp;Còn <b>{{row.wsale_qty}} {{row.wsale_unit}} 
                {{row.retail_qty ? row.retail_qty + ' ' + row.retail_unit : ''}}</b>
              <br>
              &nbsp;&nbsp;Hạn dùng đến <b>{{moment(row.exp_date)}}</b>
            </div>
          </article>
        </div>
        <b-pagination
            :total="warning.length"
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

const SIX_MONTHS = 6 * 30 * 24 * 60 * 60 * 1000

export default {
  data () {
    return {
      currentPage: 1,
      perPage: 5
    }
  },
  firebase: {
    warning: db.ref('inventory').orderByChild('exp_date').endAt(Date.now() + SIX_MONTHS)
  },
  computed: {
    dataTable () {
      return this.warning.sort((a, b) => a.exp_date - b.exp_date).slice((this.currentPage - 1) * this.perPage, this.currentPage * this.perPage)
    }
  },
  methods: {
    lastUpdate (logs) {
      if (!logs) return null
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
  }
}
</script>

<style scoped>

</style>