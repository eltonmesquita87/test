import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index'
import HistoricTransactions from '@/components/adjustGlEvents/HistoricTransactions'
import Jose from '@/components/jose/jose'
import EventGL from '@/components/adjustGlEvents/adjustGL'
import Reports from '@/components/reports/reports'
import Login from '@/components/login'
import logGL from '@/components/adjustGlEvents/logGL'
import resetSequence from '@/components/adjustGlEvents/resetSequence'



Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/historic',
      name: 'HistoricTransactions',
      component: HistoricTransactions 
    },
    {
      path: '/adjustGLEvents',
      name: 'AdjustGL',
      component: EventGL 
    },
    {
      path: '/reports',
      name: 'Reports',
      component: Reports 
    },
    {
      path: '/groot',
      name: 'Groot',
      component: Jose 
    },
    {
      path: '/logGL',
      name: 'logGL',
      component: logGL 
    },
    {
      path: '/resetSequence',
      name: 'resetSequence',
      component: resetSequence 
    }
  ]
})
