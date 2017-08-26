<template>
  <form>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Nhập tên {{info}} mới</p>
      </header>
      <section class="modal-card-body">
        <b-input expanded type="text" v-model="value" required autofocus>
        </b-input>   
      </section>
      <footer class="modal-card-foot">
        <button class="button is-primary" @click.prevent="submit">OK</button>
        <button class="button" type="button" @click="$parent.close()">Cancel</button>       
      </footer>
    </div>
  </form>
</template>

<script>
export default {
  props: ['info', 'action'],
  data () {
    return {
      value: null
    }
  },
  methods: {
    submit () {
      this.$store.dispatch(this.action, {
        value: this.value.charAt(0).toUpperCase() + this.value.slice(1)
      })
      this.$parent.close()
    }
  }
}
</script>

<style scoped>
.modal-card {
  width: 400px;
  z-index: 20;
}
</style>