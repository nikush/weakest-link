Vue.component('Timer', {
    template: `<p class="pill" data-text="Time">{{durationFormatted}}</p>`,
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
                this.stopTimer();
                this.$emit('complete');
            }
        },
        stopTimer: function () {
            clearInterval(this.interval);
        },
        startTimer: function (duration) {
            this.duration = duration;
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
            return `${mins}:${seconds}`
        }
    },
    created: function () {
        EventBus.$on('timer:start', this.startTimer)
    }
});
