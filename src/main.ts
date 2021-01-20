import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import "./compositionPlugin";

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
  created() {
    this.$store.dispatch('getApplicationData')
  },
}).$mount('#app')
