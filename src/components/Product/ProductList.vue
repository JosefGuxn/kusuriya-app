<template>
  <section>
    <div class="columns">
      <div class="column">
        <b-panel has-custom-template>
          <div class="is-size-3 tile" slot="header">
            <strong class="tile is-child has-text-primary">
              Thông tin Sản phẩm
            </strong>
            <div class="tile is-child is-4 has-text-right">
              <button class="button is-primary" @click="isAddMode = true">
                <b-icon icon="plus"></b-icon>
                <span>Thêm Sản Phẩm</span>
              </button>
              <button class="button is-primary">
                <b-icon icon="print"></b-icon>
                <span>Print</span>
              </button>
            </div>
          </div>
          <div class="content">
            <b-table :data="tableData" bordered striped>
              <template slot="header" scope="props">
                <strong class="is-size-6">
                  {{props.column.label}}
                </strong>
              </template>
              <template scope="props">
                <b-table-column label="Danh Mục" width="160">
                  <b-input v-model="props.row.category"></b-input>
                </b-table-column>

                <b-table-column label="Sản Phẩm">
                  <b-input v-model="props.row.product_name"></b-input>
                </b-table-column>

                <b-table-column label="Hoạt Chất" width="130">
                  <b-input v-model="props.row.chemical"></b-input>
                </b-table-column>

                <b-table-column label="Nhóm Dược" width="180">
                  <b-input v-model="props.row.class"></b-input>
                </b-table-column>

                <b-table-column label="Số Lô" width="120">
                  <b-input v-model="props.row.stock_number"></b-input>
                </b-table-column>

                <b-table-column label="ĐVT Sỉ" width="100">
                  <b-input v-model="props.row.uom_wsale"></b-input>
                </b-table-column>

                <b-table-column label="ĐVT Lẻ" width="110">
                  <b-input v-model="props.row.uom_retail"></b-input>
                </b-table-column>

                <b-table-column label="Đv Bán Sỉ/Đv Bán Lẻ" width="140">
                  <b-input type="number" v-model="props.row.uom_rate"></b-input>
                </b-table-column>

                <b-table-column width="100">
                  <div class="tile">
                    <div class="tile is-child">
                      <button class="button is-dark is-outlined" @click="editRow(props.row)">
                        <b-icon icon="pencil"></b-icon>
                      </button>
                    </div>
                    <div class="tile is-child">
                      <button class="button is-danger is-outlined" @click="deleteRow(props.row)">
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
                    <p>Nothing here.</p>
                  </div>
                </section>
              </template>
            </b-table>
          </div>
        </b-panel>
      </div>
      <div v-if="isAddMode" class="column is-4">
        <b-panel has-custom-template>
          <div class="tile is-size-3" slot="header">
            <strong class="tile is-child">
              Thêm Sản phẩm
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
                  <option :value="category"
                  v-for="category in categories" :key="category.key">
                    {{ category.value }}
                  </option>
                </b-select>
                <button class="button" @click="addCategory">
                  <b-icon icon="plus"></b-icon>
                </button>
              </b-field>
            </div>
            <div class="tile is-child productName">
              <strong>Tên sản phẩm</strong>
              <b-input ref="inputProductName" v-model="productName"></b-input>
            </div>
            <div class="tile is-child">
              <strong>Hoạt chất</strong>
              <b-field grouped>
                <b-autocomplete
                :data="chemicals" 
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
                  <option :value="dclass"
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
              <strong>Số Lô</strong>
              <b-input v-model="stockNumber"></b-input>
            </div>
            <div class="tile is-child">
              <strong>Đơn vị bán Sỉ</strong>
              <b-field grouped>
                <b-select placeholder="Chọn đơn vị" v-model="uomWSale" expanded>
                  <option :value="u"
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
                  <option :value="u"
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

export default {
  components: {
    ModalForm
  },
  data () {
    const tableData = [
      {
        category: 'tmp',
        product_name: 'Vifticol',
        chemical: '',
        class: '',
        stock_number: 'NT41',
        uom_wsale: 'Lọ',
        uom_retail: 'Lọ',
        uom_rate: '10'
      }
    ]
    return {
      tableData,
      formatter: (date) => date.toLocaleDateString('vi-VN'),
      isAddMode: true,
      category: null,
      productName: '',
      chemical: null,
      dClass: null,
      stockNumber: '',
      uomWSale: null,
      uomRetail: null,
      uomRate: 0,
      isModalActive: false,
      formProps: {
        info: '',
        action: ''
      },
      modalValue: ''
    }
  },
  computed: {
    ...mapGetters({
      categories: 'categoriesArrGetter',
      chemicals: 'chemicalsArrGetter',
      classes: 'classesArrGetter',
      uoms: 'uomsArrGetter'
    })
  },
  methods: {
    addProduct () {
      var newProduct = {
        category: this.category,
        product_name: this.productName,
        chemical: this.chemical,
        class: this.dClass,
        stock_number: this.stockNumber,
        uom_wsale: this.uomWSale,
        uom_retail: this.uomRetail,
        uom_rate: this.uomRate
      }
      this.$store.dispatch('addProduct', newProduct)
    },
    addProductAndClose () {
      this.addProduct
      this.isAddMode = false
    },
    resetForm () {
      // this.category = null
      this.productName = null
      this.chemical = null
      this.dClass = null
      this.stockNumber = null
      this.uomWSale = null
      this.uomRetail = null
      this.uomRate = 0
    },
    addProductAndReset () {
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
    }
  }
}
</script>

<style scoped>

</style>