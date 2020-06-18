import { shallowMount } from '@vue/test-utils';
import Controls from './Controls.vue';
import EventBus from '../EventBus.js';
import Game from '../Game.js';

test('toggles the muted state when clicked', () => {
    expect(Game.state.muted).toBe(false);

    const wrapper = shallowMount(Controls);
    wrapper.find('button').trigger('click');

    expect(Game.state.muted).toBe(true);
});
