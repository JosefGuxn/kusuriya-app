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
                  placeholder="Nhấn Enter để tìm trong bảng..." expanded>
                </b-input>                
              </b-field>      
              <div class="tile is-child is-5">                
                <button class="button is-primary" @click="isAddMode = true">
                  <b-icon icon="plus"></b-icon>
                  <span>Thêm Sản Phẩm</span>
                </button>
                <button class="button is-primary"
                @click="test">
                  <b-icon icon="print"></b-icon>
                  <span>Print</span>
                </button>
              </div>
            </div>
          </div>          
          <div class="content">
            <b-table :data="products" per-page="10" pagination-simple bordered striped paginated detailed narrowed>
              <template slot="header" scope="props">
                <strong class="is-size-5">
                  {{props.column.label}}
                </strong>
              </template>
              <template scope="props">
                <b-table-column field="category" label="Danh Mục" width="200" sortable>
                   {{ props.row.category }}                 
                </b-table-column>

                <b-table-column field="product_name" label="Sản Phẩm" sortable>
                  <strong>
                    {{ props.row.product_name }}
                  </strong>
                </b-table-column>

                <b-table-column label="Số Lô" width="150" centered>
                  {{ props.row.stock_number }}
                </b-table-column>

                <b-table-column label="ĐV Sỉ" width="110" centered>
                  {{ props.row.uom_wsale }}
                </b-table-column>

                <b-table-column label="ĐV Lẻ" width="110" centered>
                  {{ props.row.uom_retail }}
                </b-table-column>

                <b-table-column label="Đv Bán Sỉ/Đv Bán Lẻ" width="160" centered>
                  {{ props.row.uom_rate }}
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

              <template slot="empty">
                <section class="section">
                  <div class="content has-text-grey has-text-centered">
                    <p>
                      <b-icon icon="sentiment_very_dissatisfied" size="is-large">
                      </b-icon>
                    </p>
                    <p>Không có dữ liệu.</p>
                  </div>
                </section>
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
                    </div>
                  </div>
                </article>
              </template>
            </b-table>
          </div>
        </b-panel>
      </div>
      <div v-if="isAddMode" class="column is-4">
        <b-panel has-custom-template>
          <div class="tile is-size-3" slot="header">
            <strong class="tile is-child">
              Cập nhật Sản phẩm
            </strong>
            <div class="tile is-child is-1 has-text-right">
              <button class="button" @click="isAddMode = false">
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
              <strong>Số lô</strong>
              <b-input v-model="stockNumber"></b-input>
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
              <b-input v-model="uomRate" type="number" value="1"></b-input>
            </div>
          </div>
          <div class="panel-block">
            <b-field grouped>
              <div class="control">
                <button class="button is-success is-fullwidth" @click="addProductAndClose">Thêm</button>
              </div>
              <div class="control">
                <button class="button is-info is-fullwidth"
                @click="addProductAndReset">Thêm & Làm mới</button>
              </div>          
            </b-field>
          </div>
        </b-panel>
      </div>
    </div>
    <b-modal :active.sync="isModalActive" has-modal-card>
      <modal-form v-bind="formProps" v-model="modalValue"></modal-form>
    </b-modal>
  </section>
</template>

<script>
import ModalForm from '@/components/Modal/ModalForm'
import { mapGetters } from 'vuex'
import {db} from '@/firebase'

export default {
  components: {
    ModalForm
  },
  data () {
    return {
      formatter: (date) => date.toLocaleDateString('vi-VN'),
      isAddMode: false,
      isSearchMode: false,
      category: null,
      productName: '',
      chemical: null,
      dClass: null,
      stockNumber: null,
      uomWSale: null,
      uomRetail: null,
      uomRate: 0,
      isModalActive: false,
      formProps: {
        info: '',
        action: ''
      },
      modalValue: '',
      chemicalValue: '',
      inputProductNameType: ''
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
    ...mapGetters({
      tableData: 'productsArrGetter'
    }),
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
    newProductValadate () {
      if (this.productName === '') {
        return false
      }
      return true
    },
    addProduct () {
      var newProduct = {
        category: this.category || this.categories[0].value,
        product_name: this.productName.charAt(0).toUpperCase() + this.productName.slice(1),
        chemical: this.chemical ? this.chemical.value : '',
        class: this.dClass || this.classes[13],
        stock_number: this.stockNumber || '',
        uom_wsale: this.uomWSale || this.uoms[0].value,
        uom_retail: this.uomRetail || this.uoms[0].value,
        uom_rate: this.uomRate,
        last_update: Date.now()
      }
      this.$firebaseRefs.products.push(newProduct).then(() => {
        this.$store.dispatch('pushNotif', { type: 'is-success', message: 'Cập nhật Sản phẩm thành công.' })
      }).catch(error => {
        this.$store.dispatch('pushNotif', { type: 'is-danger', message: 'Cập nhật thất bại!' })
        console.log(error)
      })
    },
    resetForm () {
      // this.category = null
      this.productName = ''
      this.chemical = null
      this.dClass = null
      this.stockNumber = null
      this.uomWSale = null
      this.uomRetail = null
      this.uomRate = 0
      this.inputProductNameType = ''
    },
    addProductAndClose () {
      if (!this.newProductValadate()) {
        return null
      }

      this.addProduct()
      this.resetForm()
      this.isAddMode = false
    },
    addProductAndReset () {
      if (!this.newProductValadate()) {
        return null
      }

      this.addProduct()
      this.resetForm()
      this.$refs.inputProductName.focus()
      window.scrollTo(0, 0)
    },
    addCategory () {
      this.formProps.info = 'Danh mục'
      this.formProps.action = 'addCategory'
      this.isModalActive = true
    },
    addChemical () {
      this.formProps.info = 'Hoạt chất'
      this.formProps.action = 'addChemical'
      this.isModalActive = true
    },
    addClass () {
      this.formProps.info = 'Nhóm dược'
      this.formProps.action = 'addClass'
      this.isModalActive = true
    },
    addUom () {
      this.formProps.info = 'Đơn vị'
      this.formProps.action = 'addUom'
      this.isModalActive = true
    },
    confirmRemoveProduct (obj) {
      this.$dialog.confirm({
        title: 'Xóa Sản phẩm',
        message: `Bạn có chắc chắn muốn <b>xóa</b> sản phẩm ${obj.product_name} không?`,
        confirmText: 'Xóa Sản phẩm',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => this.removeProduct(obj)
      })
    },
    removeProduct (product) {
      this.$firebaseRefs.products.child(product['.key']).remove().then(() => {
        this.$store.dispatch('pushNotif', { type: 'is-success', message: 'Xóa Sản phẩm thành công.' })
      }).catch(error => {
        this.$store.dispatch('pushNotif', { type: 'is-danger', message: 'Cập nhật thất bại!' })
        console.log(error)
      })
    },
    test () {
      console.log(this.tableData[0].product_name)
    }
  }
}
</script>

<style scoped>

</style>