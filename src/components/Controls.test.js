import { shallowMount } from '@vue/test-utils';
import Controls from './Controls.vue';

test('toggles the muted state when clicked', async () => {
    const wrapper = shallowMount(Controls);
    expect(wrapper.get('button').text()).toBe('Mute Sounds');

    wrapper.get('button').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.get('button').text()).toBe('Unmute Sounds');
    expect(wrapper.emitted().muted[0]).toEqual([true]);

    wrapper.get('button').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.get('button').text()).toBe('Mute Sounds');
    expect(wrapper.emitted().muted[1]).toEqual([false]);
});
