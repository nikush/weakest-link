Vue.component('head-to-head', {
    props: ['players', 'kitty'],
    template: `
        <div class="row">
            <div class="col-8 offset-2 text-center">
                <h1 class="display-4 mb-0">&pound;{{kitty.toFixed(2)}}</h1>
                <p class="mb-5 h4" style="text-transform:uppercase">Kitty</p>
                <div class="row">

                    <div v-for="(player, playerIndex) in playerScores" class="col d-flex flex-column align-items-center">
                        <h2 class="mb-4">{{player.name}}</h2>
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
    `,
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
            Vue.set(this.playerScores[playerIndex].scores, scoreIndex, !currentScore);
        },
    },

    created: function () {
        this.playerScores = this.players.map((player) => {
            return {
                name: player,
                scores: [null, null, null, null, null],
            }
        });
    },
});
