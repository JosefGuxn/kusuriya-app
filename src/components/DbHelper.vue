<template>
  <div>
    <button class="button" @click="help">Help!!</button>
  </div>
</template>

<script>
// import _ from 'lodash'
// import moment from 'moment'
import {db} from '@/firebase'
export default {
  firebase: {
    imports: db.ref('imports')
  },
  methods: {
    help () {
      this.imports.forEach(i => {
        // var sum = 0
        Object.keys(i.entries).forEach(k => {
          // sum += i.entries[k].quantity * i.entries[k].unit_price
          this.$firebaseRefs.imports.child(i['.key'] + '/entries/' + k)
            .child('product').set({product_name: i.entries[k].product_name})
        })
        // this.$firebaseRefs.imports.child(i['.key']).child('grand_total').set(sum)
      })
      console.log('You\'re welcome!')
    }
  }
}
</script>

<style scoped>

</style>