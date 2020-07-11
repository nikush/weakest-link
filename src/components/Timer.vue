<template>
    <p class="pill" data-text="Time">{{durationFormatted}}</p>
</template>

<script>
import EventBus from '../classes/EventBus.js';

export default {
    props: {
        duration: Number,
    },
    data: function () {
        return {
            countDown: this.duration || 0,
            interval: null,
        }
    },
    methods: {
        tick: function () {
            this.countDown--;
            if (this.countDown == 0) {
                this.pause();
                this.$emit('complete');
            }
        },
        start: function () {
            this.interval = setInterval(this.tick, 1000);
        },
        pause: function () {
            clearInterval(this.interval);
        },
    },
    watch: {
        duration: function (newValue, oldValue) {
            this.countDown = this.duration;
        },
    },
    computed: {
        durationFormatted: function () {
            let seconds = this.countDown % 60;
            let mins = Math.floor(this.countDown / 60);
            if (seconds < 10) {
                seconds = "0" + seconds;
            }
            return `${mins}:${seconds}`;
        }
    },
    created() {
        EventBus.$on('timer:start', this.start);
        EventBus.$on('timer:pause', this.pause);
    },
};
</script>
