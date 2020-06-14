import Game from '../Game.js';

export default {
    props: ['players', 'scores'],
    template: `
        <div>
            <select class="form-control mb-4" v-model="selectedPlayer">
                <option disabled value="">Select Player</option>
                <option v-for="player in sortedPlayers">{{player}}</option>
            </select>
            <button class="btn btn-block btn-danger mb-5"
                :disabled="!selectedPlayer"
                @click="$emit('selected', selectedPlayer)"
            >
                Eliminate {{selectedPlayer}}
            </button>

            <details class="mb-4">
                <summary><h3 class="h5 d-inline-block">Strongest Link</h3></summary>
                <table class="table table-dark h5">
                    <tbody>
                        <tr>
                            <td>{{strongestLink.name}}</td>
                            <td>{{strongestLink.correct}}/{{strongestLink.total}}</td>
                            <td>{{strongestLink.percent}}%</td>
                            <td>{{strongestLink.contribution | currency}}</td>
                        </tr>
                    </tbody>
                </table>
            </details>
            <details class="mb-4">
                <summary><h3 class="h5 d-inline-block">Weakest Link</h3></summary>
                <table class="table table-dark h5">
                    <tbody>
                        <tr>
                            <td>{{weakestLink.name}}</td>
                            <td>{{weakestLink.correct}}/{{weakestLink.total}}</td>
                            <td>{{weakestLink.percent}}%</td>
                            <td>{{weakestLink.contribution | currency}}</td>
                        </tr>
                    </tbody>
                </table>
            </details>
            <details>
                <summary><h3 class="h5 d-inline-block">All Scores</h3></summary>
                <table class="table table-dark h5">
                    <tbody>
                        <tr v-for="(player,index) in formattedScores">
                            <th>{{index+1}}</th>
                            <td>{{player.name}}</td>
                            <td>{{player.correct}}/{{player.total}}</td>
                            <td>{{player.percent}}%</td>
                            <td>{{player.contribution | currency}}</td>
                        </tr>
                    </tbody>
                </table>
            </details>
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

            for (let player in this.scores) {
                mappedScores.push({
                    name: player,
                    correct: this.scores[player].correct,
                    total: this.scores[player].total,
                    percent: Math.round(this.scores[player].correct/this.scores[player].total*100),
                    contribution: this.scores[player].contribution,
                });
            }

            const rankedPlayers = mappedScores.sort(function (a, b) {
                if (a.percent == b.percent) {
                    return a.contribution - b.contribution;
                }
                return a.percent - b.percent;
            }).reverse();

            this.sharedState.strongestLink = rankedPlayers[0].name;

            return rankedPlayers;
        },
        strongestLink: function () {
            return this.formattedScores[0];
        },
        weakestLink: function () {
            return this.formattedScores[this.formattedScores.length-1];
        },
    },
};
