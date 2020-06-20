<template>
    <div class="row">
        <div class="col d-flex flex-column align-items-center">
            <chain class="mb-4" :links="linkValues" :progress="answerStreak"></chain>
            <p class="pill mb-5" data-text="Bank">{{bank | currency}}</p>
        </div>
        <div class="col">
            <players :players="players.all()"></players>
        </div>
        <div class="col d-flex flex-column align-items-center">
            <p class="pill mb-5" data-text="Round">{{round}}</p>
            <timer class="mb-5" ref="timer" @complete="endRound"></timer>
            <p class="pill mb-5" data-text="Kitty">{{kitty | currency}}</p>
        </div>

        <modal :title="modalTitles[roundState]" :display="['summary','eliminate'].includes(roundState)">
            <round-summary v-if="roundState === 'summary'"
                :round="round"
                :kitty="kitty"
                :bank="bank"
                :is-final="isFinalRound"
                @click="proceedToNextRound"
            >
            </round-summary>
            <elimination-list v-if="roundState === 'eliminate'"
                @selected="eliminatePlayer"
                :players="players.getRemainingPlayersRanked()"
            >
            </elimination-list>
        </modal>
    </div>
</template>

<script>
import GameEnumeration from '../GameEnumeration.js';
import Chain from './Chain.vue';
import EliminationList from './EliminationList.vue';
import Modal from './Modal.vue';
import Players from './Players.vue';
import RoundSummary from './RoundSummary.vue';
import Timer from './Timer.vue';

export default {
    components: {
        Chain,
        EliminationList,
        Modal,
        Players,
        RoundSummary,
        Timer,
    },
    props: ['players'],
    data: function () {
        return {
            linkValues: [0.2,0.5,1,2,3,4.5,6,8,10],
            answerStreak: null,
            round: 1,
            bank: 0,
            kitty: 0,


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

            this.players.playerAnsweredCorrectly(this.linkValues[this.answerStreak]);
            this.players.highlightNextPlayer();

            this.incrementAnswerStreak();
        },
        questionIncorrect: function () {
            this.logHistory();

            this.players.playerAnsweredIncorrectly(this.linkValues[this.answerStreak]);
            this.players.highlightNextPlayer();

            this.resetAnswerStreak();
        },

        bankAnswerStreak: function () {
            this.logHistory();

            const maxValue = Math.min(this.answerStreak, this.linkValues.length);
            const acquiredValue = this.linkValues[maxValue-1] || 0;

            this.players.playerBanked(acquiredValue);
            this.bank += acquiredValue;
            this.resetAnswerStreak();

            const maxLinkValue = this.linkValues[this.linkValues.length-1];
            if (this.bank >= maxLinkValue) {
                this.bank = Math.min(this.bank, maxLinkValue);
                this.endRound();

                // interrupt the timer and audio
                this.$refs.timer.stop();
                this.playTrack(GameEnumeration.roundWinTrackName);
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

            const currentRound = GameEnumeration.rounds[this.round-1];
            this.$refs.timer.start(currentRound.time);
            this.playTrack(currentRound.track);
        },
        pauseRound: function () {
            this.roundState = 'paused';
            this.$refs.timer.pause();
            this.$parent.$refs.sound.pause();
        },
        resumeRound: function () {
            this.roundState = 'active';
            this.$refs.timer.resume();
            this.$parent.$refs.sound.resume();
        },
        // called by timer "complete" event and bankAnswerStreak()
        endRound: function () {
            if (this.round == GameEnumeration.rounds.length) {
                this.bank *= 3;
            }

            this.roundState = 'summary';

            this.clearAnswerStreak();

            this.clearHistory();
        },

        proceedToNextRound: function () {
            if (this.round == GameEnumeration.rounds.length) {
                // hack because right now the kitty is only updated after elimination
                // which doesn't happen for the final round because there is no elimination
                this.kitty += this.bank;

                this.$emit('complete', this.kitty);
            } else {
                this.roundState = 'eliminate';
            }
        },

        playTrack: function (trackName) {
            this.$parent.$refs.sound.play(`./audio/${trackName}.mp3`);
        },

        logHistory: function () {
            const newHistory = {
                answerStreak: this.answerStreak,
                bank: this.bank,
            };
            this.$set(this, 'history', newHistory);
        },
        clearHistory: function () {
            this.$set(this, 'history', {});
        },
        undoLastAction: function () {
            if (Object.keys(this.history).length === 0) {
                return;
            }

            this.answerStreak = this.history.answerStreak;
            this.bank = this.history.bank;

            this.clearHistory();
        },

        eliminatePlayer: function (player) {
            this.players.eliminatePlayerByName(player);

            this.roundState = 'inactive';

            this.kitty += this.bank;
            this.bank = 0;
            this.round++;
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
        isFinalRound: function () {
            return this.round === GameEnumeration.rounds.length
        }
    },

    created: function () {
        this.players.highlightFirstPlayerAlphabetically();
        document.addEventListener('keyup', this.keyPress);
        this.round = (GameEnumeration.maxPlayers - this.players.length) + 1;
    },

    beforeDestroy: function () {
        document.removeEventListener('keyup', this.keyPress);
    },
};
</script>
