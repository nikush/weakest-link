<template>
    <ul class="players list-unstyled">
        <li v-for="player in formattedPlayers" v-text="player.name"
            class="mb-2 p-3 rounded h5"
            :class="{active:player.active, eliminated:player.eliminated}"
        >
        </li>
    </ul>
</template>

<script>
export default {
    props: ['allPlayers', 'remainingPlayers', 'active'],
    computed: {
        formattedPlayers: function () {
            const activePlayerName = this.remainingPlayers[this.active];
            let playerList = [];

            for (let playerName of this.allPlayers) {
                let player = {name:playerName};

                if (playerName == activePlayerName) {
                    player.active = true;
                }
                if (!this.remainingPlayers.includes(playerName)) {
                    player.eliminated = true;
                }
                playerList.push(player);
            }

            return playerList;
        },
    },
};
</script>
