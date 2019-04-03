import Vue from 'vue'
import Router from 'vue-router'
import Datasource from '../pages/Datasources'
import Division from '../pages/Divisions'
import Generate from '../pages/Generate'
import GenerateHistory from '../pages/GenerateHistory'
import Report from '../pages/Report'
import User from '../pages/Users'
import store from '../store'

import {hostAddress, casLogin, casCheck} from 'utils/variable'

Vue.use(Router)

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isLogin) {
    next()
    return
  }
  next('/')
}

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isLogin) {
    next()
    return
  }
  next(this.casLogin+ hostAddress + this.casCheck)
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      name: 'Home',
      component: Generate,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/datasource',
      name: 'Datasource',
      component: Datasource,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/division',
      name: 'Division',
      component: Division,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/generate',
      name: 'Generate',
      component: Generate,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/generate-history',
      name: 'Generate History',
      component: GenerateHistory,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/report',
      name: 'Report',
      component: Report,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/user',
      name: 'User',
      component: User,
      beforeEnter: ifAuthenticated
    },
    {
      path: this.casLogin + hostAddress + this.casCheck,
      beforeEnter: ifNotAuthenticated
    }
  ]
})
