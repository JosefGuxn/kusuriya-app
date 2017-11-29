<template>
  <div>
    <button class="button" @click="help">Help!!</button>
  </div>
</template>

<script>
// import _ from 'lodash'
import moment from 'moment'
import {db} from '@/firebase'
export default {
  firebase: {
    inventory: db.ref('inventory'),
    warning: db.ref('warning/exp')
  },
  methods: {
    help () {
      var tmp = moment().add(6, 'M')
      this.inventory.filter(i => {
        return moment(i.exp_date) <= tmp
      }).forEach(item => {
        this.$firebaseRefs.warning.child(item['.key']).set({
          product_name: item.product_name,
          category: item.category,
          quantity: item.quantity,
          remainder: item.remainder || 0,
          uom_wsale: item.uom_wsale,
          uom_retail: item.uom_retail,
          exp_date: item.exp_date,
          logs: item.logs
        })
      })
      console.log('You\'re welcome!')
    }
  }
}
</script>

<style scoped>

</style>