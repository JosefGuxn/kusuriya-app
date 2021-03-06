<template>
  <section>
    <div class="columns">
      <div class="column">
        <b-panel has-custom-template>
          <div class="is-size-3 tile is-ancestor" slot="header">
            <strong class="tile is-parent is-4 has-text-primary">
              Thông tin Phiếu Xuất
            </strong>
            <b-field class="tile is-parent">
              <div class="control">
                <DatePicker v-model="date" type="date" size="large" format="dd/MM/yyyy"></DatePicker>
              </div>   
              <button class="button" @click="searchData">
                <b-icon icon="search">
                </b-icon>
              </button>           
            </b-field>
          </div>
          <div class="content">
            <b-table :data="dataTable" bordered striped detailed narrowed 
              per-page="10" pagination-simple paginated
              :loading="dataTable.length === 0"
              default-sort="date" default-sort-direction="desc">
              <template slot="header" scope="props">
                <strong class="is-size-6">
                  {{ props.column.label }}
                </strong>
              </template>
              <template scope="props">
                <b-table-column field="date" label="Ngày Xuất" sortable>
                  <p>{{ moment(props.row.date) }}</p>
                </b-table-column>              

                <b-table-column label="Số Sản Phẩm Xuất" width="200" centered>
                  <p>{{ props.row.entries ? Object.keys(props.row.entries).length : 0 }}</p>
                </b-table-column>               

                <b-table-column label="Tổng Tiền" centered>
                  <strong class="tag is-dark is-size-6">
                    {{ toCurrency(props.row.grand_total) }}
                  </strong>
                </b-table-column>

                <b-table-column width="100">
                  <div class="tile">
                    <div class="tile is-child">
                      <button class="button is-danger is-outlined" @click="confirmRemoveRow(props.row)">
                        <b-icon icon="trash-o"></b-icon>
                      </button>
                      <a class="button is-primary is-outlined" :href="'/exportprint/'+props.row['.key']" target="_blank">
                        <b-icon icon="print"></b-icon>
                      </a>                   
                    </div>
                  </div>
                </b-table-column>
              </template>

              <template slot="detail" scope="props">
                <article class="media">
                  <div class="media-content">
                    <b-table :data="Object.values(props.row.entries)" bordered striped narrowed>
                      <template scope="props">
                        <b-table-column label="Sản Phẩm">
                          <p>{{ props.row.product.name }}</p>
                        </b-table-column>
                        <b-table-column label="Số Lượng Xuất">
                          {{(props.row.qty_w ? + props.row.qty_w + ' ' + props.row.product.wsale_unit : '')
                              + ' ' 
                              + (props.row.qty_r ? + props.row.qty_r + ' ' + props.row.product.retail_unit : '')}}
                        </b-table-column>
                        <b-table-column label="Thành Tiền">
                          <p>{{ toCurrency(props.row.total) }}</p>
                        </b-table-column>
                      </template>
                    </b-table>
                  </div>
                </article>
              </template>
            </b-table>
          </div>
        </b-panel>
      </div>    
    </div>
  </section>
</template>

<script>
  import { db } from '@/firebase'
  export default {
    data () {
      return {
        date: 0,
        dataTable: []
      }
    },
    firebase: {
      exports: db.ref('exports')
    },
    computed: {
    },
    methods: {
      searchData () {
        this.dataTable = this.exports.filter((option) => {
          return (option.date >= this.date)
        })
      },
      confirmRemoveRow (obj) {
        this.$dialog.confirm({
          title: 'Xóa Dữ liệu',
          message: `Bạn có chắc chắn muốn <b>xóa</b> Dữ liệu không?`,
          confirmText: 'Xóa Dữ liệu',
          type: 'is-danger',
          hasIcon: true,
          onConfirm: () => this.removeProduct(obj)
        })
      },
      removeRow (product) {
        this.$firebaseRefs.exports.child(product['.key']).remove().then(() => {
          this.$store.dispatch('pushNotif', { type: 'is-success', message: 'Xóa Dữ liệu thành công.' })
          this.dataTable = this.exports
        }).catch(error => {
          this.$store.dispatch('pushNotif', { type: 'is-danger', message: 'Cập nhật thất bại!' })
          console.log(error)
        })
      }
    },
    created () {
      if (!this.$store.getters.isLoggedIn) {
        return this.$router.replace('/login')
      }
      this.dataTable = this.exports
    }
  }
</script>

<style scoped>

</style>