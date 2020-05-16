const sourceOfTruth = {
    state: {
        linkValues: [1,2,5,10,15,20,30,40,50],
        roundTimes: [180, 170, 160, 150, 140, 130, 120, 90],

        round: 1,
        answerStreak: null,
        bank: 0,
        kitty: 0,

        audio: document.getElementById('audio'),
        audioTracks: [
            'Round 1 - 9 people',
            'Round 2 - 8 people',
            'Round 3 - 7 people',
            'Round 4 - 6 people',
            'Round 5 - 5 people',
            'Round 6 - 4 people',
            'Round 7 - 3 people',
            'Round 8 - 2 people',
            'Round Win',
        ],
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
    },

    bankAnswerStreak: function () {
        const fullChain = this.state.answerStreak >= this.state.linkValues.length;

        const maxValue = Math.min(this.state.answerStreak, this.state.linkValues.length);
        const acquiredValue = this.state.linkValues[maxValue-1] || 0;

        this.state.bank += acquiredValue;
        this.resetAnswerStreak();

        if (fullChain) {
            this.endRound();

            // interrupt the timer and audio
            EventBus.$emit('timer:stop');
            const track = this.state.audioTracks[this.state.audioTracks.length-1]
            this.state.audio.src=`./audio/${track}.mp3`;
            this.state.audio.play();
        }
    },

    startRound: function () {
        this.resetAnswerStreak();
        EventBus.$emit('timer:start', this.state.roundTimes[this.state.round-1]);

        let track = this.state.audioTracks[this.state.round-1];
        this.state.audio.src=`./audio/${track}.mp3`;
        this.state.audio.play();
    },
    // called by timer:complete event and bankAnswerStreak()
    endRound: function () {
        this.state.kitty += this.state.bank;
        this.state.bank = 0;

        this.clearAnswerStreak();

        this.state.round++;
    },
};

