<template>
    <div class="row">
        <div class="col d-flex flex-column align-items-center">
            <chain class="mb-4" :links="linkValues" :progress="answerStreak"></chain>
            <p class="pill mb-5" data-text="Bank">{{bank | currency}}</p>
        </div>
        <div class="col">
            <players :players="contestants"></players>
        </div>
        <div class="col d-flex flex-column align-items-center">
            <p class="pill mb-5" data-text="Round">{{round}}</p>
            <timer class="mb-5" :duration="timerDuration" @complete="endRound"></timer>
            <p class="pill mb-5" data-text="Kitty">{{kitty | currency}}</p>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import EventBus from '../classes/EventBus.js';
import GameEnumeration from '../classes/GameEnumeration.js';
import Chain from './Chain.vue';
import Players from './Players.vue';
import Timer from './Timer.vue';

export default {
    components: {
        Chain,
        Players,
        Timer,
    },

    data: function () {
        return {
            linkValues: GameEnumeration.linkValues,

            audio: new Audio(),

            history: [],

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
        };
    },

    computed: {
        ...mapState({
            kitty: state => state.kitty,
            round: state => state.round.round,
            roundState: state => state.round.state,
            bank: state => state.round.bank,
            answerStreak: state => state.round.answerStreak,
            timerDuration: state => state.round.timerDuration,
        }),
        ...mapGetters('scores', [
            'contestants',
        ]),
        ...mapState({muted:'muted'}),
    },

    watch: {
        muted: function (newValue) {
            this.audio.volume = (newValue ? 0 : 1);
        },
    },

    methods: {
        questionCorrect: function () {
            //this.logHistory();

            this.$store.commit(
                'scores/contestantAnsweredCorrectly',
                this.$store.getters['round/currentValueInChain']
            );
            this.$store.commit('scores/highlightNextContestant');
            this.$store.commit('round/incrementAnswerStreak');
        },
        questionIncorrect: function () {
            //this.logHistory();

            this.$store.commit(
                'scores/contestantAnsweredIncorrectly',
                this.$store.getters['round/currentValueInChain']
            );
            this.$store.commit('scores/highlightNextContestant');
            this.$store.commit('round/resetAnswerStreak');
        },
        bankAnswerStreak: function () {
            //this.logHistory();

            this.$store.commit(
                'scores/contestantBanked',
                this.$store.getters['round/acquiredValueInChain']
            );
            this.$store.dispatch('round/bank');


            if (this.$store.getters['round/hasBankedMaxValue']) {
                this.playTrack(GameEnumeration.roundWinTrackName);
                this.endRound();
            }
        },

        playTrack: function (trackName) {
            this.audio.src = `./audio/${trackName}.mp3`;
            this.audio.play();
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
            this.$store.commit('round/setRoundState', 'active');
            this.$store.commit('round/resetAnswerStreak');
            EventBus.$emit('timer:start');

            const currentRound = GameEnumeration.rounds[this.round-1];
            this.playTrack(currentRound.track);
        },
        pauseRound: function () {
            this.$store.commit('round/setRoundState', 'paused');
            EventBus.$emit('timer:pause');

            this.audio.pause();
        },
        resumeRound: function () {
            this.$store.commit('round/setRoundState', 'active');
            EventBus.$emit('timer:start');

            this.audio.play();
        },
        // called by timer "complete" event and bankAnswerStreak()
        endRound: function () {
            this.$store.commit('round/applyFinalRoundMultiplyer');
            const summary = {
                round: this.round,
                bank: this.bank,
                kitty: this.kitty,
            };
            this.$store.commit('addToKitty', {amount: this.bank});
            this.$store.commit('round/clearBank');

            this.$store.dispatch('round/endRound');
            this.$emit('complete', summary);

            //this.clearHistory();
        },

        keyPress: function (event) {
            if (!this.stateKeyMap.hasOwnProperty(this.roundState)) {
                return;
            }

            const currentKeyMap = this.stateKeyMap[this.roundState];
            if (event.code in currentKeyMap) {
                currentKeyMap[event.code]();
            }
        },

        logHistory: function () {
            const state = {
                answerStreak: this.roundLogic.answerStreak,
                bank: this.roundLogic.bank,
            };
            this.history.push(state);
        },

        undoLastAction: function () {
            if (this.history.length === 0) {
                return;
            }

            const lastState = this.history.pop();
            this.roundLogic.answerStreak = lastState.answerStreak;
            this.roundLogic.bank = lastState.bank;
        },
    },

    mounted: function () {
        this.$store.commit('round/setRoundForNumberOfContestants', this.contestants.length);
        this.$store.dispatch('scores/highlightFirstNameAlphabetically');

        this.audio.volume = (this.muted ? 0 : 1);
        document.addEventListener('keyup', this.keyPress);
    },

    beforeDestroy: function () {
        document.removeEventListener('keyup', this.keyPress);
    },
}
</script>

<style>
.pill {
    font-weight: bold;
    font-size: 30px;
    background-color: #487EC1;
    width: 120px;
    text-align: center;
    border-radius: 75px / 20px;
    padding: 3px 10px;
    box-shadow: 0 7px 0 0 #2A4E7A, 0 10px 0 0 #2A4E7A;
    text-shadow: 0px 1px 2px black;
    text-transform: uppercase;
    transition: all 0.5s;

    line-height: 1;
}
.pill[data-text]::after {
    content: attr(data-text);
    display: block;
    position: absolute;
    width: 120px;
    margin-left: -10px;
    font-size: 80%;
}
.pill.active {
    background-color: #820009;
    box-shadow: 0 7px 0 0 #630505, 0 10px 0 0 #630505;
}

.pill-list .pill:not(:first-child):not(.active){
    color: #bbb;
}
</style>
