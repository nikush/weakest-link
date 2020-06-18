<template>
    <p class="pill" data-text="Time">{{durationFormatted}}</p>
</template>

<script>
export default {
    data: function () {
        return {
            duration: 0,
            interval: null,
        }
    },
    methods: {
        tick: function () {
            this.duration--;
            if (this.duration == 0) {
                this.stop();
                this.$emit('complete');
            }
        },
        stop: function () {
            this.pause();
            this.duration = 0;
        },
        start: function (duration) {
            this.duration = duration;
            this.resume();
        },
        pause: function () {
            clearInterval(this.interval);
        },
        resume: function () {
            this.interval = setInterval(this.tick, 1000);
        }
    },
    computed: {
        durationFormatted: function () {
            let seconds = this.duration % 60;
            let mins = Math.floor(this.duration / 60);
            if (seconds < 10) {
                seconds = "0" + seconds;
            }
            return `${mins}:${seconds}`;
        }
    },
};
</script>
