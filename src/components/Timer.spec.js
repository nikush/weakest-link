import { shallowMount } from '@vue/test-utils';
import Timer from './Timer.vue';
import EventBus from '../classes/EventBus.js';

beforeEach(() => {
    jest.useFakeTimers();
});

test('formats the time value', async () => {
    const wrapper = shallowMount(Timer);

    await wrapper.setProps({duration:0});
    expect(wrapper.vm.durationFormatted).toBe('0:00');

    await wrapper.setProps({duration:1});
    expect(wrapper.vm.durationFormatted).toBe('0:01');

    await wrapper.setProps({duration:10});
    expect(wrapper.vm.durationFormatted).toBe('0:10');

    await wrapper.setProps({duration:60});
    expect(wrapper.vm.durationFormatted).toBe('1:00');

    await wrapper.setProps({duration:90});
    expect(wrapper.vm.durationFormatted).toBe('1:30');
});

test('changing the during updates the countdown', async () => {
    const wrapper = shallowMount(Timer);
    expect(wrapper.vm.$data.countDown).toBe(0);

    await wrapper.setProps({duration: 10});
    expect(wrapper.vm.$data.countDown).toBe(10);
});

test('can start the timer', async () => {
    const wrapper = shallowMount(Timer, {propsData: {duration:10}});
    expect(wrapper.vm.$data.interval).toBeNull();

    EventBus.$emit('timer:start');
    expect(wrapper.vm.$data.interval).not.toBeNull();

    jest.advanceTimersByTime(1000);
    expect(wrapper.vm.$data.countDown).toBe(9);
});

test('can pause and resume the timer', async () => {
    const wrapper = shallowMount(Timer, {propsData: {duration:10}});

    EventBus.$emit('timer:start');
    jest.advanceTimersByTime(1000);
    expect(wrapper.vm.$data.countDown).toBe(9);

    // timer is paused so duration should not change
    EventBus.$emit('timer:pause');
    jest.advanceTimersByTime(1000);
    expect(wrapper.vm.$data.countDown).toBe(9);

    // timer is resumed so duration should change
    EventBus.$emit('timer:start');
    jest.advanceTimersByTime(1000);
    expect(wrapper.vm.$data.countDown).toBe(8);
});

test('emits the completed event', async () => {
    const wrapper = shallowMount(Timer, {propsData: {duration:3}});

    EventBus.$emit('timer:start');
    jest.advanceTimersByTime(3000);
    expect(wrapper.vm.$data.countDown).toBe(0);

    expect(wrapper.emitted().complete.length).toBe(1);
});
