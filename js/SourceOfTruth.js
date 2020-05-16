const sourceOfTruth = {
    state: {
        answerStreak: null,
        linkValues: [1,2,5,10,15,20,30,40,50],
        bank: 0,
    },

    incrementAnswerStreak: function () {
        this.state.answerStreak++;
    },
    decrementAnswerStreak: function () {
        if (this.state.answerStreak > 0) {
            this.state.answerStreak--;
        }
    },
    resetAnswerStreak: function () {
        this.state.answerStreak = 0;
    },
    clearAnswerStreak: function () {
        this.state.answerStreak = null;
        this.state.bank = 0;
    },

    bankChain: function () {
        const fullChain = this.state.anwserStreak >= this.state.linkValues.length;

        const maxValue = Math.min(this.state.answerStreak, this.state.linkValues.length);
        const acquiredValue = this.state.linkValues[maxValue-1] || 0;

        this.state.bank += acquiredValue;
        this.resetAnswerStreak();

        // TODO: end the round if it's a full chain
    },
};

