<template>
  <div id="app" class="container is-fullhd">
    <nav v-if="isLoggedIn" class="navbar has-shadow">
      <div class="container">
        <div class="navbar-brand">
          <router-link class="navbar-item" to="/dashboard" replace>
            KSRya
          </router-link>
        </div>
        <div class="navbar-menu">
          <div class="navbar-end">
            <div class="navbar-item">
              <b-field>
                <b-input placeholder="Tìm..." type="search" icon="search" style="width: 350px">
                </b-input>
              </b-field>
            </div>
            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link">
                <span class="icon">
                  <b-icon icon="th-large"></b-icon>
                </span>
                <span>Tác vụ</span>
              </a>
              <div class="navbar-dropdown ">
                <a class="navbar-item" href="/newimportsheet" target="_blank">
                  Nhập kho
                </a>
                <a class="navbar-item " href="/newexportsheet" target="_blank">
                  Xuất kho
                </a>
                <hr class="navbar-divider">
                <a class="navbar-item ">
                  Thống kê
                </a>
              </div>
            </div>
            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link">
                <span class="icon">
                  <b-icon icon="suitcase"></b-icon>
                </span>
                <span>Quản lý</span>
              </a>
              <div class="navbar-dropdown ">
                <router-link class="navbar-item" to='/inventory' replace>
                  Kho dược
                </router-link>
                <router-link class="navbar-item" to='/productslist' replace>
                  Sản phẩm
                </router-link>               
                 <router-link class="navbar-item" to='/importreport' replace>
                  Phiếu nhập
                </router-link>
                 <router-link class="navbar-item" to='/exportreport' replace>
                  Phiếu xuất
                </router-link>                
                <hr class="navbar-divider">
                <a class="navbar-item ">
                  Nhân viên
                </a>
              </div>
            </div>

            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link">
                <span class="icon">
                  <b-icon icon="user-o"></b-icon>
                </span>
                <span>User</span>
              </a>
              <div class="navbar-dropdown ">
                <a class="navbar-item">
                  Thông tin
                </a>
                <a class="navbar-item ">
                  Thiết lập
                </a>
                <hr class="navbar-divider">
                <router-link class="navbar-item " to="/dbhelper">
                  DO NOT PRESS!!
                </router-link>
                <hr class="navbar-divider">
                <a class="navbar-item " @click="logout">
                  <span class="icon">
                    <b-icon icon="sign-out"></b-icon>
                  </span>
                  <span>Đăng xuất</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <router-view style="margin-top: 80px"></router-view>
  </div>
</template>

<script>
  export default {
    name: 'ksrya',
    computed: {
      isLoggedIn () {
        return this.$store.getters.isLoggedIn
      }
    },
    methods: {
      logout () {
        this.$store.dispatch('logout')
        this.$router.replace('/login')
      }
    },
    mounted () {
      this.$store.watch(this.$store.getters.notifsGetter, () => {
        this.$toast.open(this.$store.getters.newNotifGetter)
      })
    }
  }
</script>

<style>
  .navbar { 
    position: fixed !important; 
    top: 0; 
    left: 0; 
    right: 0; 
    z-index: 10;
  }
  .panel-heading {
    background-color: hsl(0, 0%, 71%);
  }
  @media print {
    .navbar {
      display: none;
    }
  }
</style>

