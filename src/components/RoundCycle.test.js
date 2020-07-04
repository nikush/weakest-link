import RoundCycle from './RoundCycle.vue';
import { shallowMount } from '@vue/test-utils';
import PlayerList from '../classes/PlayerList.js';
import Player from '../classes/Player.js';
import Round from './Round.vue';
import Modal from './Modal.vue';
import RoundSummary from './RoundSummary.vue';
import EliminationList from './EliminationList.vue';

function factory() {
    const players = new PlayerList();
    players.add(new Player('Alex'));
    players.add(new Player('Bruce'));

    return shallowMount(RoundCycle, {
        propsData: { players },
    });
}

test('init state', async () => {
    const wrapper = factory();

    // modal is hidden
    expect(wrapper.findComponent(Modal).attributes()).toEqual({});
});

test('shows the round summary modal on round complete', async () => {
    const wrapper = factory();

    const roundSummary = {round:1,kitty:2,bank:3};
    await wrapper.findComponent(Round).vm.$emit('complete', roundSummary);

    expect(wrapper.vm.roundSummary).toBe(roundSummary);
    expect(wrapper.vm.roundState).toBe('summary');

    // displays the summary modal
    expect(wrapper.findComponent(Modal).attributes()).toEqual({title:'Round Summary',display:'true'});

    const summary = wrapper.findComponent(RoundSummary);
    expect(summary.vm.round).toBe(1);
    expect(summary.vm.kitty).toBe(2);
    expect(summary.vm.bank).toBe(3);
    expect(summary.vm.isFinal).toBe(false);
});

test('progresses to the elimination list after the summary screen', async () => {
    const wrapper = factory();

    // set the stage for the summary modal
    const roundSummary = {round:1,kitty:2,bank:3};
    await wrapper.setData({roundSummary, roundState:'summary'});

    await wrapper.findComponent(RoundSummary).vm.$emit('click');

    expect(wrapper.vm.$data.roundState).toBe('eliminate');
    expect(wrapper.findComponent(EliminationList).exists()).toBe(true);
});

test('emits a complete event if this is the final round', async () => {
    const wrapper = factory();

    const roundSummary = {round:8,kitty:2,bank:3};
    await wrapper.setData({roundSummary, roundState:'summary'});

    await wrapper.findComponent(RoundSummary).vm.$emit('click');

    const kittyPlusBank = 5;
    expect(wrapper.emitted().complete[0]).toEqual([kittyPlusBank]);
});

test('handles eliminating the selected player', async () => {
    const wrapper = factory();
    await wrapper.setData({roundState:'eliminate'});
    // mock this method for testing
    wrapper.vm.players.eliminatePlayerByName = jest.fn();

    await wrapper.findComponent(EliminationList).vm.$emit('selected', 'Alex');

    expect(wrapper.vm.players.eliminatePlayerByName).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.players.eliminatePlayerByName).toHaveBeenCalledWith('Alex');
    expect(wrapper.vm.roundState).toBe(null);
});

test('computed isFinalRound method', () => {
    const wrapper = factory();

    wrapper.setData({roundSummary:{round:1}});
    expect(wrapper.vm.isFinalRound).toBe(false);

    wrapper.setData({roundSummary:{round:8}});
    expect(wrapper.vm.isFinalRound).toBe(true);
});
