import Vue from 'vue';
import Vuex from 'vuex';
import products from './modules/products';
import cart from './modules/cart';
import user from './modules/user';
import ui from './modules/ui';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    products,
    cart,
    user,
    ui
  },
  strict: process.env.NODE_ENV !== 'production'
});
