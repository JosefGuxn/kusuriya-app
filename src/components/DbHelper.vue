<template>
  <div>
    <b-select v-model="selectedOpt" placeholder="Select an option">
      <option v-for="option in options" :value="option.id" :key="option.id">
        {{option.opt}}
      </option>
    </b-select>
    <button class="button" @click="help">Help!!</button>
  </div>
</template>

<script>
import _ from 'lodash'
// import moment from 'moment'
import {db} from '@/firebase'
export default {
  data () {
    return {
      options: [
        {id: 0, opt: 'Imports_db'},
        {id: 1, opt: 'Inventory_db'},
        {id: 2, opt: 'Products_db'}
      ],
      selectedOpt: null
    }
  },
  firebase: {
    imports: db.ref('imports'),
    inventory: db.ref('inventory'),
    products: db.ref('products')
  },
  methods: {
    importsDB () {
      this.imports.forEach(i => {
        var sum = 0
        if (i.entries) {
          Object.keys(i.entries).forEach(k => {
            sum += i.entries[k].quantity * i.entries[k].unit_price
            this.$firebaseRefs.imports.child(i['.key'] + '/entries/' + k)
              .child('product').set({product_name: i.entries[k].product_name})
          })
          this.$firebaseRefs.imports.child(i['.key']).child('grand_total').set(sum)
        } else {
          this.$firebaseRefs.imports.child(i['.key']).remove()
        }
      })
    },
    inventoryDB () {
      this.inventory.forEach(i => {
        var ind = _.find(this.products, p => p['.key'] === i['.key'])
        if (ind) {
          delete ind['.key']
          this.$firebaseRefs.inventory.child(i['.key']).child('product').set(ind)
          this.$firebaseRefs.inventory.child(i['.key']).child('category').remove()
          this.$firebaseRefs.inventory.child(i['.key']).child('chemical').remove()
          this.$firebaseRefs.inventory.child(i['.key']).child('class').remove()
          this.$firebaseRefs.inventory.child(i['.key']).child('uom_retail').remove()
          this.$firebaseRefs.inventory.child(i['.key']).child('uom_wsale').remove()
          this.$firebaseRefs.inventory.child(i['.key']).child('uom_rate').remove()
          this.$firebaseRefs.inventory.child(i['.key']).child('product_name').remove()

          this.$firebaseRefs.inventory.child(i['.key']).child('retail_qty').set(i.remainder || i.retail_qty || 0)
          this.$firebaseRefs.inventory.child(i['.key']).child('wsale_qty').set(i.quantity || i.wsale_qty || 0)
          this.$firebaseRefs.inventory.child(i['.key']).child('wsale_cost').set(i.unit_price || i.wsale_cost || 0)
          this.$firebaseRefs.inventory.child(i['.key']).child('quantity').remove()
          this.$firebaseRefs.inventory.child(i['.key']).child('remainder').remove()
          this.$firebaseRefs.inventory.child(i['.key']).child('unit_price').remove()
        } else {
          console.log('Delete ' + i.product_name + ' from inventory.')
          this.$firebaseRefs.inventory.child(i['.key']).remove()
        }
      })
    },
    productsDB () {
      this.products.forEach(p => {
        this.$firebaseRefs.products.child(p['.key']).child('name').set(p.product_name)
        this.$firebaseRefs.products.child(p['.key']).child('unit_ratio').set(p.uom_rate)
        this.$firebaseRefs.products.child(p['.key']).child('retail_unit').set(p.uom_retail)
        this.$firebaseRefs.products.child(p['.key']).child('wsale_unit').set(p.uom_wsale)

        this.$firebaseRefs.products.child(p['.key']).child('product_name').remove()
        this.$firebaseRefs.products.child(p['.key']).child('stock_number').remove()
        this.$firebaseRefs.products.child(p['.key']).child('uom_rate').remove()
        this.$firebaseRefs.products.child(p['.key']).child('uom_wsale').remove()
        this.$firebaseRefs.products.child(p['.key']).child('uom_retail').remove()
      })
    },
    help () {
      switch (this.selectedOpt) {
        case 0:
          this.importsDB()
          break
        case 1:
          this.inventoryDB()
          break
        case 2:
          this.productsDB()
          break
        default:
          break
      }
      console.log('You\'re welcome!')
    }
  }
}
</script>

<style scoped>

</style>