import Vue from 'vue';
import App from './components/App.vue';
import CurrencyFormatter from './filters/Currency.js';

Vue.filter('currency', CurrencyFormatter);

var app = new Vue({
    el: '#app',
    render: h => h(App),
})
