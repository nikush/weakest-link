<template>
    <div>
        <select class="form-control mb-4" v-model="selectedPlayer">
            <option disabled value="">Select Player</option>
            <option v-for="player in sortedNames">{{player}}</option>
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
                        <td>{{strongestLink.correct}}<small class="text-muted">/{{strongestLink.total}}</small></td>
                        <td style="width:1px" class="text-right">{{strongestLink.banked | currency}}</td>
                        <td style="width:1px"><small class="text-muted">Banked</small></td>
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
                        <td>{{weakestLink.correct}}<small class="text-muted">/{{weakestLink.total}}</small></td>
                        <td style="width:1px" class="text-right">{{weakestLink.banked | currency}}</td>
                        <td style="width:1px"><small class="text-muted">Banked</small></td>
                    </tr>
                </tbody>
            </table>
        </details>
        <details>
            <summary><h3 class="h5 d-inline-block">All Scores</h3></summary>
            <table class="table table-dark h5">
                <tbody>
                    <tr v-for="(player,index) in players">
                        <th style="width:1px" class="text-muted">{{index+1}}</th>
                        <td>{{player.name}}</td>
                        <td>{{player.correct}}<small class="text-muted">/{{player.total}}</small></td>
                        <td style="width:1px" class="text-right">{{player.banked | currency}}</td>
                        <td style="width:1px"><small class="text-muted">Banked</small></td>
                    </tr>
                </tbody>
            </table>
        </details>
    </div>
</template>

<script>
export default {
    props: ['players'],
    data: function () {
        return {
            selectedPlayer: '',
        };
    },
    computed: {
        sortedNames: function () {
            return this.players.map(player => player.name).sort();
        },
        strongestLink: function () {
            return this.players[0];
        },
        weakestLink: function () {
            return this.players[this.players.length-1];
        },
    },
};
</script>
