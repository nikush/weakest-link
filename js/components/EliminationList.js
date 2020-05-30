Vue.component('elimination-list', {
    props: ['players', 'scores'],
    template: `
        <div>
            <select class="form-control mb-4" v-model="selectedPlayer">
                <option disabled value="">Select Player</option>
                <option v-for="player in sortedPlayers">{{player}}</option>
            </select>
            <details class="mb-4">
                <summary><h3 class="h5 d-inline-block">Reveal Scores</h3></summary>
                <table class="table table-dark h5">
                    <tbody>
                        <tr v-for="(player,index) in formattedScores">
                            <th>{{index+1}}</th>
                            <td>{{player.name}}</td>
                            <td>{{player.correct}}/{{player.total}}</td>
                            <td>{{player.percent}}%</td>
                        </tr>
                    </tbody>
                </table>
            </details>
            <button class="btn btn-danger"
                :disabled="!selectedPlayer"
                @click="$emit('selected', selectedPlayer)"
            >
                Eliminate {{selectedPlayer}}
            </button>
        </div>
    `,
    data: function () {
        return {
            sharedState: Game.state,
            selectedPlayer: '',
        };
    },
    computed: {
        sortedPlayers: function () {
            return Array.from(this.players).sort();
        },
        formattedScores: function () {
            let mappedScores = [];

            for (player in this.scores) {
                mappedScores.push({
                    name: player,
                    correct: this.scores[player].correct,
                    total: this.scores[player].total,
                    percent: Math.round(this.scores[player].correct/this.scores[player].total*100),
                });
            }

            const rankedPlayers = mappedScores.sort((a,b) => a.percent - b.percent).reverse();

            this.sharedState.strongestPlayer = rankedPlayers[0].name;

            return rankedPlayers;
        },
    },
});
