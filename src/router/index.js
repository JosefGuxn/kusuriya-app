import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Dashboard from '@/components/Dashboard'
import NewImportSheet from '@/components/Task/NewImportSheet'
import Inventory from '@/components/Product/Inventory'
import ProductList from '@/components/Product/ProductList'

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
      path: '/productslist',
      component: ProductList
    },
    {
      path: '/drugsmanage',
      component: Inventory
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
