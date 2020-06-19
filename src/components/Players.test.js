import { shallowMount } from '@vue/test-utils';
import Players from './Players.vue';

function factory(propsData) {
    return shallowMount(Players, {propsData});
}

test('displays all players', () => {
    const wrapper = factory({
        allPlayers: ['Alex','Bruce','Chris'],
        remainingPlayers: ['Alex','Bruce','Chris'],
        active: null,
    });

    expect(wrapper.findAll('li').length).toBe(3);
    expect(wrapper.find('li.active').exists()).toBe(false);
});

test('highlights the active player', async () => {
    const wrapper = factory({
        allPlayers: ['Alex','Bruce','Chris'],
        remainingPlayers: ['Alex','Bruce','Chris'],
        active: 0,
    });
    expect(wrapper.get('li.active').text()).toBe('Alex');

    wrapper.setProps({active:1});
    await wrapper.vm.$nextTick();
    expect(wrapper.get('li.active').text()).toBe('Bruce');
});

test('flags eliminated players', () => {
    const wrapper = factory({
        allPlayers: ['Alex','Bruce','Chris'],
        remainingPlayers: ['Alex','Chris'],
        active: null,
    });

    expect(wrapper.get('li.eliminated').text()).toBe('Bruce');
});

test('skips highlighting eliminated players', async () => {
    const wrapper = factory({
        allPlayers: ['Alex','Bruce','Chris'],
        remainingPlayers: ['Alex','Chris'],
        active: 0,
    });
    expect(wrapper.get('li.active').text()).toBe('Alex');

    wrapper.setProps({active:1});
    await wrapper.vm.$nextTick();
    expect(wrapper.get('li.active').text()).toBe('Chris');
});
