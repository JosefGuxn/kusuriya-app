<template>
  <div class="container is-fluid">
    <b-panel has-custom-template>
      <div class="is-size-3" slot="header">
        <div class="columns">
          <strong class="column is-9 has-text-primary">
            Phiếu nhập
          </strong>
          <div class="column is-narrow">
            <button class="button is-primary">Lưu</button>   
            <button class="button is-primary">Lưu & Tạo phiếu mới</button>
          </div>
        </div>
      </div>
      <div class="panel-block">        
        <div class="container columns">
          <strong class="column is-3 has-text-right is-size-5">Nhà cung ứng</strong>
          <div class="column is-6">
            <b-field grouped>
              <div class="control is-expanded">
                <b-input value="NT41" ></b-input>
              </div>
              <div class="control">
                <button class="button is-warning has-text-white">
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
                <b-datepicker v-model="date" :date-formatter="formatter">
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
                <b-input value="NT41" type="textarea"></b-input>
              </div>            
            </b-field>
          </div>
        </div>
      </div>
      <div class="content" style="margin-top: 20px">
        <b-table :data="tableData" narrowed bordered>
          <template slot="header" scope="props">
            <strong class="is-size-5">
              {{props.column.label}}
            </strong>
          </template>
          <template scope="props">               
            <b-table-column label="Sản Phẩm">
              <b-input v-model="props.row.item_name"></b-input>  
            </b-table-column>

            <b-table-column label="Số Lô" width="110">
              <b-input v-model="props.row.stock_number"></b-input>  
            </b-table-column>

            <b-table-column label="Đơn Vị" width="110">
              <b-input v-model="props.row.unit_of_ms"></b-input>
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
  </div>
</template>

<script>
  import _ from 'lodash'
  export default {
    data () {
      var tableData = [
      ]
      return {
        tableData,
        editable: false,
        date: new Date(),
        formatter: (date) => date.toLocaleDateString('vi-VN')
      }
    },
    methods: {
      addRow (obj) {
        this.tableData.push(
          {
            id: _.random(1111, 9999),
            item_name: 'Vifticol',
            stock_number: 'NT41',
            unit_of_ms: 'Lọ',
            quantity: '10',
            exp_date: new Date(),
            unit_price: '10000',
            wsale_price: '10000',
            retail_price: '11000'
          }
        )
      },
      deleteRow (obj) {
        this.tableData = this.tableData.filter(o => o.id !== obj.id)
      }
    }
  }
</script>

<style scoped>

</style>