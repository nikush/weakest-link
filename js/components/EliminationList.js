Vue.component('elimination-list', {
    template: `
        <div>
            <button v-for="player in sharedState.remainingPlayers"
                class="btn btn-outline-primary btn-block"
                @click="eliminate(player)"
                v-text="player"></button>
        </div>
    `,
    data: function () {
        return {
            sharedState: Game.state,
        }
    },
    methods: {
        eliminate: function (player) {
            const i = this.sharedState.remainingPlayers.indexOf(player);
            this.sharedState.remainingPlayers.splice(i, 1);
            this.sharedState.showModal = false;
        },
    }
});
