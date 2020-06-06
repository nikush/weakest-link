Vue.component('round-cycle', {
    template: `
        <div class="row"">
            <div class="col d-flex flex-column align-items-center">
                <Chain class="mb-4" :links="linkValues" :progress="answerStreak"></Chain>
                <p class="pill mb-5" data-text="Bank">{{bank | currency}}</p>
            </div>
            <div class="col">
                <Players :active="activePlayer"></Players>
            </div>
            <div class="col d-flex flex-column align-items-center">
                <p class="pill mb-5" data-text="Round">{{sharedState.round}}</p>
                <Timer class="mb-5" @complete="endRound"></Timer>
                <p class="pill mb-5" data-text="Kitty">{{sharedState.kitty | currency}}</p>
            </div>

            <Modal :title="modalTitles[roundState]" :display="['summary','eliminate'].includes(roundState)">
                <round-summary v-if="roundState === 'summary'"
                    :round="sharedState.round"
                    :kitty="sharedState.kitty"
                    :bank="bank"
                    :is-final="sharedState.round === sharedState.rounds.length"
                    @click="proceedToNextRound"
                >
                </round-summary>
                <elimination-list v-if="roundState === 'eliminate'"
                    @selected="eliminatePlayer"
                    :players="sharedState.remainingPlayers"
                    :scores="scores"
                >
                </elimination-list>
            </Modal>
        </div>
    `,
    data: function () {
        return {
            sharedState: Game.state,
            linkValues: [0.2,0.5,1,2,3,4.5,6,8,10],
            answerStreak: null,
            activePlayer: 0,
            bank: 0,

            scores: {},

            history: {},

            roundState: 'inactive', // inactive, active, paused, summary, eliminate
            stateKeyMap: {
                'inactive': {
                    'KeyS': this.toggleGameState,
                },
                'active': {
                    'KeyS': this.toggleGameState,
                    'Space': this.questionCorrect,
                    'Backspace': this.questionIncorrect,
                    'Enter': this.bankAnswerStreak,
                    'KeyB': this.bankAnswerStreak,
                    'KeyZ': this.undoLastAction,
                },
                'paused': {
                    'KeyS': this.toggleGameState,
                    'KeyZ': this.undoLastAction,
                },
            },

            modalTitles: {
                summary: 'Round Summary',
                eliminate: 'Eliminate Player',
            },
        };
    },

    methods: {
        incrementAnswerStreak: function () {
            this.answerStreak++;
        },
        decrementAnswerStreak: function () {
            if (this.answerStreak > 0) {
                this.answerStreak--;
            }
        },
        resetAnswerStreak: function () {
            this.answerStreak = 0;
        },
        clearAnswerStreak: function () {
            this.answerStreak = null;
        },

        questionCorrect: function () {
            this.logHistory();

            this.scores[this.activePlayerName].correct++;
            this.scores[this.activePlayerName].total++;
            this.scores[this.activePlayerName].contribution += this.linkValues[this.answerStreak];

            this.incrementAnswerStreak();
            this.nextPlayer();
        },
        questionIncorrect: function () {
            this.logHistory();

            this.scores[this.activePlayerName].total++;
            this.scores[this.activePlayerName].contribution -= this.linkValues[this.answerStreak];

            this.resetAnswerStreak();
            this.nextPlayer();
        },
        nextPlayer: function () {
            if (this.activePlayer == this.sharedState.remainingPlayers.length -1) {
                this.activePlayer = 0;
            } else {
                this.activePlayer++;
            }
        },

        bankAnswerStreak: function () {
            this.logHistory();

            const maxValue = Math.min(this.answerStreak, this.linkValues.length);
            const acquiredValue = this.linkValues[maxValue-1] || 0;

            this.bank += acquiredValue;
            this.resetAnswerStreak();

            const maxLinkValue = this.linkValues[this.linkValues.length-1];
            if (this.bank >= maxLinkValue) {
                this.bank = Math.min(this.bank, maxLinkValue);
                this.endRound();

                // interrupt the timer and audio
                EventBus.$emit('timer:stop');
                this.playTrack(this.sharedState.roundWinTrackName);
            }
        },

        toggleGameState: function () {
            switch (this.roundState) {
                case 'inactive':
                    this.startRound();
                    break;
                case 'active':
                    this.pauseRound();
                    break;
                case 'paused':
                    this.resumeRound();
                    break;
            }
        },
        startRound: function () {
            this.roundState = 'active';
            this.resetAnswerStreak();

            this.scores = {};
            for (player of this.sharedState.remainingPlayers) {
                this.scores[player] = {
                    correct: 0,
                    total: 0,
                    contribution: 0,
                };
            }

            const currentRound = this.sharedState.rounds[this.sharedState.round-1];
            EventBus.$emit('timer:start', currentRound.time);
            this.playTrack(currentRound.track);
        },
        pauseRound: function () {
            this.roundState = 'paused';
            EventBus.$emit('timer:pause');
            EventBus.$emit('audio:pause');
        },
        resumeRound: function () {
            this.roundState = 'active';
            EventBus.$emit('timer:resume');
            EventBus.$emit('audio:resume');
        },
        // called by timer "complete" event and bankAnswerStreak()
        endRound: function () {
            if (this.sharedState.round == this.sharedState.rounds.length) {
                this.bank *= 3;
            }

            this.roundState = 'summary';

            this.clearAnswerStreak();

            this.clearHistory();

            if (this.sharedState.round > this.sharedState.rounds.length) {
                this.sharedState.gameState = 'ended';
            }
        },

        proceedToNextRound: function () {
            if (this.sharedState.round == this.sharedState.rounds.length) {
                // hack because right now the kitty is only updated after elimination
                // which doesn't happen for the final round because there is no elimination
                this.sharedState.kitty += this.bank;
                this.sharedState.gameState = 'head_to_head';
            } else {
                this.roundState = 'eliminate';
            }
        },

        playTrack: function (trackName) {
            EventBus.$emit('audio:play', `./audio/${trackName}.mp3`);
        },

        logHistory: function () {
            const newHistory = {
                answerStreak: this.answerStreak,
                bank: this.bank,
                activePlayer: this.activePlayer,
                // scores is reactive so deep clone it without the reactive references
                scores: JSON.parse(JSON.stringify(this.scores)),
            };
            Vue.set(this, 'history', newHistory);
        },
        clearHistory: function () {
            Vue.set(this, 'history', {});
        },
        undoLastAction: function () {
            if (Object.keys(this.history).length === 0) {
                return;
            }

            this.answerStreak = this.history.answerStreak;
            this.bank = this.history.bank;
            this.activePlayer = this.history.activePlayer;
            this.scores = this.history.scores;

            this.clearHistory();
        },

        eliminatePlayer: function (player) {
            const i = this.sharedState.remainingPlayers.indexOf(player);
            this.sharedState.remainingPlayers.splice(i, 1);

            this.roundState = 'inactive';

            this.sharedState.kitty += this.bank;
            this.bank = 0;
            this.sharedState.round++;

            this.activePlayer = this.sharedState.remainingPlayers.indexOf(this.sharedState.strongestLink);
            // if the strongest player happens to have been eliminated
            // then fall back to whoever is first in the list
            if (this.activePlayer === -1) {
                this.activePlayer = 0;
            }
        },

        keyPress: function (event) {
            if (!this.stateKeyMap.hasOwnProperty(this.roundState)) {
                return;
            }

            const currentKeyMap = this.stateKeyMap[this.roundState];
            if (event.code in currentKeyMap) {
                currentKeyMap[event.code]();
            }
        }
    },

    computed: {
        activePlayerName: function () {
            return this.sharedState.remainingPlayers[this.activePlayer];
        },
    },

    created: function () {
        this.activePlayer = this.sharedState.remainingPlayers.indexOf(this.sharedState.strongestLink);
        document.addEventListener('keyup', this.keyPress);
    },
    beforeDestroy: function () {
        document.removeEventListener('keyup', this.keyPress);
    },
});
