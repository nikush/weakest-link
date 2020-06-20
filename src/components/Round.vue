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
    </div>
</template>

<script>
import GameEnumeration from '../GameEnumeration.js';
import Chain from './Chain.vue';
import Players from './Players.vue';
import Timer from './Timer.vue';

export default {
    components: {
        Chain,
        Players,
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

            roundState: 'inactive', // inactive, active, paused

            history: {},

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
            //this.logHistory();

            const highestLinkValue = Math.min(this.answerStreak, this.linkValues.length-1);
            this.players.playerAnsweredCorrectly(this.linkValues[highestLinkValue]);
            this.players.highlightNextPlayer();

            this.incrementAnswerStreak();
        },
        questionIncorrect: function () {
            //this.logHistory();

            const highestLinkValue = Math.min(this.answerStreak, this.linkValues.length-1);
            this.players.playerAnsweredIncorrectly(this.linkValues[highestLinkValue]);
            this.players.highlightNextPlayer();

            this.resetAnswerStreak();
        },

        bankAnswerStreak: function () {
            //this.logHistory();

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

        playTrack: function (trackName) {
            this.$root.$refs.sound.play(`./audio/${trackName}.mp3`);
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

            this.roundState = 'inactive';

            this.clearAnswerStreak();

            this.$emit('complete', this.round, this.bank, this.kitty);

            this.kitty += this.bank;
            this.bank = 0;
            this.round++;

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
    },

    created: function () {
        this.players.highlightFirstPlayerAlphabetically();
        document.addEventListener('keyup', this.keyPress);
        this.round = (GameEnumeration.maxPlayers - this.players.length) + 1;
    },

    beforeDestroy: function () {
        document.removeEventListener('keyup', this.keyPress);
    },
}
</script>
