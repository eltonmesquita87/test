// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import VueResource from 'vue-resource'
import 'vuetify/dist/vuetify.min.css'
import apiConnector from './components/plugins/apiConnector'

Vue.use(Vuetify)

Vue.use(VueResource)

Vue.use(apiConnector, { server: process.env.SERVER_NODE, port: process.env.PORT_NODE, port_web: process.env.PORT_WEB});

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
