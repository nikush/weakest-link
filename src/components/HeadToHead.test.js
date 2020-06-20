import { createLocalVue, shallowMount } from '@vue/test-utils';
import formatter from '../filters/Currency.js';
import HeadToHead from './HeadToHead.vue';
import PlayerList from '../PlayerList';
import Player from '../Player';

const localVue = createLocalVue();
localVue.filter('currency', formatter)

function factory () {
    const alex = new Player('Alex');
    const bruce = new Player('Bruce');
    bruce.correct++;
    const players = new PlayerList();
    players.add(alex);
    players.add(bruce);

    return shallowMount(HeadToHead, {
        localVue,
        propsData: {
            players,
            kitty: 1.23,
        }
    });
}

test('assert display', () => {
    const wrapper = factory();

    expect(wrapper.get('h1').text()).toBe('£1.23');
    expect(wrapper.findAll('h2').at(0).text()).toBe('Alex');
    expect(wrapper.findAll('h2').at(1).text()).toMatch('Bruce');
    // simple test to make sure it's generating the score checkboxes
    expect(wrapper.findAll('li').length).toBe(10);
});

test('sets up the player scores when created', () => {
    const wrapper = factory();

    expect(wrapper.vm.playerScores).toEqual([
        {name:'Alex',scores:[null,null,null,null,null]},
        {name:'Bruce',scores:[null,null,null,null,null]},
    ]);
});


test('toggles the players scores when clicked', () => {
    const wrapper = factory();

    // click to tick
    wrapper.findAll('li').at(0).trigger('click');
    expect(wrapper.vm.playerScores).toEqual([
        {name:'Alex',scores:[true,null,null,null,null]},
        {name:'Bruce',scores:[null,null,null,null,null]},
    ]);

    // again to cross
    wrapper.findAll('li').at(0).trigger('click');
    expect(wrapper.vm.playerScores).toEqual([
        {name:'Alex',scores:[false,null,null,null,null]},
        {name:'Bruce',scores:[null,null,null,null,null]},
    ]);

    // click an arbitrary one to make sure another one works
    wrapper.findAll('li').at(7).trigger('click');
    expect(wrapper.vm.playerScores).toEqual([
        {name:'Alex',scores:[false,null,null,null,null]},
        {name:'Bruce',scores:[null,null,true,null,null]},
    ]);
});
