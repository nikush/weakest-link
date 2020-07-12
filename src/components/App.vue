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

            <controls v-if="showControls" class="w-50 mx-auto"></controls>

            <div class="row mb-4" v-if="gameScreen == 'names'">
                <div class="col col-4 offset-4">
                    <names @submit="submitNames" :min="minPlayers" :max="maxPlayers"></names>
                </div>
            </div>

            <div v-if="gameScreen == 'round'">
                <round-cycle @complete="roundsComplete"></round-cycle>
            </div>

            <div v-if="gameScreen == 'head_to_head'">
                <head-to-head :kitty="kitty"></head-to-head>
            </div>

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
