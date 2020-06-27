<template>
    <p class="pill" data-text="Time">{{durationFormatted}}</p>
</template>

<script>
export default {
    props: {
        duration: Number,
        run: Boolean,
    },
    data: function () {
        return {
            countDown: 0,
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
        run: function(newValue) {
            if (newValue === true) {
                this.start();
            } else {
                this.pause();
            }
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
};
</script>
