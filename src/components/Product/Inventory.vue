<template>
  <b-panel has-custom-template>
    <div class="is-size-3" slot="header">
      <div class="tile">
        <strong class="tile is-child has-text-primary">
          Thông tin Kho thuốc
        </strong>
        <div class="tile is-child is-4 has-text-right is-narrow">
          <button class="button is-primary">
            <b-icon icon="print"></b-icon>
            <span>Print</span>
          </button>
        </div>
      </div>
    </div>
    <div class="content">
      <b-table :data="inventory" bordered striped>
        <template slot="header" scope="props">
          <strong class="is-size-6">
            {{props.column.label}}
          </strong>
        </template>
        <template scope="props">               
            <b-table-column label="Sản Phẩm">
              <p>{{props.row.product_name}}</p> 
            </b-table-column>

            <b-table-column label="Danh Mục" width="200">
              <p>{{props.row.category}}</p> 
            </b-table-column>

            <b-table-column label="Số Lô" width="100">
              <p>{{props.row.stock_number}}</p> 
            </b-table-column>

            <b-table-column label="Số Lượng" width="130">
              {{ props.row.quantity }}
            </b-table-column>

            <b-table-column label="Hạn Dùng" width="130">
              {{ moment(props.row.exp_date) }}
            </b-table-column>

            <b-table-column label="Giá Mua" width="120">
                {{ props.row.unit_price }}
            </b-table-column>
            
            <b-table-column label="Giá Bán Sỉ" width="130">
              {{ props.row.wsale_price }}
            </b-table-column>

            <b-table-column label="Giá Bán Lẻ" width="130">
              {{ props.row.retail_price }}
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
              <p>Chưa có dữ liệu.</p>
            </div>
          </section>
        </template>
      </b-table>
    </div>
  </b-panel>
</template>

<script>
  import { db } from '@/firebase'
  import moment from 'moment'
  export default {
    data () {
      return {
        formatter: (date) => date.toLocaleDateString('vi-VN')
      }
    },
    firebase: {
      inventory: db.ref('inventory')
    },
    computed: {
    },
    methods: {
      moment (time) {
        return moment(time).format('DD/MM/YYYY')
      }
    }
  }
</script>

<style scoped>

</style>