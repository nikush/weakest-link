import { shallowMount } from '@vue/test-utils';
import Modal from './Modal.vue';

function factory(propsData) {
    return shallowMount(Modal, {propsData});
}

test('the modal is hidden by default', () => {
    const wrapper = factory({title:'some title', display:false});

    expect(wrapper.find('.modal').exists()).toBe(false);
});

test('adds display classes', async () => {
    const wrapper = factory({title:'some title'});

    await wrapper.setProps({display:true});

    expect(wrapper.get('.modal-title').text()).toBe('some title');
    const modal = wrapper.get('.modal');
    expect(modal.classes()).toContain('show');
    expect(modal.classes()).toContain('d-block');
});
