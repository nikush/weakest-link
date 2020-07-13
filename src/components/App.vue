<template>
    <div>
        <nav class="navbar navbar-dark shadow-sm mb-5 mt-4">
            <div class="container justify-content-center">
                <span class="mb-0 h1" style="cursor:pointer;user-select:none" @click="showControls=!showControls">
                    The Weakest Link
                </span>
            </div>
        </nav>

        <div class="container">

            <transition>
                <controls v-if="showControls"></controls>
            </transition>

            <transition mode="out-in" appear>
                <div class="row mb-4" v-if="gameScreen == 'names'" key="names">
                    <div class="col col-4 offset-4">
                        <names @submit="submitNames" :min="minPlayers" :max="maxPlayers"></names>
                    </div>
                </div>

                <div v-if="gameScreen == 'round'" key="round-cycle">
                    <round-cycle @complete="roundsComplete"></round-cycle>
                </div>

                <div v-if="gameScreen == 'head_to_head'" key="head-to-head">
                    <head-to-head :kitty="kitty"></head-to-head>
                </div>
            </transition>

        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import GameEnumeration from '../classes/GameEnumeration.js';
import Controls from './Controls.vue';
import HeadToHead from './HeadToHead.vue';
import Names from './Names.vue';
import RoundCycle from './RoundCycle.vue';
import PlayerList from '../classes/PlayerList.js';

export default({
    components: {
        Controls,
        HeadToHead,
        Names,
        RoundCycle,
    },
    data: function () {
        return {
            showControls: false,
            minPlayers: GameEnumeration.minPlayers,
            maxPlayers: GameEnumeration.maxPlayers,
        }
    },
    computed: mapState({
        gameScreen: 'gameScreen',
        kitty: 'kitty',
    }),
    methods: {
        submitNames: function (names) {
            this['scores/setContestants']({ contestantNames: names });
            this.setGameScreen({ screen: 'round' });
        },
        roundsComplete() {
            this.setGameScreen({ screen: 'head_to_head' });
        },
        ...mapMutations([
            'scores/setContestants',
            'setGameScreen',
        ]),
    },
})
</script>

<style>
.v-enter-active, .v-leave-active {
    transition: all 0.3s ease;
}
.v-enter, .v-leave-to {
    opacity: 0;
    transform: scale(0.95);
}
</style>
