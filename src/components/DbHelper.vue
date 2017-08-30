<template>
  <div>
    <button class="button" @click="help">Help!!</button>
  </div>
</template>

<script>
import {db} from '@/firebase'
export default {
  firebase: {
    products: db.ref('products')
  },
  methods: {
    help () {
      this.products.forEach(p => {
        this.$firebaseRefs.products.child(p['.key']).child('key').set(null)
        if (p.category.value) {
          this.$firebaseRefs.products.child(p['.key']).child('category').set(p.category.value)
        }
        this.$firebaseRefs.products.child(p['.key']).child('chemicals').set(null)
        if (p.chemical.value) {
          this.$firebaseRefs.products.child(p['.key']).child('chemical').set(p.chemical.value)
        }
        if (p.class.value) {
          this.$firebaseRefs.products.child(p['.key']).child('class').set(p.class.value)
        }
        if (p.uom_wsale.value) {
          this.$firebaseRefs.products.child(p['.key']).child('uom_wsale').set(p.uom_wsale.value)
        }
        if (p.uom_retail.value) {
          this.$firebaseRefs.products.child(p['.key']).child('uom_retail').set(p.uom_retail.value)
        }
      })

      console.log('You\'re welcome!')
    }
  }
}
</script>

<style scoped>

</style>