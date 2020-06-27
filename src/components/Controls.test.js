import { shallowMount } from '@vue/test-utils';
import Controls from './Controls.vue';

test('toggles the muted state when clicked', async () => {
    const wrapper = shallowMount(Controls);
    expect(wrapper.get('button').text()).toBe('Mute Sounds');

    await wrapper.get('button').trigger('click');
    expect(wrapper.emitted().toggle).toBeTruthy();

    await wrapper.setProps({muted:true});
    expect(wrapper.get('button').text()).toBe('Unmute Sounds');
});
