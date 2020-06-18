import { shallowMount } from '@vue/test-utils';
import Modal from './Modal.vue';

function factory(propsData) {
    return shallowMount(Modal, {propsData});
}

test('the modal is hidden by default', () => {
    const wrapper = factory({title:'some title', display:false});

    expect(wrapper.get('.modal-title').text()).toBe('some title');

    const modal = wrapper.get('.modal');
    expect(modal.classes()).not.toContain('show');
    expect(modal.classes()).not.toContain('d-block');
    const backdrop = wrapper.get('.modal-backdrop');
    expect(backdrop.classes()).not.toContain('show');
    expect(backdrop.classes()).toContain('d-none');
});

test('adds display classes', async () => {
    const wrapper = factory();

    wrapper.setProps({display:true});
    await wrapper.vm.$nextTick();

    const modal = wrapper.get('.modal');
    expect(modal.classes()).toContain('show');
    expect(modal.classes()).toContain('d-block');
    const backdrop = wrapper.get('.modal-backdrop');
    expect(backdrop.classes()).toContain('show');
    expect(backdrop.classes()).not.toContain('d-none');
});
