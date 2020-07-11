import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import Round from './Round.vue';
import Chain from './Chain.vue';
import Players from './Players.vue';
import Timer from './Timer.vue';
import scores from '../store/modules/scores.js';
import round from '../store/modules/round.js';
import { cloneDeep } from 'lodash';

import formatter from '../filters/Currency.js';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.filter('currency', formatter)

// add missing methods for audio
// https://github.com/jsdom/jsdom/issues/2155#issuecomment-366703395
window.HTMLMediaElement.prototype.play = () => {};
window.HTMLMediaElement.prototype.pause = () => {};

function factory(options) {
    let store = new Vuex.Store({
        modules: {
            round: cloneDeep(round),
            scores: cloneDeep(scores),
        }
    });
    store.commit('scores/setContestants', {contestantNames:['foo','bar']});

    return shallowMount(Round, {
        localVue,
        store,
        ...options
    });
}

test('init state', async () => {
    const wrapper = factory();

    expect(wrapper.findComponent(Chain).exists()).toBe(true);
    expect(wrapper.findComponent(Players).exists()).toBe(true);
    expect(wrapper.findComponent(Timer).exists()).toBe(true);

    wrapper.destroy();
});

describe('keyboard input', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = factory();
    });
    afterEach(() => {
        wrapper.destroy();
    });

    test('can start the round', () => {
        expect(wrapper.vm.roundState).toBe('inactive');

        document.dispatchEvent(new KeyboardEvent('keyup', {code:'KeyS'}));

        expect(wrapper.vm.roundState).toBe('active');
    });

    test('can toggle the round state', () => {
        expect(wrapper.vm.roundState).toBe('inactive');

        document.dispatchEvent(new KeyboardEvent('keyup', {code:'KeyS'}));
        expect(wrapper.vm.roundState).toBe('active');

        document.dispatchEvent(new KeyboardEvent('keyup', {code:'KeyS'}));
        expect(wrapper.vm.roundState).toBe('paused');
    });

});

test.todo('plays the correct audio tracks');
test.todo('calls the appropriate methods on the round logic object');
