import { shallowMount } from '@vue/test-utils';
import Names from './Names.vue';

describe('Names.vue', () => {
    it('renders props.msg when passed', () => {
        const wrapper = shallowMount(Names, {
            propsData: { min: 2, max: 9 }
        })
        expect(wrapper.text()).toMatch('Players')
        expect(wrapper.text()).toMatch('Start Game')
    })
})
