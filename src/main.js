import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

console.log('Vue app is initializing...');

new Vue({
  router,
  store,
  render: h => h(App),
  mounted() {
    console.log('Vue app mounted successfully');
  }
}).$mount('#app');
