import { mount, shallowMount } from '@vue/test-utils';
import Players from './Players.vue';
import Player from '../Player.js';

function factory(propsData) {
    return mount(Players, {propsData});
}

test('displays all players', () => {
    const wrapper = factory({
        players: [
            new Player('Alex'),
            new Player('Bruce'),
            new Player('Chris'),
        ],
    });

    expect(wrapper.findAll('li').length).toBe(3);
    expect(wrapper.find('li.active').exists()).toBe(false);
});

test('highlights the active player', async () => {
    const alex = new Player('Alex');
    const bruce = new Player('Bruce');
    const chris = new Player('Chris');

    alex.active = true;
    let wrapper = factory({players:[alex,bruce,chris]});
    expect(wrapper.get('li.active').text()).toBe('Alex');

    alex.active = false;
    wrapper = factory({players:[alex,bruce,chris]});
    expect(wrapper.find('li.active').exists()).toBe(false);

    bruce.active = true;
    wrapper = factory({players:[alex,bruce,chris]});
    expect(wrapper.get('li.active').text()).toBe('Bruce');
});

test('flags eliminated players', () => {
    const alex = new Player('Alex');
    const bruce = new Player('Bruce');
    const chris = new Player('Chris');
    bruce.eliminated = true;

    let wrapper = factory({players:[alex,bruce,chris]});

    expect(wrapper.get('li.eliminated').text()).toBe('Bruce');
});
