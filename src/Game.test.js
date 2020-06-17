import Game from './Game.js';

test('min players is 2', () => {
    expect(Game.state.minPlayers).toBe(2);
});

test.todo('sets the players');
test.todo('starts the game');
