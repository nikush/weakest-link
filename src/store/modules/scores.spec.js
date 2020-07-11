import { getters, mutations, actions, sortContestants } from './scores.js';

describe('getters', () => {
    it('contestants', () => {
        const state = {contestants: 'foo'};
        expect(getters.contestants(state)).toBe('foo');
    });

    it('remainingContestants', () => {
        const state = {
            contestants: [
                { name: 'foo', eliminated: false },
                { name: 'bar', eliminated: true },
                { name: 'baz', eliminated: false },
            ]
        };
        const results = getters.remainingContestants(state);
        expect(results.length).toBe(2);
        expect(results[0].name).toBe('foo');
        expect(results[1].name).toBe('baz');
    });

    it('activeContestant', () => {
        const state = {
            activeIndex: 1,
            contestants: [
                { name: 'foo', eliminated: false },
                { name: 'bar', eliminated: true },
                { name: 'baz', eliminated: false },
            ]
        };
        expect(getters.activeContestant(state).name).toBe('bar');
    });

    it('remainingContestantsRanked', () => {
        const _getters = {
            remainingContestants: [
                { name: 'foo', correct: 3 },
                { name: 'bar', correct: 5 },
            ]
        };
        const results = getters.remainingContestantsRanked({}, _getters);
        expect(results[0].name).toBe('bar');
        expect(results[1].name).toBe('foo');
    });
});

describe('mutations', () => {
    it('setContestants', () => {
        const state = {contestants:[]};
        mutations.setContestants(state, {contestantNames: ['foo']});

        expect(state.contestants).toEqual([{
            name: 'foo',
            eliminated: false,
            active: false,
            correct: 0,
            incorrect: 0,
            banked: 0,
            contribution: 0,
        }]);
    });

    it('setActiveIndex', () => {
        const state = {activeIndex: null};
        mutations.setActiveIndex(state, 1);
        expect(state.activeIndex).toBe(1);
    });

    it('highlightContestantByIndex', () => {
        const state = {
            activeIndex: 1,
            contestants: [
                { name: 'foo', active: false },
                { name: 'bar', active: true },
                { name: 'baz', active: false },
            ]
        };
        mutations.highlightContestantByIndex(state, 2);

        expect(state.activeIndex).toBe(2);
        expect(state.contestants[1].active).toBe(false);
        expect(state.contestants[2].active).toBe(true);
    });
    it('highlightNextContestant', () => {
        const state = {
            activeIndex: 0,
            contestants: [
                { name: 'foo', active: true,  eliminated: false },
                { name: 'bar', active: false, eliminated: true },
                { name: 'baz', active: false, eliminated: false },
            ]
        };
        mutations.highlightNextContestant(state);

        expect(state.activeIndex).toBe(2);
        expect(state.contestants[0].active).toBe(false);
        expect(state.contestants[2].active).toBe(true);
    });

    it('contestantAnsweredCorrectly', () => {
        const state = {
            activeIndex: 0,
            contestants: [{
                name: 'foo',
                correct: 0,
                incorrect: 0,
                contribution: 0,
            }]
        };
        mutations.contestantAnsweredCorrectly(state, 5);
        expect(state.contestants[0].correct).toBe(1);
        expect(state.contestants[0].incorrect).toBe(0);
        expect(state.contestants[0].contribution).toBe(5);
    });
    it('contestantAnsweredIncorrectly', () => {
        const state = {
            activeIndex: 0,
            contestants: [{name: 'foo', banked: 1}],
        };
        mutations.contestantBanked(state, 2);
        expect(state.contestants[0].banked).toBe(3);
    });
    it('contestantBanked', () => {
        const state = {
            activeIndex: 0,
            contestants: [{
                name: 'foo',
                correct: 0,
                incorrect: 0,
                contribution: 0,
            }]
        };
        mutations.contestantAnsweredIncorrectly(state, 5);
        expect(state.contestants[0].correct).toBe(0);
    });

    it('eliminatePlayerByName', () => {
        const state = {
            activeIndex: 0,
            contestants: [
                { name: 'foo', eliminated: false },
                { name: 'bar', eliminated: false },
                { name: 'baz', eliminated: false },
            ]
        };
        mutations.eliminatePlayerByName(state, 'bar');

        expect(state.contestants[0].eliminated).toBe(false);
        expect(state.contestants[1].eliminated).toBe(true);
        expect(state.contestants[2].eliminated).toBe(false);
    });
});

describe('actions', () => {
    it('highlightFirstNameAlphabetically', () => {
        const commit = jest.fn();
        const getters = { contestants:[{name:'foo'},{name:'bar'}] };

        actions.highlightFirstNameAlphabetically({commit,getters});

        expect(commit.mock.calls.length).toBe(1);
        expect(commit.mock.calls[0]).toEqual(['highlightContestantByIndex', 1]);
    });

    it('highlightStrongestLink', () => {
        const contestants = [{name:'foo'},{name:'bar'}];
        const commit = jest.fn();
        const getters = {
            contestants,
            remainingContestantsRanked: Array.from(contestants).reverse(),
        };

        actions.highlightStrongestLink({commit,getters});

        expect(commit.mock.calls.length).toBe(1);
        expect(commit.mock.calls[0]).toEqual(['highlightContestantByIndex', 1]);
    });
});

describe('sortContestants', () => {
    test('number of correct answers', () => {
        const alex = {name:'Alex'};
        const bruce = {name:'Bruce'};
        expect(sortContestants(alex, bruce)).toBe(0);

        // alex got more correct so rank him higher
        alex.correct = 2;
        bruce.correct = 1;
        expect(sortContestants(alex, bruce)).toBe(-1);

        // alex got fewer correct so rank him lower
        alex.correct = 1;
        bruce.correct = 2;
        expect(sortContestants(alex, bruce)).toBe(1);
    });

    test('number of incorrect answers', () => {
        const alex = {name:'Alex'};
        const bruce = {name:'Bruce'};

        // alex got fewer incorrect so rank him higher
        alex.incorrect = 1;
        bruce.incorrect = 2;
        expect(sortContestants(alex, bruce)).toBe(-1);

        // alex got more incorrect so rank him lower
        alex.incorrect = 2;
        bruce.incorrect = 1;
        expect(sortContestants(alex, bruce)).toBe(1);
    });

    test('amount banked', () => {
        const alex = {name:'Alex'};
        const bruce = {name:'Bruce'};

        // alex banked more so rank him higher
        alex.banked = 10;
        bruce.banked = 5;
        expect(sortContestants(alex, bruce)).toBe(-1);

        // alex banked less so rank him lower
        alex.banked = 5;
        bruce.banked = 10;
        expect(sortContestants(alex, bruce)).toBe(1);
    });

    test('question contribution', () => {
        const alex = {name:'Alex'};
        const bruce = {name:'Bruce'};

        // alex contributed more so rank him higher
        alex.contribution = 10;
        bruce.contribution = 5;
        expect(sortContestants(alex, bruce)).toBe(-1);

        // alex contributed less so rank him lower
        alex.contribution = 5;
        bruce.contribution = 10;
        expect(sortContestants(alex, bruce)).toBe(1);
    });
});
