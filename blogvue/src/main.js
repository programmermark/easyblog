// import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueMeta from 'vue-meta'
import VueLazyload from 'vue-lazyload'

Vue.use(antd)
Vue.prototype.$message = antd.message

import api from './api/api'
Vue.prototype.$api = api
Vue.use(VueMeta, {
  refreshOnceOnNavigation: true
})

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: require('./assets/images/404.png'),
  loading: require('./assets/images/lazyloading.gif'),
  attempt: 1
})



Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
