<template>
  <div class="container">
    <div class="columns">
      <div class="column is-half is-offset-one-quarter">
        <div class="notification">
          <b-field label="Người Dùng">
            <b-input value="johnsilver"></b-input>
          </b-field>

          <b-field label="Mật Khẩu">
            <b-input type="password"
                value="iwantmytreasure">
            </b-input>
          </b-field>
          <b-field class="is-grouped is-grouped-right">
            <div class="control">
              <router-link class="button is-primary" to="/dashboard">Đăng Nhập</router-link>
            </div> 
          </b-field>
        </div>
      </div>
    </div>
  </div>
</template>
