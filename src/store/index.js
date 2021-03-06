import Vue from 'vue';
import Vuex from 'vuex';
import round from './modules/round.js';
import scores from './modules/scores.js';

Vue.use(Vuex);

const mutations = {
    addToKitty(state, payload) {
        state.kitty += payload.amount;
    },
    setGameScreen(state, payload) {
        state.gameScreen = payload.screen;
    },
    toggleMuted (state) {
        state.muted = !state.muted;
    },
};

export { mutations };
export default new Vuex.Store({
    state: {
        kitty: 0,
        muted: false,
        gameScreen: 'names', // names, round, head_to_head
    },
    mutations,
    modules: {
        round,
        scores,
    },
});
