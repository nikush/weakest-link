import { createLocalVue, shallowMount } from '@vue/test-utils';
import EliminationList from './EliminationList.vue';
import formatter from '../filters/Currency.js';

const localVue = createLocalVue();
localVue.filter('currency', formatter)

function factory () {
    return shallowMount(EliminationList, {
        localVue,
        propsData: {
            players: [
                {name:'Chris'},
                {name:'Alex'},
                {name:'Bruce'},
            ],
        }
    });
}

test('selecting a player from the list will enabled the button', async () => {
    const wrapper = factory();

    expect(wrapper.findAll('option').length).toBe(4);
    expect(wrapper.get('button').text()).toBe('Eliminate');
    expect(wrapper.get('button').attributes().disabled).toBe('disabled');

    wrapper.findAll('option').at(2).setSelected();
    await wrapper.vm.$nextTick();
    expect(wrapper.get('button').text()).toBe('Eliminate Bruce');
    expect(wrapper.get('button').attributes().disabled).toBeUndefined();

    wrapper.get('button').trigger('click');
    expect(wrapper.emitted().selected[0]).toEqual(['Bruce']);
});
