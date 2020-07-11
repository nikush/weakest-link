import { shallowMount } from '@vue/test-utils';
import Names from './Names.vue';

function factory () {
    return shallowMount(Names, {
        propsData: { min: 2, max: 3 }
    });
}

test('dynamically adds more input fields as names are entered', async () => {
    const wrapper = factory();
    expect(wrapper.findAll('input').length).toBe(1);

    wrapper.get('input').setValue('foo');
    await wrapper.vm.$nextTick();

    expect(wrapper.findAll('input').length).toBe(2);
});

test('caps the number of input fields to the maximum configured value', async () => {
    const wrapper = factory();
    expect(wrapper.findAll('input').length).toBe(1);

    // populate 2 of the fields
    wrapper.setData({players: [{name:'Alex'},{name:'Bruce'}]});
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('input').length).toBe(2);

    // trigger the 3rd field to be added
    wrapper.findAll('input').at(1).trigger('input');
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('input').length).toBe(3);

    // set the last input and verify no more are added
    wrapper.findAll('input').at(2).setValue('Chris');
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('input').length).toBe(3);
});

test('players names are grouped into a list', async () => {
    const wrapper = factory();
    expect(wrapper.vm.$data.players).toEqual([{name:null}]);

    wrapper.findAll('input').at(0).setValue('Alex');
    expect(wrapper.vm.$data.players).toEqual([{name:'Alex'},{name:null}]);

    await wrapper.vm.$nextTick();

    wrapper.findAll('input').at(1).setValue('Bruce');
    expect(wrapper.vm.$data.players).toEqual([{name:'Alex'},{name:'Bruce'},{name:null}]);
});

test('white space is removed from names', () => {
    const wrapper = factory();

    wrapper.setData({players: [{name:'Alex '},{name:' Bruce'},{name:' Chris '},{name:' '}]});

    expect(wrapper.vm.trimmedNames).toEqual(['Alex','Bruce','Chris','']);
});

test('empty values are filtered from the list of names', () => {
    const wrapper = factory();

    wrapper.setData({players: [{name:'Alex'},{name:' '},{name:'Bruce'},{name:null}]});

    expect(wrapper.vm.nonEmptyNames).toEqual(['Alex','Bruce']);
});

test('CTA button is disabled until the minimum number of players is reached', async () => {
    const wrapper = factory();
    expect(wrapper.get('button').attributes('disabled')).toBe('disabled');

    wrapper.setData({players: [{name:'Alex'},{name:null}]});
    await wrapper.vm.$nextTick();
    expect(wrapper.get('button').attributes('disabled')).toBe('disabled');

    wrapper.setData({players: [{name:'Alex'},{name:'Bruce'}]});
    await wrapper.vm.$nextTick();
    expect(wrapper.get('button').attributes('disabled')).toBeUndefined();
});

test('emits the provided names', async () => {
    const wrapper = factory();
    wrapper.setData({players: [{name:' Alex'},{name:' '},{name:'Bruce '},{name:null}]});
    await wrapper.vm.$nextTick();

    wrapper.get('button').trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted().submit[0]).toEqual([['Alex','Bruce']]);
});

test.todo('prevents adding duplicate names');
