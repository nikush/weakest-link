import Vue from 'vue';

import EventBus from './EventBus.js';
import Game from './Game.js';

import Controls from './components/Controls.vue';
import HeadToHead from './components/HeadToHead.vue';
import Names from './components/Names.vue';
import RoundCycle from './components/RoundCycle.vue';

import CurrencyFormatter from './filters/Currency.js';

Vue.filter('currency', CurrencyFormatter);

var app = new Vue({
    el: '#app',
    components: {
        Controls,
        HeadToHead,
        Names,
        RoundCycle,
    },
    data: {
        sharedState: Game.state,
        showControls: false,
    },
    methods: {
        submitNames: function (names) {
            Game.setPlayers(names);
            Game.startGame();
        },
    },
})
