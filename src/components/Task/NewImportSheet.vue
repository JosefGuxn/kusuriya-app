<template>
  <div class="container is-fluid">
    <b-panel has-custom-template>
      <div class="is-size-3 tile" slot="header">
        <strong class="tile is-child has-text-primary">
          Phiếu nhập kho
        </strong>
        <div class="tile is-child is-4 has-text-right">         
          <button class="button is-primary"
          @click="importSheet">
            <b-icon icon="floppy-o"></b-icon>
            <span>Lưu</span>
          </button>
          <button class="button is-primary"
          >
            <span>Lưu & Nhập mới</span>
          </button>
        </div>
      </div>
      <div class="panel-block">        
        <div class="container columns">
          <strong class="column is-3 has-text-right is-size-5">Nhà cung cấp</strong>
          <div class="column is-6">
            <b-field grouped>
              <div class="control is-expanded">
                <b-select placeholder="Chọn nhà cung cấp" 
                  v-model="supplier" expanded>
                  <option :value="suppliers"
                  v-for="supp in suppliers" :key="supp.key">
                    {{ supp.value }}
                  </option>
                </b-select>
              </div>
              <div class="control">
                <button class="button is-warning has-text-white" @click="addSupplier">
                  <b-icon icon="plus"></b-icon>
                </button>
              </div>
            </b-field>
          </div>
        </div>
      </div>
      <div class="panel-block">        
        <div class="container columns">
          <strong class="column is-3 has-text-right is-size-5">Ngày lập</strong>
          <div class="column is-6">
            <b-field>
              <div class="control">
                <b-datepicker v-model="sheet_date" :date-formatter="formatter">
                </b-datepicker>
              </div>
            </b-field>
          </div>
        </div>
      </div>     
      <div class="panel-block">        
        <div class="container columns">
          <strong class="column is-3 has-text-right is-size-5">Ký gửi</strong>
          <div class="column is-6">
            <b-field>
              <div class="control is-expanded">
                <b-checkbox v-model="is_consigned"></b-checkbox>
              </div>
            </b-field>
          </div>
        </div>
      </div>
      <div class="panel-block">        
        <div class="container columns">
          <strong class="column is-3 has-text-right is-size-5">Ghi chú</strong>
          <div class="column is-6">
            <b-field>
              <div class="control">
                <b-input v-model="note" type="textarea"></b-input>
              </div>            
            </b-field>
          </div>
        </div>
      </div>
      <div class="content" style="margin-top: 20px">
        <b-table :data="entries" narrowed bordered>
          <template slot="header" scope="props">
            <strong class="is-size-5">
              {{props.column.label}}
            </strong>
          </template>
          <template scope="props">               
            <b-table-column label="Sản Phẩm">
              <b-select
                  v-model="props.row.product" expanded>
                <option :value="product"
                v-for="product in products" :key="product.key">
                  {{ product.product_name }}
                </option>
              </b-select>
            </b-table-column>

            <b-table-column label="Số Lô" width="110">
              <b-input v-model="props.row.stock_number"></b-input>  
            </b-table-column>

            <b-table-column label="Đơn Vị" width="110">
              <b-input v-model="props.row.unit_of_ms">{{props.row.product.uom_wsale}}</b-input>
            </b-table-column>

            <b-table-column label="Số Lượng" width="140">
              <b-input type="number" v-model="props.row.quantity"></b-input>
            </b-table-column>

            <b-table-column label="Hạn Dùng" width="140">
              <b-datepicker v-model="props.row.exp_date" 
              :date-formatter="formatter"></b-datepicker>
            </b-table-column>

            <b-table-column label="Giá Mua" width="120">
                <b-input type="number" v-model="props.row.unit_price"></b-input>
            </b-table-column>
            
            <b-table-column label="Giá Bán Sỉ" width="140">
              <b-input type="number" v-model="props.row.wsale_price"></b-input>
            </b-table-column>

            <b-table-column label="Giá Bán Lẻ" width="140">
              <b-input type="number" v-model="props.row.retail_price"></b-input>
            </b-table-column>

            <b-table-column width="50">
              <button class="button is-danger" @click="deleteRow(props.row)">
                <b-icon icon="trash-o"></b-icon>
              </button>
            </b-table-column>
          </template>
          <template slot="empty">
            <section class="section">
              <div class="content has-text-grey has-text-centered">                  
                <i>Nhấn thêm dữ liệu để tạo dòng mới.</i>
              </div>
            </section>
          </template>
        </b-table>
      </div>
      <div class="panel-block">
        <button class="button is-success is-fullwidth" @click="addRow">
          <b-icon icon="plus"></b-icon>
          <span>Thêm dữ liệu</span>
        </button>
      </div>
    </b-panel>
    <b-modal :active.sync="isModalActive" has-modal-card>
      <modal-form v-bind="formProps"></modal-form>
    </b-modal>
  </div>
</template>

<script>
  import ModalForm from '@/components/Modal/ModalForm'
  import { mapGetters } from 'vuex'
  import _ from 'lodash'
  export default {
    components: {
      ModalForm
    },
    data () {
      return {
        entries: [],
        editable: false,
        formatter: (date) => date.toLocaleDateString('vi-VN'),
        formProps: {
          info: '',
          action: ''
        },
        isModalActive: false,
        supplier: null,
        sheet_date: new Date(),
        is_consigned: false,
        note: null
      }
    },
    computed: {
      ...mapGetters({
        products: 'productsArrGetter',
        categories: 'categoriesArrGetter',
        chemicals: 'chemicalsArrGetter',
        classes: 'classesArrGetter',
        uoms: 'uomsArrGetter',
        suppliers: 'suppliersArrGetter'
      })
    },
    methods: {
      addRow (obj) {
        this.entries.push(
          {
            id: _.random(1111, 9999),
            product: {},
            stock_number: '',
            unit_of_ms: '',
            quantity: 0,
            exp_date: new Date(),
            unit_price: '',
            wsale_price: '',
            retail_price: ''
          }
        )
      },
      deleteRow (obj) {
        this.tableData = this.tableData.filter(o => o.id !== obj.id)
      },
      newSheetValidate () {
        //
        return {
          supplier: this.supplier,
          date: this.sheet_date,
          is_consigned: this.is_consigned,
          note: this.note,
          entries: this.entries
        }
      },
      importSheet () {
        var newSheet = this.newSheetValidate()
        if (newSheet) {
          this.$store.dispatch('addImportSheet', newSheet)
          this.$store.dispatch('importInventory', this.entries)
        }
      },
      addSupplier () {
        this.formProps.info = 'Nhà cung cấp'
        this.formProps.action = 'addSupplier'
        this.isModalActive = true
      }
    }
  }
</script>

<style scoped>

</style>