<template>
  <div>
    <button class="button" @click="help">Help!!</button>
  </div>
</template>

<script>
import {db} from '@/firebase'
export default {
  firebase: {
    inventory: db.ref('inventory')
  },
  methods: {
    help () {
      this.inventory.forEach(e => {
        this.$firebaseRefs.inventory.child(e['.key']).child('remainder').set(0)
      })

      console.log('You\'re welcome!')
    }
  }
}
</script>

<style scoped>

</style>