<template>
  <div class="container">
    <div class="columns">
      <div class="column is-half is-offset-one-quarter">
        <div class="notification">
          <b-field :type="idType" label="Người Dùng">
            <b-input v-model="id"></b-input>
          </b-field>

          <b-field :type="pwdType" label="Mật Khẩu">
            <b-input type="password"
                v-model="pwd">
            </b-input>
          </b-field>
          <b-field class="is-grouped is-grouped-right">
            <div class="control">
              <button class="button is-primary" @click="login">Đăng Nhập</button>
            </div> 
          </b-field>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      id: 'admin',
      pwd: 'admin',
      idType: '',
      pwdType: ''
    }
  },
  methods: {
    login () {
      this.$store.dispatch('login', {id: this.id, pwd: this.pwd}).then(() => {
        this.$router.replace('/dashboard')
      }).catch((err) => {
        if (err.isIdFailed) {
          this.idType = 'is-danger'
        } else {
          this.pwdType = 'is-danger'
        }
      })
    }
  },
  created () {
    if (this.$store.getters.isLoggedIn) {
      this.$router.replace('/dashboard')
    }
  }
}
</script>

