import Game from './Game.js';

test('sets the players', () => {
    const playerNames = ['Alex', 'Bruce', 'Chris'];

    Game.setPlayers(playerNames);

    expect(Game.state.players).toBe(playerNames);
    expect(Game.state.remainingPlayers).toEqual(playerNames);
    expect(Game.state.remainingPlayers).not.toBe(playerNames); // clone of the original values
    expect(Game.state.round).toBe(7);
    expect(Game.state.strongestLink).toBe('Alex');
});

test('starts the game', () => {
    expect(Game.state.gameState).toBe('names');

    Game.startGame();

    expect(Game.state.gameState).toBe('round');
});
