<template>
  <div>
    <button class="button" @click="help">Help!!</button>
  </div>
</template>

<script>
// import _ from 'lodash'
import {db} from '@/firebase'
export default {
  firebase: {
    exports: db.ref('exports').orderByKey().startAt('1506995019000'),
    products: db.ref('inventory')
  },
  methods: {
    help () {
      this.products.forEach(p => {
        if (p.remainder < 0) {
          this.$firebaseRefs.products.child(p['.key']).child('quantity').set(parseInt(p.quantity) + 1)
          this.$firebaseRefs.products.child(p['.key']).child('remainder').set(0)
          console.log(p.product_name)
        }
      })
      console.log('You\'re welcome!')
    }
  }
}
</script>

<style scoped>

</style>