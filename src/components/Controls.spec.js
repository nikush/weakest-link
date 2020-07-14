import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Controls from './Controls.vue';
import { mutations } from '../store/index.js';

const localVue = createLocalVue();
localVue.use(Vuex);

function factory () {
    let store = new Vuex.Store({
        state: { muted: false },
        mutations,
    });

    return shallowMount(Controls, {
        localVue,
        store,
    });
}

test('toggles the muted state when clicked', async () => {
    const wrapper = factory();
    expect(wrapper.get('button').text()).toBe('Mute Sounds');

    await wrapper.get('button').trigger('click');
    expect(wrapper.vm.muted).toBe(true);
    expect(wrapper.get('button').text()).toBe('Unmute Sounds');
});
