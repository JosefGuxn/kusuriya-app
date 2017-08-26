<template>
  <b-panel has-custom-template>
    <div class="is-size-3" slot="header">
      <div class="columns">
        <strong class="column is-10 has-text-primary">
          Thông tin Kho thuốc
        </strong>
        <div class="column is-narrow">
          <button class="button is-primary">
            <b-icon icon="print"></b-icon>
            <span>Print</span>
          </button>
        </div>
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
            <b-table-column label="Sản Phẩm">
              <p>{{props.row.item_name}}</p> 
            </b-table-column>

            <b-table-column label="Danh Mục" width="130">
              <p>{{props.row.item_name}}</p> 
            </b-table-column>

            <b-table-column label="Số Lô" width="100">
              <p>{{props.row.stock_number}}</p> 
            </b-table-column>

            <b-table-column label="Đơn Vị" width="110">
              <p>{{props.row.unit_of_ms}}</p> 
            </b-table-column>

            <b-table-column label="Số Lượng" width="130">
              <b-input type="number" v-model="props.row.quantity"></b-input>
            </b-table-column>

            <b-table-column label="Hạn Dùng" width="130">
              <b-datepicker v-model="props.row.exp_date" 
              :date-formatter="formatter"></b-datepicker>
            </b-table-column>

            <b-table-column label="Giá Mua" width="120">
                <b-input type="number" v-model="props.row.unit_price"></b-input>
            </b-table-column>
            
            <b-table-column label="Giá Bán Sỉ" width="130">
              <b-input type="number" v-model="props.row.wsale_price"></b-input>
            </b-table-column>

            <b-table-column label="Giá Bán Lẻ" width="130">
              <b-input type="number" v-model="props.row.retail_price"></b-input>
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
</template>

<script>
export default {
  data () {
    const tableData = [
      {
        item_name: 'Vifticol',
        stock_number: 'NT41',
        is_consigned: false,
        unit_of_ms: 'Lọ',
        quantity: '10',
        exp_date: new Date(),
        unit_price: '10000',
        wsale_price: '10000',
        retail_price: '11000'
      }
    ]
    return {
      tableData,
      formatter: (date) => date.toLocaleDateString('vi-VN')
    }
  }
}
</script>

<style scoped>

</style>