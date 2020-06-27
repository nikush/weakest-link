import Vue from 'vue';

import GameEnumeration from './GameEnumeration.js';

import Controls from './components/Controls.vue';
import HeadToHead from './components/HeadToHead.vue';
import Names from './components/Names.vue';
import RoundCycle from './components/RoundCycle.vue';
import PlayerList from './PlayerList.js';

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
        gameState: 'names', // names, round, head_to_head

        showControls: false,
        players: null,
        kitty: null,
        minPlayers: GameEnumeration.minPlayers,
        maxPlayers: GameEnumeration.maxPlayers,

        muted: false,
    },
    methods: {
        submitNames: function (names) {
            this.players = PlayerList.fromNames(names);
            this.gameState = 'round';
        },
        toggleSounds: function () {
            this.muted = !this.muted;
        },
        roundsComplete(kitty) {
            this.kitty = kitty;
            this.gameState = 'head_to_head';
        }
    },
})
