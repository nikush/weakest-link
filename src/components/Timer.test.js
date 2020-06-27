import { shallowMount } from '@vue/test-utils';
import Timer from './Timer.vue';

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

test('can start the timer', async () => {
    const wrapper = shallowMount(Timer);
    expect(wrapper.vm.$data.countDown).toBe(0);
    expect(wrapper.vm.$data.interval).toBeNull();

    await wrapper.setProps({duration: 10, run: true});
    expect(wrapper.vm.$data.countDown).toBe(10);
    expect(wrapper.vm.$data.interval).not.toBeNull();

    jest.advanceTimersByTime(1000);
    expect(wrapper.vm.$data.countDown).toBe(9);
});

test('can pause the timer', async () => {
    const wrapper = shallowMount(Timer);

    await wrapper.setProps({duration: 10, run: true});
    jest.advanceTimersByTime(1000);
    expect(wrapper.vm.$data.countDown).toBe(9);

    // timer is paused so duration shouldn't change
    await wrapper.setProps({run: false});
    jest.advanceTimersByTime(1000);
    expect(wrapper.vm.$data.countDown).toBe(9);
});

test('can resume the timer', async () => {
    const wrapper = shallowMount(Timer);

    await wrapper.setProps({duration: 10, run: false});

    await wrapper.setProps({run: true});
    jest.advanceTimersByTime(1000);
    expect(wrapper.vm.$data.countDown).toBe(9);
});

test('emits the completed event', async () => {
    const wrapper = shallowMount(Timer);

    await wrapper.setProps({duration:3, run:true});
    jest.advanceTimersByTime(3000);
    expect(wrapper.vm.$data.countDown).toBe(0);

    expect(wrapper.emitted().complete.length).toBe(1);
});
