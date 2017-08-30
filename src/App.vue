<template>
  <div id="app" class="container is-fullhd">
    <nav class="navbar has-shadow">
      <div class="container">
        <div class="navbar-brand">
        <router-link class="navbar-item" to="/dashboard">
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
              <router-link class="navbar-item" to="/newimportsheet">
                Nhập kho
              </router-link>
              <a class="navbar-item ">
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
              <router-link class="navbar-item" to='/drugsmanage'>
                Kho dược
              </router-link>             
              <router-link class="navbar-item" to='/productslist'>
                Sản phẩm
              </router-link>  
              <a class="navbar-item ">
                Danh mục
              </a>
              <a class="navbar-item ">
                Nhà cung ứng
              </a>
              <a class="navbar-item ">
                Nhân viên
              </a>
              <a class="navbar-item ">
                Hóa đơn
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
                HELP!!
              </router-link>
              <hr class="navbar-divider">
              <a class="navbar-item ">
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
    <div class="container is-fluid">
      <router-view style="margin-top: 80px"></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ksrya',
    mounted () {
      this.$store.watch(this.$store.getters.notifsGetter, () => {
        this.$toast.open(this.$store.getters.newNotifGetter)
      })
    }
  }
</script>

<style scoped>
  .navbar { 
    position: fixed !important; 
    top: 0; 
    left: 0; 
    right: 0; 
    z-index: 10;
  }
</style>

