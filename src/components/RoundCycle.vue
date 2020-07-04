<template>
    <div>
        <round :players="players" @complete="roundComplete" :muted="muted"></round>

        <modal :title="modalTitles[roundState]" :display="['summary','eliminate'].includes(roundState)">
            <round-summary v-if="roundState === 'summary'"
                :round="roundSummary.round"
                :kitty="roundSummary.kitty"
                :bank="roundSummary.bank"
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
import GameEnumeration from '../classes/GameEnumeration.js';
import EliminationList from './EliminationList.vue';
import Modal from './Modal.vue';
import PlayerList from '../classes/PlayerList.js';
import Round from './Round.vue';
import RoundSummary from './RoundSummary.vue';

export default {
    components: {
        EliminationList,
        Modal,
        Round,
        RoundSummary,
    },
    props: {
        players: PlayerList,
        muted: Boolean,
    },
    data: function () {
        return {
            // todo: change this to reflect that it is now used for displaying the modal
            roundState: null, // null, summary, eliminate

            // data about the previous round for the summary
            roundSummary: null,

            modalTitles: {
                summary: 'Round Summary',
                eliminate: 'Eliminate Player',
            },
        };
    },

    methods: {
        roundComplete: function (summary) {
            this.roundSummary = summary;
            this.roundState = 'summary';
        },
        proceedToNextRound: function () {
            if (this.isFinalRound) {
                // hacky but it will do
                this.$emit('complete', this.roundSummary.kitty + this.roundSummary.bank);
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
            return this.roundSummary.round === GameEnumeration.rounds.length
        }
    },
};
</script>
