import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import formatter from '../filters/Currency.js';
import HeadToHead from './HeadToHead.vue';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.filter('currency', formatter)

describe('head to head', () => {
    let store
    let getters
    let wrapper

    beforeEach(() => {
        getters = {
            remainingContestants: () => [{name:'Alex'},{name:'Bruce'}],
            remainingContestantsRanked: () => [{name:'Bruce'},{name:'Alex'}],
        }
        store = new Vuex.Store({
            modules: {
                scores: {
                    namespaced: true,
                    getters,
                }
            }
        })

        wrapper = shallowMount(HeadToHead, {
            localVue,
            store,
            propsData: {
                kitty: 1.23,
            }
        });
    })

    test('assert display', () => {
        expect(wrapper.get('h1').text()).toBe('£1.23');
        expect(wrapper.findAll('h2').at(0).text()).toBe('Alex');
        expect(wrapper.findAll('h2').at(1).text()).toMatch('Bruce');
        // simple test to make sure it's generating the score checkboxes
        expect(wrapper.findAll('li').length).toBe(10);
    });

    test('sets up the player scores when created', () => {
        expect(wrapper.vm.playerScores).toEqual([
            {name:'Alex',scores:[null,null,null,null,null]},
            {name:'Bruce',scores:[null,null,null,null,null]},
        ]);
    });


    test('toggles the players scores when clicked', () => {
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
});
