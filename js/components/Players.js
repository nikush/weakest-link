import Game from '../Game.js';

export default {
    props: ['active'],
    template: `
        <ul class="players list-unstyled">
            <li v-for="player in formattedPlayers" v-text="player.name"
                class="mb-2 p-3 rounded h5"
                :class="{active:player.active, eliminated:player.eliminated}"
            >
            </li>
        </ul>
    `,
    data: function () {
        return {
            sharedState: Game.state,
        };
    },
    computed: {
        formattedPlayers: function () {
            const activePlayerName = this.sharedState.remainingPlayers[this.active];
            let playerList = [];

            for (let playerName of this.sharedState.players) {
                // crap name, but it's a separate object that vue isn't tracking
                // for reactive changes
                let _player = {name:playerName};

                if (playerName == activePlayerName) {
                    _player.active = true;
                }
                if (!this.sharedState.remainingPlayers.includes(playerName)) {
                    _player.eliminated = true;
                }
                playerList.push(_player);
            }

            return playerList;
        },
    },
};
