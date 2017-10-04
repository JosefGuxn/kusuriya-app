<template>
  <div>
    <button class="button" @click="help">Help!!</button>
  </div>
</template>

<script>
import _ from 'lodash'
import {db} from '@/firebase'
export default {
  firebase: {
    exports: db.ref('exports'),
    products: db.ref('inventory')
  },
  methods: {
    help () {
      this.exports.forEach(e => {
        var tmp = e.entries
        var grandtotal = 0
        if (tmp) {
          Object.keys(tmp).forEach(i => {
            grandtotal += tmp[i].total
            var p = _.find(this.products, p => {
              return p['.key'] === i
            })
            tmp[i].uom_retail = p.uom_retail
            tmp[i].uom_wsale = p.uom_wsale
            tmp[i].quan_w = tmp[i].is_wsale ? tmp[i].quantity : 0
            tmp[i].quan_r = tmp[i].is_wsale ? 0 : tmp[i].quantity
            tmp[i].retail_price = p.retail_price
            tmp[i].wsale_price = p.wsale_price
          })
          this.$firebaseRefs.exports.child(e['.key']).child('entries').set(tmp)
          this.$firebaseRefs.exports.child(e['.key']).child('grand_total').set(grandtotal)
        } else {
        }
      })
      console.log('You\'re welcome!')
    }
  }
}
</script>

<style scoped>

</style>