import Vue from 'vue';
import store from './store/index.js';
import App from './components/App.vue';
import CurrencyFormatter from './filters/Currency.js';

Vue.filter('currency', CurrencyFormatter);

var app = new Vue({
    el: '#app',
    store,
    render: h => h(App),
})
