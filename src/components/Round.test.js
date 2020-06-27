import { createLocalVue, shallowMount } from '@vue/test-utils';
import Round from './Round.vue';
import RoundLogic from '../RoundLogic.js';
import PlayerList from '../PlayerList.js';
import Player from '../Player.js';
import Chain from './Chain.vue';
import Players from './Players.vue';
import Timer from './Timer.vue';

import formatter from '../filters/Currency.js';

const localVue = createLocalVue();
localVue.filter('currency', formatter)

// add missing methods for audio
// https://github.com/jsdom/jsdom/issues/2155#issuecomment-366703395
window.HTMLMediaElement.prototype.play = () => {};
window.HTMLMediaElement.prototype.pause = () => {};

function factory(options) {
    const players = new PlayerList();
    players.add(new Player('Alex'));
    players.add(new Player('Bruce'));

    return shallowMount(Round, {
        localVue,
        propsData: {
            players,
        },
        ...options
    });
}

test('init state', async () => {
    const wrapper = factory();

    expect(wrapper.findComponent(Chain).exists()).toBe(true);
    expect(wrapper.findComponent(Players).exists()).toBe(true);
    expect(wrapper.findComponent(Timer).exists()).toBe(true);
});

describe('keyboard input', () => {

    test('can start the round', () => {
        const wrapper = factory();
        expect(wrapper.vm.roundState).toBe('inactive');

        document.dispatchEvent(new KeyboardEvent('keyup', {code:'KeyS'}));
        expect(wrapper.vm.roundState).toBe('active');
    });

    test('can toggle the round state', () => {
        const wrapper = factory();
        expect(wrapper.vm.roundState).toBe('inactive');

        document.dispatchEvent(new KeyboardEvent('keyup', {code:'KeyS'}));
        expect(wrapper.vm.roundState).toBe('active');

        document.dispatchEvent(new KeyboardEvent('keyup', {code:'KeyS'}));
        expect(wrapper.vm.roundState).toBe('paused');
    });

});

test.todo('plays the correct audio tracks');
test.todo('calls the appropriate methods on the round logic object');
