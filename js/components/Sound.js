Vue.component('Sound', {
    template: `
        <audio autoplay :src="src"></audio>
    `,
    data: function () {
        return {
            src: null,
        }
    },
    methods: {
        play: function (track) {
            this.src = track;
        },
        stop: function () {
        },
        pause: function () {
        },
        resume: function () {
        },
    },
    created: function () {
        EventBus.$on('audio:play', this.play);
        EventBus.$on('audio:pause', this.play);
        EventBus.$on('audio:stop', this.play);
        EventBus.$on('audio:resume', this.play);
    },
});
