<template>
    <div>
        <round :players="players" @complete="roundComplete"></round>

        <modal :title="modalTitles[roundState]" :display="['summary','eliminate'].includes(roundState)">
            <round-summary v-if="roundState === 'summary'"
                :round="roundData.round"
                :kitty="roundData.kitty"
                :bank="roundData.bank"
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
import EliminationList from './EliminationList.vue';
import Modal from './Modal.vue';
import Round from './Round.vue';
import RoundSummary from './RoundSummary.vue';

export default {
    components: {
        EliminationList,
        Modal,
        Round,
        RoundSummary,
    },
    props: ['players'],
    data: function () {
        return {
            // todo: change this to reflect that it is now used for displaying the modal
            roundState: null, // null, summary, eliminate

            // data about the previous round for the summary
            roundData: null,

            modalTitles: {
                summary: 'Round Summary',
                eliminate: 'Eliminate Player',
            },
        };
    },

    methods: {
        roundComplete: function (round, bank, kitty) {
            this.roundData = {round, bank, kitty},
            this.roundState = 'summary';
        },
        proceedToNextRound: function () {
            if (this.roundData.round == GameEnumeration.rounds.length) {
                // hacky but it will do
                this.$emit('complete', this.roundData.kitty + this.roundData.bank);
            } else {
                this.roundState = 'eliminate';
            }
        },

        /*
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
        */

        eliminatePlayer: function (player) {
            this.players.eliminatePlayerByName(player);

            this.roundState = null;
        },
    },

    computed: {
        isFinalRound: function () {
            return this.roundData.round === GameEnumeration.rounds.length
        }
    },
};
</script>
