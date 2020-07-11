import { getters, mutations, actions } from './round.js';
import EventBus from '../../classes/EventBus.js';

describe('getters', () => {
    it.each([
        [0, 0],
        [1, 0.2],
        [2, 0.5],
        [3, 1],
        [8, 8],
        [9, 10], // max value
        [10, 10], // doesn't exceed the max
    ])('acquiredValueInChain: %i -> %f', (answerStreak, expected) => {
        const state = { answerStreak };
        const value = getters.acquiredValueInChain(state);
        expect(value).toBe(expected);
    });

    it.each([
        [0, 0.2],
        [1, 0.5],
        [2, 1],
        [3, 2],
        [8, 10], // max value
        [9, 10], // doesn't exceed the max value
    ])('currentValueInChain: %i -> %f', (answerStreak, expected) => {
        const state = { answerStreak };
        const value = getters.currentValueInChain(state);
        expect(value).toBe(expected);
    });

    it('hasBankedMaxValue', () => {
        const state = {
            bank: 0,
        };
        expect(getters.hasBankedMaxValue(state)).toBe(false);

        state.bank = 1;
        expect(getters.hasBankedMaxValue(state)).toBe(false);

        state.bank = 10;
        expect(getters.hasBankedMaxValue(state)).toBe(true);
    });
});

describe('mutations', () => {
    it('setRoundState', () => {
        const state = { state: 'foo' };
        mutations.setRoundState(state, 'new state');
        expect(state.state).toBe('new state');
    });

    it.each([
        [9, 1, 180],
        [8, 2, 170],
        [3, 7, 120],
        [2, 8, 90],
    ])('setRoundForNumberOfContestants: %i', (numContestants, round, timer) => {
        const state = { round: null };
        mutations.setRoundForNumberOfContestants(state, numContestants);
        expect(state.round).toBe(round);
        expect(state.timerDuration).toBe(timer);
    });

    it('incrementRound', () => {
        const state = { round: 1, timerDuration: null };
        mutations.incrementRound(state);
        expect(state.round).toBe(2);
        expect(state.timerDuration).toBe(170);

        // defensive check for the final round
        state.round = 8
        mutations.incrementRound(state);
        expect(state.round).toBe(9);
        expect(state.timerDuration).toBe(0);
    });

    it('addToBank', () => {
        const state = { bank: 0 };
        mutations.addToBank(state, {amount:10});
        expect(state.bank).toBe(10);
    });
    it('bankProgress', () => {
        const state = { bank: 0 };
        mutations.bankProgress(state, 5);
        expect(state.bank).toBe(5);

        // can keep adding to it
        mutations.bankProgress(state, 3);
        expect(state.bank).toBe(8);

        // cap it at 10
        mutations.bankProgress(state, 5);
        expect(state.bank).toBe(10);
    });
    it('clearBank', () => {
        const state = { bank: 10 };
        mutations.clearBank(state);
        expect(state.bank).toBe(0);
    });
    it('applyFinalRoundMultiplyer', () => {
        const state = { round: 1, bank: 10 };
        mutations.applyFinalRoundMultiplyer(state);
        expect(state.bank).toBe(10);

        state.round = 8;
        mutations.applyFinalRoundMultiplyer(state);
        expect(state.bank).toBe(30);
    });

    it('incrementAnswerStreak', () => {
        const state = { answerStreak: 0 };
        mutations.incrementAnswerStreak(state);
        expect(state.answerStreak).toBe(1);

        mutations.incrementAnswerStreak(state);
        expect(state.answerStreak).toBe(2);
    });
    it('resetAnswerStreak', () => {
        const state = { answerStreak: 5 };
        mutations.resetAnswerStreak(state);
        expect(state.answerStreak).toBe(0);
    });
    it('clearAnswerStreak', () => {
        const state = { answerStreak: 5 };
        mutations.clearAnswerStreak(state);
        expect(state.answerStreak).toBeNull();
    });
});

describe('actions', () => {
    it('bank', () => {
        const commit = jest.fn();
        const getters = { acquiredValueInChain: 5 };

        actions.bank({commit,getters});

        expect(commit.mock.calls.length).toBe(2);
        expect(commit.mock.calls[0]).toEqual(['bankProgress', 5]);
        expect(commit.mock.calls[1]).toEqual(['resetAnswerStreak']);
    });

    it('endRound', () => {
        const commit = jest.fn();
        let timerCount = 0;
        EventBus.$on('timer:pause', () => timerCount++);

        actions.endRound({commit});

        expect(commit.mock.calls.length).toBe(3);
        expect(commit.mock.calls[0]).toEqual(['clearAnswerStreak']);
        expect(commit.mock.calls[1]).toEqual(['incrementRound']);
        expect(commit.mock.calls[2]).toEqual(['setRoundState', 'inactive']);
        expect(timerCount).toBe(1);

        EventBus.$off(); // remove all event listeners
    });
});
