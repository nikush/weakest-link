Vue.component('Names', {
    props: ['min', 'max'],
    template: `
        <div class="card shadow-sm bg-dark">
            <div class="card-header">
                Players
            </div>
            <div class="card-body">
                <div class="form-group" v-for="(player,index) in players">
                    <input v-model="player.name" :key="index" type="text" class="form-control" @input="addField"/>
                </div>
                <button class="btn btn-block btn-primary" @click="submit">Start Game</button>
            </div>
        </div>
    `,
    data: function () {
        return {
            players: [{name:null}],
        };
    },
    methods: {
        addField: function () {
            if (this.players.length == this.max) {
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

            if (sanitisedNames.length < this.min) {
                alert(`A minimum of ${this.min} players is required. Only ${sanitisedNames.length} players have been provided.`);
                return;
            }

            this.$emit('submit', sanitisedNames);
        },
    },
});
