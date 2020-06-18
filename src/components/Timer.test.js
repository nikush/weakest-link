import { shallowMount } from '@vue/test-utils';
import Timer from './Timer.vue';

beforeEach(() => {
    jest.useFakeTimers();
});

test('formats the time value', () => {
    const wrapper = shallowMount(Timer);

    wrapper.setData({duration:0});
    expect(wrapper.vm.durationFormatted).toBe('0:00');

    wrapper.setData({duration:1});
    expect(wrapper.vm.durationFormatted).toBe('0:01');

    wrapper.setData({duration:10});
    expect(wrapper.vm.durationFormatted).toBe('0:10');

    wrapper.setData({duration:60});
    expect(wrapper.vm.durationFormatted).toBe('1:00');

    wrapper.setData({duration:90});
    expect(wrapper.vm.durationFormatted).toBe('1:30');
});

test('can start the timer', () => {
    const wrapper = shallowMount(Timer);
    expect(wrapper.vm.$data.duration).toBe(0);
    expect(wrapper.vm.$data.interval).toBeNull();

    wrapper.vm.start(10);
    expect(wrapper.vm.$data.duration).toBe(10);
    expect(wrapper.vm.$data.interval).not.toBeNull();

    jest.advanceTimersByTime(1000);
    expect(wrapper.vm.$data.duration).toBe(9);
});

test('can pause the timer', () => {
    const wrapper = shallowMount(Timer);

    wrapper.vm.start(10);
    jest.advanceTimersByTime(1000);
    expect(wrapper.vm.$data.duration).toBe(9);

    // timer is paused so duration shouldn't change
    wrapper.vm.pause();
    jest.advanceTimersByTime(1000);
    expect(wrapper.vm.$data.duration).toBe(9);
});

test('can resume the timer', () => {
    const wrapper = shallowMount(Timer);

    wrapper.vm.start(10);
    wrapper.vm.pause();

    wrapper.vm.resume();
    jest.advanceTimersByTime(1000);
    expect(wrapper.vm.$data.duration).toBe(9);
});

test('can stop the timer', () => {
    const wrapper = shallowMount(Timer);

    wrapper.vm.start(10);
    wrapper.vm.stop();
    expect(wrapper.vm.$data.duration).toBe(0);

    jest.advanceTimersByTime(1000);
    expect(wrapper.vm.$data.duration).toBe(0);
});

test('emits the completed event', () => {
    const wrapper = shallowMount(Timer);

    wrapper.vm.start(3);
    jest.advanceTimersByTime(3000);
    expect(wrapper.vm.$data.duration).toBe(0);

    expect(wrapper.emitted().complete.length).toBe(1);
});
