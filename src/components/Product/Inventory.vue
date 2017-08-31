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
      <b-table :data="inventory" bordered striped detailed narrowed
        default-sort="category" default-sort-direction="asc">
        <template slot="header" scope="props">
          <strong class="is-size-6">
            {{ props.column.label }}
          </strong>
        </template>
        <template scope="props">
          <b-table-column field="category" label="Danh Mục" width="140" sortable>
            <p>{{ props.row.category }}</p>
          </b-table-column>

          <b-table-column label="Sản Phẩm">
            <strong class="is-size-5">{{ props.row.product_name }}</strong>
          </b-table-column>

          <b-table-column label="Số Lô" width="100">
            <p>{{ props.row.stock_number }}</p>
          </b-table-column>

          <b-table-column label="Số Lượng" width="130" centered>
            <strong class="tag is-info is-size-6">
              {{ toNumber(props.row.quantity) }}
            </strong>
          </b-table-column>

          <b-table-column label="Hạn Dùng" width="130" centered>
            <strong class="tag is-success is-size-6">
              {{ moment(props.row.exp_date) }}
            </strong>
          </b-table-column>

          <b-table-column label="Giá Bán Sỉ" width="130" centered>
            <strong class="tag is-dark is-size-6">
              {{ toCurrency(props.row.wsale_price) }}
            </strong>
          </b-table-column>

          <b-table-column label="Giá Bán Lẻ" width="130" centered>
            <strong class="tag is-dark is-size-6">
              {{ toCurrency(props.row.retail_price) }}
            </strong>
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
                  <strong>Giá mua</strong>
                  <br>                      
                  {{ toCurrency(props.row.unit_price) }}   
                </p>
              </div>
            </div>
          </article>
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
      },
      toCurrency (number) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number)
      },
      toNumber (number) {
        return new Intl.NumberFormat('vi-VN').format(number)
      }
    }
  }
</script>

<style scoped>

</style>