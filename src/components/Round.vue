<template>
    <div class="row">
        <div class="col d-flex flex-column align-items-center">
            <chain class="mb-4" :links="roundLogic.linkValues" :progress="roundLogic.answerStreak"></chain>
            <p class="pill mb-5" data-text="Bank">{{roundLogic.bank | currency}}</p>
        </div>
        <div class="col">
            <players :players="players.all()"></players>
        </div>
        <div class="col d-flex flex-column align-items-center">
            <p class="pill mb-5" data-text="Round">{{roundLogic.round}}</p>
            <timer class="mb-5" ref="timer" @complete="endRound"></timer>
            <p class="pill mb-5" data-text="Kitty">{{roundLogic.kitty | currency}}</p>
        </div>
    </div>
</template>

<script>
import GameEnumeration from '../GameEnumeration.js';
import Chain from './Chain.vue';
import RoundLogic from '../RoundLogic.js';
import PlayerList from '../PlayerList.js';
import Players from './Players.vue';
import Timer from './Timer.vue';

export default {
    components: {
        Chain,
        Players,
        Timer,
    },

    props: {
        players: PlayerList,
    },

    data: function () {
        return {
            roundLogic: new RoundLogic(),

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
        questionCorrect: function () {
            //this.logHistory();

            this.players.playerAnsweredCorrectly(this.roundLogic.getCurrentLinkIndex());
            this.players.highlightNextPlayer();

            this.roundLogic.incrementAnswerStreak();
        },
        questionIncorrect: function () {
            //this.logHistory();

            this.players.playerAnsweredIncorrectly(this.roundLogic.getCurrentLinkIndex());
            this.players.highlightNextPlayer();

            this.roundLogic.resetAnswerStreak();
        },

        bankAnswerStreak: function () {
            //this.logHistory();

            const acquiredValue = this.roundLogic.getAcquiredValueInChain();
            this.players.playerBanked(acquiredValue);
            this.roundLogic.bankProgress();

            if (this.roundLogic.hasBankedMaximumValue()) {
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
            this.roundLogic.resetAnswerStreak();

            const currentRound = GameEnumeration.rounds[this.roundLogic.round-1];
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
            const summary = this.roundLogic.endRound();

            this.$emit('complete', summary);

            this.roundState = 'inactive';

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
        this.roundLogic.setRoundForNumberOfPlayers(this.players.length);
        this.players.highlightFirstPlayerAlphabetically();
        document.addEventListener('keyup', this.keyPress);
    },

    beforeDestroy: function () {
        document.removeEventListener('keyup', this.keyPress);
    },
}
</script>
