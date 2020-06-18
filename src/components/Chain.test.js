import { createLocalVue, shallowMount } from '@vue/test-utils';
import formatter from '../filters/Currency.js';
import Chain from './Chain.vue';

// create local vue to register the filter
// https://stackoverflow.com/a/53451818/2260838
const localVue = createLocalVue();
localVue.filter('currency', formatter)

function factory () {
    return shallowMount(Chain, {
        localVue,
        propsData: {
            links: [1,2,3,5,10],
            progress: null,
        }
    });
}

test('links in the chain are formatted as currency', () => {
    const wrapper = factory();

    expect(wrapper.text()).toMatch('£1.00');
});

test('the computed display streak never exceeds the number of links in the chain', () => {
    // starts at null
    const wrapper = factory();
    expect(wrapper.vm.displayStreak).toBeNull();

    // moves to 1
    wrapper.setProps({progress:1});
    expect(wrapper.vm.displayStreak).toBe(1);

    // maximum possible value
    wrapper.setProps({progress:4});
    expect(wrapper.vm.displayStreak).toBe(4);

    // capped at 4
    wrapper.setProps({progress:5});
    expect(wrapper.vm.displayStreak).toBe(4);
});

test('the links are sorted in reverse', () => {
    const wrapper = factory();
    expect(wrapper.vm.linksSorted).toEqual([
        {value:10,active:false},
        {value:5,active:false},
        {value:3,active:false},
        {value:2,active:false},
        {value:1,active:false},
    ]);
});

test('the active link is highlighted', () => {
    const wrapper = factory();

    wrapper.setProps({progress:0});
    expect(wrapper.vm.linksSorted).toEqual([
        {value:10,active:false},
        {value:5,active:false},
        {value:3,active:false},
        {value:2,active:false},
        {value:1,active:true},
    ]);

    wrapper.setProps({progress:1});
    expect(wrapper.vm.linksSorted).toEqual([
        {value:10,active:false},
        {value:5,active:false},
        {value:3,active:false},
        {value:2,active:true},
        {value:1,active:false},
    ]);

    // exceeding the number of links in the chain
    wrapper.setProps({progress:10});
    expect(wrapper.vm.linksSorted).toEqual([
        {value:10,active:true},
        {value:5,active:false},
        {value:3,active:false},
        {value:2,active:false},
        {value:1,active:false},
    ]);
});

test('an active class is added to the highlighted link in the chain', async () => {
    const wrapper = factory();
    expect(wrapper.find('li.active').exists()).toBe(false);

    wrapper.setProps({progress:0});
    await wrapper.vm.$nextTick();

    expect(wrapper.find('li.active').exists()).toBe(true);
});
