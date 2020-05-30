Vue.component('round-cycle', {
    template: `
        <div class="row"">
            <div class="col d-flex flex-column align-items-center">
                <Chain class="mb-4" :links="linkValues" :progress="answerStreak"></Chain>
                <p class="pill mb-5" data-text="Bank">&pound{{bank}}</p>
            </div>
            <div class="col">
                <Players :active="activePlayer"></Players>
            </div>
            <div class="col d-flex flex-column align-items-center">
                <p class="pill mb-5" data-text="Round">{{sharedState.round}}</p>
                <Timer class="mb-5" @complete="endRound"></Timer>
                <p class="pill mb-5" data-text="Kitty">&pound;{{sharedState.kitty}}</p>
            </div>

            <Modal :title="modalTitles[roundState]" :display="['summary','eliminate'].includes(roundState)">
                <div v-if="roundState == 'summary'">
                    <table class="h3 table table-dark w-75 mx-auto">
                        <tbody>
                            <tr><th>Round</th><td class="text-right">{{sharedState.round}}</td></tr>
                            <tr><th>Bank</th> <td class="text-right">&pound;{{bank}}</td></tr>
                            <tr><th>Kitty</th><td class="text-right">&pound;{{sharedState.kitty}}</td></tr>
                            <tr><th>Total</th><td class="text-right">&pound;{{sharedState.kitty + bank}}</td></tr>
                        </tbody>
                    </table>
                    <button class="btn btn-primary" @click="roundState = 'eliminate'">Eliminate Players</button>
                </div>
                <elimination-list v-if="roundState == 'eliminate'"
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
            linkValues: [1,2,5,10,15,20,30,40,50],
            answerStreak: null,
            activePlayer: null,
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

            this.incrementAnswerStreak();
            this.nextPlayer();
        },
        questionIncorrect: function () {
            this.logHistory();

            this.scores[this.activePlayerName].total++;

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

            const fullChain = this.answerStreak >= this.linkValues.length;

            const maxValue = Math.min(this.answerStreak, this.linkValues.length);
            const acquiredValue = this.linkValues[maxValue-1] || 0;

            this.bank += acquiredValue;
            this.resetAnswerStreak();

            if (fullChain) {
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
            this.activePlayer = 0;
            this.resetAnswerStreak();

            this.scores = {};
            for (player of this.sharedState.remainingPlayers) {
                this.scores[player] = {
                    correct: 0,
                    total: 0,
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
            this.roundState = 'summary';
            this.activePlayer = null;

            this.clearAnswerStreak();

            this.clearHistory();

            if (this.sharedState.round > this.sharedState.rounds.length) {
                this.sharedState.gameState = 'ended';
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

            console.log(this.history);
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
            if (this.activePlayer === null) {
                return null;
            }
            return this.sharedState.remainingPlayers[this.activePlayer];
        },
    },

    created: function () {
        document.addEventListener('keyup', this.keyPress);
    },
    beforeDestroy: function () {
        document.removeEventListener('keyup', this.keyPress);
    },
});
