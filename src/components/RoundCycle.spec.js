import RoundCycle from './RoundCycle.vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import Round from './Round.vue';
import Modal from './Modal.vue';
import RoundSummary from './RoundSummary.vue';
import EliminationList from './EliminationList.vue';
import round from '../store/modules/round.js';
import scores from '../store/modules/scores.js';
import { cloneDeep } from 'lodash';

const localVue = createLocalVue();
localVue.use(Vuex);

let store;
function factory() {
    store = new Vuex.Store({
        modules: {
            round: cloneDeep(round),
            scores: cloneDeep(scores),
        }
    });
    store.commit('scores/setContestants', {contestantNames:['Alex','Bruce']});

    return shallowMount(RoundCycle, {
        localVue,
        store
    });
}

describe('round cycle', () => {
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

        expect(wrapper.emitted().complete).toBeTruthy();
    });

    test('handles eliminating the selected player', async () => {
        const wrapper = factory();
        await wrapper.setData({roundState:'eliminate'});
        expect(store.state.scores.contestants[0].eliminated).toBe(false);

        await wrapper.findComponent(EliminationList).vm.$emit('selected', 'Alex');

        expect(store.state.scores.contestants[0].eliminated).toBe(true);
        expect(wrapper.vm.roundState).toBe(null);
    });

    test('computed isFinalRound method', () => {
        const wrapper = factory();

        wrapper.setData({roundSummary:{round:1}});
        expect(wrapper.vm.isFinalRound).toBe(false);

        wrapper.setData({roundSummary:{round:8}});
        expect(wrapper.vm.isFinalRound).toBe(true);
    });
});
