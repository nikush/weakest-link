const state = () => ({
    activeIndex: null,
    contestants: [],
});

const getters = {
    contestants (state) {
        return state.contestants;
    },

    remainingContestants (state) {
        return state.contestants.filter(contestant => !contestant.eliminated);
    },

    activeContestant (state) {
        return state.contestants[state.activeIndex];
    },

    remainingContestantsRanked (state, getters) {
        return getters.remainingContestants.sort(sortContestants);
    },
};

const mutations = {
    setContestants(state, payload) {
        state.contestants = payload.contestantNames.map(name => {
            return {
                name,
                eliminated: false,
                active: false,
                correct: 0,
                incorrect: 0,
                banked: 0,
                contribution: 0,
            }
        });
    },

    setActiveIndex (state, index) {
        state.activeIndex = index;
    },

    highlightContestantByIndex (state, index) {
        if (state.activeIndex !== null) {
            state.contestants[state.activeIndex].active = false;
        }

        state.activeIndex = index;
        state.contestants[state.activeIndex].active = true;
    },
    highlightNextContestant (state) {
        state.contestants[state.activeIndex].active = false;

        do {
            state.activeIndex++;
            if (state.activeIndex == state.contestants.length) {
                state.activeIndex = 0;
            }
        } while (state.contestants[state.activeIndex].eliminated === true);

        state.contestants[state.activeIndex].active = true;
    },

    contestantAnsweredCorrectly (state, contribution) {
        const contestant = state.contestants[state.activeIndex];
        contestant.correct++;
        contestant.contribution += contribution;
    },
    contestantAnsweredIncorrectly (state, contribution) {
        const contestant = state.contestants[state.activeIndex];
        contestant.incorrect++;
        contestant.contribution -= contribution;
    },
    contestantBanked (state, value) {
        const contestant = state.contestants[state.activeIndex];
        contestant.banked += value;
    },

    eliminatePlayerByName (state, name) {
        const contestant = state.contestants.find(contestant => contestant.name == name);
        contestant.eliminated = true;
    },
    resetScores (state) {
        for (let contestant of state.contestants) {
            contestant.correct = 0;
            contestant.incorrect = 0;
            contestant.banked = 0;
            contestant.contribution = 0;
        }
    },
};

const actions = {
    highlightFirstNameAlphabetically (context) {
        const firstName = context.getters.contestants.map(contestant => contestant.name).sort()[0];
        const contestant = context.getters.contestants.find(contestant => contestant.name == firstName);
        context.commit('highlightContestantByIndex', context.getters.contestants.indexOf(contestant));
    },
    highlightStrongestLink (context) {
        const strongestLink = context.getters.remainingContestantsRanked[0];
        context.commit('highlightContestantByIndex', context.getters.contestants.indexOf(strongestLink));
    },
};

function sortContestants(a, b) {
    if (a.correct != b.correct) {
        // this player got more correct so rank higher
        if (a.correct > b.correct) {
            return -1;
        } else {
            return 1;
        }
    }

    if (a.incorrect != b.incorrect) {
        // this player got fewer incorrect so rank higher
        if (a.incorrect < b.incorrect) {
            return -1;
        } else {
            return 1;
        }
    }

    if (a.banked != b.banked) {
        // this player banked more so rank higher
        if (a.banked > b.banked) {
            return -1;
        } else {
            return 1;
        }
    }

    if (a.contribution != b.contribution) {
        // this player contributed more with their questions so rank higher
        if (a.contribution > b.contribution) {
            return -1;
        } else {
            return 1;
        }
    }

    return 0;
}

export { getters, mutations, actions, sortContestants };
export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
