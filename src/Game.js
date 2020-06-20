import PlayerList from './PlayerList.js';

export default {
    state: {
        rounds: [
            { time: 180, track: 'Round 1 - 9 people' },
            { time: 170, track: 'Round 2 - 8 people' },
            { time: 160, track: 'Round 3 - 7 people' },
            { time: 150, track: 'Round 4 - 6 people' },
            { time: 140, track: 'Round 5 - 5 people' },
            { time: 130, track: 'Round 6 - 4 people' },
            { time: 120, track: 'Round 7 - 3 people' },
            { time: 90,  track: 'Round 8 - 2 people' },
        ],
        roundWinTrackName: 'Round Win',

        round: 1,
        kitty: 0,

        muted: false,
        gameState: 'names', // names, round, head_to_head

        minPlayers: 2,
        maxPlayers: 9,
        playerList: null,

        // deprecated
        players: [],
        remainingPlayers: [],
        strongestLink: null,
        weakestLink: null,
    },

    setPlayers: function (names) {
        this.state.playerList = PlayerList.fromNames(names);

        // deprecated
        this.state.players = names;
        this.state.remainingPlayers = Array.from(names);
        this.state.strongestLink = Array.from(names).sort()[0];

        this.state.round = (this.state.maxPlayers - this.state.remainingPlayers.length) + 1;
    },

    startGame: function () {
        this.state.gameState = 'round';
    },
};
