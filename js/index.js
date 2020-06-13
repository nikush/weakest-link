import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js';

import EventBus from './EventBus.js';
import Game from './Game.js';

import Controls from './components/Controls.js';
import HeadToHead from './components/HeadToHead.js';
import Names from './components/Names.js';
import RoundCycle from './components/RoundCycle.js';
import Sound from './components/Sound.js';

import CurrencyFormatter from './filters/Currency.js';

Vue.filter('currency', CurrencyFormatter);

var app = new Vue({
    el: '#app',
    components: {
        Controls,
        HeadToHead,
        Names,
        RoundCycle,
        Sound,
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
