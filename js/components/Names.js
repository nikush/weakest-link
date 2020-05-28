Vue.component('Names', {
    template: `
        <div class="card shadow-sm bg-dark">
            <div class="card-header">
                Players
            </div>
            <div class="card-body">
                <div class="form-group" v-for="(player,index) in players">
                    <input v-model="player.name" :key="index" type="text" class="form-control" @input="addField"/>
                </div>
                <button class="btn btn-primary" @click="submit">Start Game</button>
            </div>
        </div>
    `,
    data: function () {
        return {
            players: [{name:null}],
            maxPlayers: 9,
            minPlayers: 3,
        };
    },
    methods: {
        addField: function () {
            if (this.players.length == this.maxPlayers) {
                return;
            }

            const lastPlayer = this.players.slice(-1)[0];
            if (lastPlayer.name != null) {
                this.players.push({name:null});
            }
        },
        submit: function () {
            const nonEmptyNames = this.players.filter(player => player.name);
            const sanitisedNames = nonEmptyNames.map(player => player.name.trim());
            const sortedNames = sanitisedNames.sort();

            if (sortedNames.length < this.minPlayers) {
                alert(`A minimum of ${this.minPlayers} is required. Only ${sortedNames.length} players have been provided.`);
                return;
            }

            this.$emit('submit', sortedNames);
        },
    },
});
