import { mount, shallowMount } from '@vue/test-utils';
import Players from './Players.vue';

function factory(propsData) {
    return mount(Players, {propsData});
}

test('displays all players', () => {
    const wrapper = factory({
        players: [
            {name:'Alex'},
            {name:'Bruce'},
            {name:'Chris'},
        ],
    });

    expect(wrapper.findAll('li').length).toBe(3);
    expect(wrapper.find('li.active').exists()).toBe(false);
});

test('highlights the active player', async () => {
    const alex = {name:'Alex'};
    const bruce = {name:'Bruce'};
    const chris = {name:'Chris'};

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
    const alex = {name:'Alex'};
    const bruce = {name:'Bruce'};
    const chris = {name:'Chris'};
    bruce.eliminated = true;

    let wrapper = factory({players:[alex,bruce,chris]});

    expect(wrapper.get('li.eliminated').text()).toBe('Bruce');
});
