Vue.component('elimination-list', {
    props: ['players', 'scores'],
    template: `
        <div>
            <button v-for="player in players"
                class="btn btn-outline-primary btn-block"
                @click="$emit('selected', player)"
                v-text="player">
            </button>
            <details class="mt-5">
                <summary><h3 class="h5 d-inline-block">Scores</h3></summary>
                <table class="table table-dark">
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
        </div>
    `,
    computed: {
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

            return mappedScores.sort((a,b) => a.percent - b.percent).reverse();
        },
    },
});
