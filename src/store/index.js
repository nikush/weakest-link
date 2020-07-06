import Vue from 'vue';
import Vuex from 'vuex';
import round from './modules/round.js';
import scores from './modules/scores.js';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        kitty: 0,
        //muted: false,
        //strongestLink: null
        gameScreen: 'names', // names, round, head_to_head
    },
    mutations: {
        addToKitty(state, payload) {
            state.kitty += payload.amount;
        },
        setGameScreen(state, payload) {
            state.gameScreen = payload.screen;
        },
    },
    modules: {
        round,
        scores,
    },
});
