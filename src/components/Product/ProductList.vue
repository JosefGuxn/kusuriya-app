<template>
  <section>
    <div class="columns">
      <div class="column">
        <b-panel has-custom-template>
          <div class="is-size-3 tile is-ancestor" slot="header">
            <strong class="tile is-parent is-5 has-text-primary">
              Thông tin Sản phẩm
            </strong>
            <div class="tile is-parent has-text-right">
              <b-field class="tile is-child">
                <b-input v-model="searchText"
                  placeholder="Enter để tìm theo Tên và Hoạt chất..." expanded
                  @keydown.enter.native="searchData">
                </b-input>     
                <button class="button" @click="clearSearch">
                  <b-icon icon="close">                      
                  </b-icon>
                </button>           
              </b-field>      
              <div class="tile is-child is-5">                
                <button class="button is-primary" 
                  @click="isAddMode = true, isEditMode = false, resetForm()">
                  <b-icon icon="plus"></b-icon>
                  <span>Thêm Sản Phẩm</span>
                </button>
              </div>
            </div>
          </div>          
          <div class="content">
            <b-table :data="dataTable" per-page="10" pagination-simple striped paginated detailed narrowed :loading="dataTable.length === 0" >
              <template slot="header" scope="props">              
                <b-tooltip position="is-bottom" type="is-dark" :active="!!props.column.meta" :label="props.column.meta" dashed>
                  {{ props.column.label }}
                </b-tooltip>
              </template>
              <template scope="props">
                <b-table-column field="category" label="Danh Mục" width="200" sortable>
                   {{ props.row.category }}                 
                </b-table-column>

                <b-table-column field="name" label="Sản Phẩm" sortable>
                  <strong>
                    {{ props.row.name }}
                  </strong>
                </b-table-column>

                <b-table-column meta="Đơn Vị Bán Sỉ"  label="ĐvBS" width="150" centered>
                  {{ props.row.wsale_unit }}
                </b-table-column>

                <b-table-column meta="Đơn Vị Bán Lẻ"  label="ĐvBL" width="150" centered>
                  {{ props.row.retail_unit }}
                </b-table-column>

                <b-table-column meta="Tỉ Lệ Đv Bán Sỉ/Đv Bán Lẻ"  label="ĐvBS/ĐvBL" width="140" centered>
                  {{ props.row.unit_ratio }}
                </b-table-column>

                <b-table-column width="100">
                  <div class="tile">
                    <div class="tile is-child">
                      <button class="button is-dark is-outlined" @click="editRow(props.row)">
                        <b-icon icon="pencil"></b-icon>
                      </button>
                    </div>
                    <div class="tile is-child">
                      <button class="button is-danger is-outlined" @click="confirmRemoveProduct(props.row)">
                        <b-icon icon="trash-o"></b-icon>
                      </button>
                    </div>
                  </div>
                </b-table-column>
              </template>             
              <template slot="detail" scope="props">
                <article class="media">
                  <div class="media-content">
                    <div class="content">
                      <p>
                        <strong>Nhóm dược</strong>
                        <br>                      
                        {{ props.row.class }}   
                      </p>              
                      <p>
                        <strong>Hoạt chất</strong>
                        <br>                      
                        {{ props.row.chemical }}   
                      </p>
                      <p>                     
                        <small>{{ props.row['.key'] }} </small>  
                      </p>
                    </div>
                  </div>
                </article>
              </template>
            </b-table>
          </div>
        </b-panel>
      </div>
      <div v-if="isAddMode || isEditMode" class="column is-4">
        <b-panel has-custom-template>
          <div class="tile is-size-3" slot="header">
            <strong v-if="isAddMode" class="tile is-child">
              Thêm Sản phẩm
            </strong>
            <strong v-if="isEditMode" class="tile is-child">
              Sửa Sản phẩm
            </strong>
            <div class="tile is-child is-1 has-text-right">
              <button class="button" @click="isAddMode = false, isEditMode = false">
                <b-icon icon="times"></b-icon>
              </button>
            </div>
          </div>
          <div class="panel-block tile is-vertical">
            <div class="tile is-child">
              <strong>Danh mục</strong>
              <b-field grouped>
                <b-select placeholder="Chọn danh mục" v-model="category" expanded>
                  <option :value="category.value"
                  v-for="category in categories" :key="category.key">
                    {{ category.value }}
                  </option>
                </b-select>
                <button class="button" @click="addCategory">
                  <b-icon icon="plus"></b-icon>
                </button>
              </b-field>
            </div>
            <div class="tile is-child">
              <strong>Tên sản phẩm</strong>
              <b-field :type="productName === '' ? 'is-danger':''">
                <b-input ref="inputProductName" v-model="productName">
                </b-input>
              </b-field>
            </div>
            <div class="tile is-child">
              <strong>Hoạt chất</strong>
              <b-field grouped>
                <b-autocomplete v-model="chemicalValue"
                :data="filteredChemicals" 
                @select="o => chemical = o"
                expanded keep-first>
                </b-autocomplete>
                <button class="button" @click="addChemical">
                  <b-icon icon="plus"></b-icon>
                </button>
              </b-field>
            </div>
            <div class="tile is-child">
              <strong>Nhóm dược</strong>
              <b-field grouped>
                <b-select placeholder="Chọn nhóm dược" v-model="dClass" expanded>
                  <option :value="dclass.value"
                  v-for="dclass in classes" :key="dclass.key">
                    {{ dclass.value }}
                  </option>
                </b-select>
                <button class="button" @click="addClass">
                  <b-icon icon="plus"></b-icon>
                </button>
              </b-field>
            </div>
            <div class="tile is-child">
              <strong>Đơn vị bán Sỉ</strong>
              <b-field grouped>
                <b-select placeholder="Chọn đơn vị" v-model="uomWSale" expanded>
                  <option :value="u.value"
                  v-for="u in uoms" :key="u.key">
                    {{ u.value }}
                  </option>
                </b-select>
                <button class="button" @click="addUom">
                  <b-icon icon="plus"></b-icon>
                </button>
              </b-field>
            </div>
            <div class="tile is-child">
              <strong>Đơn vị bán Lẻ</strong>
              <b-field grouped>
                <b-select placeholder="Chọn đơn vị" v-model="uomRetail" expanded>
                  <option :value="u.value"
                  v-for="u in uoms" :key="u.key">
                    {{ u.value }}
                  </option>
                </b-select>
              </b-field>
            </div>
            <div class="tile is-child">
              <strong>Tỉ lệ Đv bán Sỉ/Đv bán Lẻ</strong>
              <b-input v-model="unitRatio" type="number"></b-input>
            </div>
          </div>
          <div class="panel-block">
            <b-field v-if="isAddMode" grouped>
              <div class="control">
                <button class="button is-success is-fullwidth" @click="addProduct">Cập nhật</button>
              </div>        
            </b-field>
            <b-field v-if="isEditMode">
              <div class="control">
                <button class="button is-dark" @click="editProduct">Cập nhật</button>
              </div>                  
            </b-field>
          </div>
        </b-panel>
      </div>
    </div>
  </section>
