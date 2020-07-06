import GameEnumeration from '../../classes/GameEnumeration.js';
import EventBus from '../../classes/EventBus.js';

const state = () => ({
    state: 'inactive', // active, inactive, paused
    round: 0,
    bank: 0,
    answerStreak: null,
    timerDuration: 0,
    scores: [],
    history: [],
});

const getters = {
    acquiredValueInChain (state) {
        const maxValue = Math.min(state.answerStreak, GameEnumeration.linkValues.length);
        return GameEnumeration.linkValues[maxValue-1] || 0;
    },
    currentValueInChain (state) {
        const maxValue = Math.min(state.answerStreak, GameEnumeration.linkValues.length-1);
        return GameEnumeration.linkValues[maxValue];
    },

    hasBankedMaxValue (state) {
        return state.bank == GameEnumeration.linkValues[GameEnumeration.linkValues.length-1];
    },
};

const mutations = {
    setRoundState(state, roundState) {
        state.state = roundState;
    },
    setRoundForNumberOfContestants(state, numPlayers) {
        state.round = (GameEnumeration.maxPlayers - numPlayers) + 1;

        // TODO: maybe extract this to its own mutation
        const currentRound = GameEnumeration.rounds[state.round-1];
        if (currentRound) {
            state.timerDuration = currentRound.time;
        } else {
            state.timerDuration = 0;
        }
    },

    incrementRound (state) {
        state.round++;

        // TODO: this is duplicated code, clean it up
        const currentRound = GameEnumeration.rounds[state.round-1];
        if (currentRound) {
            state.timerDuration = currentRound.time;
        } else {
            state.timerDuration = 0;
        }
    },

    addToBank(state, payload) {
        state.bank += payload.amount;
    },
    clearBank (state) {
        state.bank = 0;
    },
    applyFinalRoundMultiplyer (state) {
        if (state.round === GameEnumeration.rounds.length) {
            state.bank *= 3;
        }
    },

    incrementAnswerStreak(state, payload) {
        state.answerStreak++;
    },
    resetAnswerStreak(state) {
        state.answerStreak = 0;
    },
    clearAnswerStreak(state) {
        state.answerStreak = null;
    },

    bankProgress (state, amount) {
        state.bank += amount;

        const maxLinkValue = GameEnumeration.linkValues[GameEnumeration.linkValues.length-1];
        if (state.bank > maxLinkValue) {
            state.bank = maxLinkValue;
        }
    },
};

const actions = {
    bank (context) {
        context.commit('bankProgress', context.getters.acquiredValueInChain);
        context.commit('resetAnswerStreak');
    },

    // TODO: ensure the round ends when the timer completes
    // called by timer "complete" event and bankAnswerStreak()
    endRound (context) {
        EventBus.$emit('timer:pause');
        context.commit('clearAnswerStreak');
        context.commit('incrementRound');
        context.commit('setRoundState', 'inactive');
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
