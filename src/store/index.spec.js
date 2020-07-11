import { mutations } from './index.js';

test('can add an amount to the kitty', () => {
    const state = {
        kitty: 0,
    };
    mutations.addToKitty(state, {amount: 10});
    expect(state.kitty).toBe(10);
});

test('can set the game screen', () => {
    const state = {
        gameScreen: 'names',
    };
    mutations.setGameScreen(state, {screen: 'new screen'});
    expect(state.gameScreen).toBe('new screen');
});

test.todo('can store the muted state');