</template>

<script>
import {db} from '@/firebase'
import _ from 'lodash'

export default {
  data () {
    return {
      isAddMode: false,
      isEditMode: false,
      category: null,
      productName: '',
      chemical: null,
      dClass: null,
      uomWSale: null,
      uomRetail: null,
      unitRatio: 1,
      chemicalValue: '',
      searchText: '',
      dataTable: [],
      current: null
    }
  },
  firebase: {
    products: db.ref('products'),
    categories: db.ref('categories'),
    classes: db.ref('classes'),
    chemicals: db.ref('chemicals'),
    uoms: db.ref('uoms')
  },
  computed: {
    filteredChemicals () {
      return this.chemicals.filter((option) => {
        return option.value
          .toString()
          .toLowerCase()
          .indexOf(this.chemicalValue.toLowerCase()) >= 0
      })
    }
  },
  methods: {
    newProductValidate () {
      if (this.productName === '') {
        return false
      }
      return true
    },
    addProduct () {
      if (!this.newProductValidate()) {
        return null
      }
      var newProduct = {
        category: this.category || this.categories[0].value,
        name: this.productName.charAt(0).toUpperCase() + this.productName.slice(1),
        chemical: this.chemical ? this.chemical.value : '',
        class: this.dClass || this.classes[13],
        wsale_unit: this.uomWSale || this.uoms[0].value,
        retail_unit: this.uomRetail || this.uoms[0].value,
        unit_ratio: this.unitRatio,
        last_update: Date.now()
      }
      this.$firebaseRefs.products.push(newProduct).then(() => {
        this.$store.dispatch('pushNotif', { type: 'is-success', message: 'Cập nhật Sản phẩm thành công.' })
        this.resetForm()
        this.$refs.inputProductName.focus()
        window.scrollTo(0, 0)
      }).catch(error => {
        this.$store.dispatch('pushNotif', { type: 'is-danger', message: 'Cập nhật thất bại!' })
        console.log(error)
      })
    },
    resetForm () {
      this.productName = ''
      this.chemical = null
      this.chemicalValue = ''
      this.dClass = null
      this.uomWSale = null
      this.uomRetail = null
      this.unitRatio = 1
    },
    addCategory () {
      this.$dialog.prompt({
        title: `Danh Mục Mới`,
        confirmText: 'OK',
        onConfirm: (value) => this.$firebaseRefs.categories.push({
          value: value,
          last_update: Date.now()
        }).then(() => {
          this.$store.dispatch('pushNotif', { type: 'is-success', message: 'Cập nhật Danh mục thành công.' })
        }).catch(error => {
          this.$store.dispatch('pushNotif', { type: 'is-danger', message: 'Cập nhật thất bại!' })
          console.log(error)
        })
      })
    },
    addChemical () {
      this.$dialog.prompt({
        title: `Hoạt Chất Mới`,
        confirmText: 'OK',
        onConfirm: (value) => this.$firebaseRefs.chemicals.push({
          value: value,
          last_update: Date.now()
        }).then(() => {
          this.$store.dispatch('pushNotif', { type: 'is-success', message: 'Cập nhật Hoạt chất thành công.' })
        }).catch(error => {
          this.$store.dispatch('pushNotif', { type: 'is-danger', message: 'Cập nhật thất bại!' })
          console.log(error)
        })
      })
    },
    addClass () {
      this.$dialog.prompt({
        title: `Nhóm Dược Mới`,
        confirmText: 'OK',
        onConfirm: (value) => this.$firebaseRefs.classes.push({
          value: value.toUpperCase(),
          last_update: Date.now()
        }).then(() => {
          this.$store.dispatch('pushNotif', { type: 'is-success', message: 'Cập nhật Nhóm dược thành công.' })
        }).catch(error => {
          this.$store.dispatch('pushNotif', { type: 'is-danger', message: 'Cập nhật thất bại!' })
          console.log(error)
        })
      })
    },
    addUom () {
      this.$dialog.prompt({
        title: `Đơn Vị Tính Mới`,
        confirmText: 'OK',
        onConfirm: (value) => this.$firebaseRefs.uoms.push({
          value: value.toUpperCase(),
          last_update: Date.now()
        }).then(() => {
          this.$store.dispatch('pushNotif', { type: 'is-success', message: `Thêm Đơn vị ${value.toUpperCase()} thành công.` })
        }).catch(error => {
          this.$store.dispatch('pushNotif', { type: 'is-danger', message: 'Cập nhật thất bại!' })
          console.log(error)
        })
      })
    },
    confirmRemoveProduct (obj) {
      this.$dialog.confirm({
        title: 'Xóa Sản phẩm',
        message: `Xác nhận <b>XÓA</b> sản phẩm ${obj.name}?`,
        confirmText: 'Xóa Sản phẩm',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => this.removeProduct(obj)
      })
    },
    removeProduct (product) {
      this.$firebaseRefs.products.child(product['.key']).remove().then(() => {
        this.$store.dispatch('pushNotif', { type: 'is-success', message: `Xóa Sản phẩm ${product.name} thành công.` })
        this.dataTable = this.products
      }).catch(error => {
        this.$store.dispatch('pushNotif', { type: 'is-danger', message: 'Cập nhật thất bại!' })
        console.log(error)
      })
    },
    searchData () {
      this.dataTable = this.products.filter((option) => {
        return (option.name
          .toString()
          .toLowerCase()
          .indexOf(this.searchText.toLowerCase()) >= 0)
      })
    },
    clearSearch () {
      this.searchText = ''
      this.dataTable = this.products
    },
    editRow (obj) {
      this.isAddMode = false
      this.isEditMode = true
      this.resetForm()
      this.category = obj.category
      this.productName = obj.name
      this.chemicalValue = obj.chemical
      this.chemical = _.find(this.chemicals, { value: obj.chemical })
      this.dClass = obj.class
      this.uomWSale = obj.wsale_unit
      this.uomRetail = obj.retail_unit
      this.unitRatio = obj.unit_ratio
      this.current = obj
    },
    editProduct () {
      if (this.current) {
        var update = {
          category: this.category || this.categories[0].value,
          name: this.productName.charAt(0).toUpperCase() + this.productName.slice(1),
          chemical: this.chemical ? this.chemical.value : '',
          class: this.dClass || this.classes[13],
          wsale_unit: this.uomWSale || this.uoms[0].value,
          retail_unit: this.uomRetail || this.uoms[0].value,
          unit_ratio: this.unitRatio
        }
        db.ref('inventory').child(this.current['.key']).once('value').then((snapshot) => {
          if (snapshot.exists()) {
            db.ref('inventory').child(this.current['.key']).child('product').set(update)
          }
        })
        this.$firebaseRefs.products
          .child(this.current['.key']).set(update).then(() => {
            this.$store.dispatch('pushNotif', { type: 'is-success', message: `Cập nhật Sản phẩm ${update.name} thành công.` })
            this.isEditMode = false
            this.resetForm()
            this.dataTable = this.products
          }).catch(error => {
            this.$store.dispatch('pushNotif', { type: 'is-danger', message: 'Cập nhật thất bại!' })
            console.log(error)
          })
      }
    }
  },
  created () {
    if (!this.$store.getters.isLoggedIn) {
      return this.$router.replace('/login')
    }
    this.dataTable = this.products
  }
}
</script>

<style scoped>
  .b-table {
    margin-right: 5px;
    margin-left: 5px;
  }
  .panel {
    border: 1px solid black;
  }
  .tile.is-vertical > .tile.is-child:not(:last-child) {
    margin-bottom: 0rem !important;
  }
</style>