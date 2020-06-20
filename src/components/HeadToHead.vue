<template>
    <div class="row">
        <div class="col-8 offset-2 text-center">
            <h1 class="display-4 mb-0">{{kitty | currency}}</h1>
            <p class="mb-5 h4" style="text-transform:uppercase">Kitty</p>
            <div class="row">

                <div v-for="(player, playerIndex) in playerScores" class="col d-flex flex-column align-items-center">
                    <h2 class="mb-4">{{ strong(player.name) }}</h2>
                    <ul class="list-unstyled" style="cursor:pointer;user-select:none">
                        <li v-for="(score, scoreIndex) in player.scores"
                            class="pill mb-4"
                            :class="{active:score==true}"
                            @click="toggleScore(playerIndex, scoreIndex)"
                        >
                            {{formatScore(score,scoreIndex)}}
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['players', 'kitty'],
    data: function () {
        return {
            playerScores: [],
        };
    },
    methods: {
        formatScore: function (score, index) {
            if (score === null) {
                return index+1;
            }
            return score ? '✓' : '✗';
        },
        toggleScore: function (playerIndex, scoreIndex) {
            const currentScore = this.playerScores[playerIndex].scores[scoreIndex];;
            this.$set(this.playerScores[playerIndex].scores, scoreIndex, !currentScore);
        },
        strong: function(name) {
            const strongestPlayer = this.players.getRemainingPlayersRanked()[0];
            if (name == strongestPlayer.name) {
                return name + " 🏅";
            }

            return name;
        },
    },

    created: function () {
        this.playerScores = this.players.remainingPlayers().map((player) => {
            return {
                name: player.name,
                scores: [null, null, null, null, null],
            }
        });
    },
};
</script>
