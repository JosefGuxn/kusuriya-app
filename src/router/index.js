import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Dashboard from '@/components/Dashboard'
import NewImportSheet from '@/components/Task/NewImportSheet'
import NewExportSheet from '@/components/Task/NewExportSheet'
import Inventory from '@/components/Product/Inventory'
import ProductList from '@/components/Product/ProductList'
import InventoryReport from '@/components/Report/InventoryReport'
import ImportReport from '@/components/Report/ImportReport'
import ExportReport from '@/components/Report/ExportReport'

import Helper from '@/components/DbHelper'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/newimportsheet',
      name: 'New Import Sheet',
      component: NewImportSheet
    },
    {
      path: '/newexportsheet',
      name: 'New Export Sheet',
      component: NewExportSheet
    },
    {
      path: '/productslist',
      component: ProductList
    },
    {
      path: '/inventory',
      component: Inventory
    },
    {
      path: '/inventoryreport',
      component: InventoryReport
    },
    {
      path: '/importreport',
      component: ImportReport
    },
    {
      path: '/exportreport',
      component: ExportReport
    },
    {
      path: '/dbhelper',
      component: Helper
    },
    {
      path: '*',
      redirect: '/login'
    }
  ],
  mode: 'history'
})
