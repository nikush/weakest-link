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

            <controls v-if="showControls" :muted="muted" @toggle="toggleSounds" class="w-50 mx-auto"></controls>

            <div class="row mb-4" v-if="gameState == 'names'">
                <div class="col col-4 offset-4">
                    <names @submit="submitNames" :min="minPlayers" :max="maxPlayers"></names>
                </div>
            </div>

            <div v-if="gameState == 'round'">
                <round-cycle :players="players" @complete="roundsComplete" :muted="muted"></round-cycle>
            </div>

            <div v-if="gameState == 'head_to_head'">
                <head-to-head
                    :players="players"
                    :kitty="kitty"
                ></head-to-head>
            </div>

        </div>
    </div>
</template>

<script>
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
            gameState: 'names', // names, round, head_to_head

            showControls: false,
            players: null,
            kitty: null,
            minPlayers: GameEnumeration.minPlayers,
            maxPlayers: GameEnumeration.maxPlayers,

            muted: false,
        }
    },
    methods: {
        submitNames: function (names) {
            this.players = PlayerList.fromNames(names);
            this.gameState = 'round';
        },
        toggleSounds: function () {
            this.muted = !this.muted;
        },
        roundsComplete(kitty) {
            this.kitty = kitty;
            this.gameState = 'head_to_head';
        }
    },
})
</script>
