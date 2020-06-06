const Game = {
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
        players: {},
        remainingPlayers: [],
        strongestPlayer: null,
    },

    setPlayers: function (names) {
        for (name of names) {
            this.state.players[name] = {
                name: name,
                questions: {
                    total: 0,
                    correct: 0,
                }
            };
        }
        this.state.remainingPlayers = names;
        this.state.round = (this.state.maxPlayers - this.state.remainingPlayers.length) + 1;
        this.state.strongestPlayer = Array.from(names).sort()[0];
    },

    startGame: function () {
        this.state.gameState = 'round';
    },
};
