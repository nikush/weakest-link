import { createLocalVue, shallowMount } from '@vue/test-utils';
import formatter from '../filters/Currency.js';
import RoundSummary from './RoundSummary.vue';

const localVue = createLocalVue();
localVue.filter('currency', formatter)

function factory (propsData) {
    return shallowMount(RoundSummary, {
        localVue,
        propsData,
    });
}

test('displays the input props', () => {
    const wrapper = factory({round:1, kitty:2, bank:3, isFinal:false});

    expect(wrapper.get('tr:nth-child(1)').text()).toBe('Round1');
    expect(wrapper.get('tr:nth-child(2)').text()).toBe('Bank£3.00');
    expect(wrapper.get('tr:nth-child(3)').text()).toBe('Kitty£2.00');
    expect(wrapper.get('tr:nth-child(4)').text()).toBe('Total£5.00');

    expect(wrapper.get('button').text().trim()).toBe('Eliminate Players');

    wrapper.get('button').trigger('click');
    expect(wrapper.emitted().click.length).toBe(1);
});

test('alters display for the final round', () => {
    const wrapper = factory({round:1, kitty:2, bank:3, isFinal:true});

    expect(wrapper.get('tr:nth-child(2)').text()).toBe('Bank × 3£3.00');

    expect(wrapper.get('button').text().trim()).toBe('Final Round');
});
