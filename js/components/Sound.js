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
        pause: function () {
            this.$el.pause();
        },
        resume: function () {
            this.$el.play();
        },
        mute: function () {
            this.$el.volume = 0;
        },
        unmute: function () {
            this.$el.volume = 1;
        },
    },
    created: function () {
        // TODO: pass this in using props
        this.$el.volume = 0;

        EventBus.$on('audio:play', this.play);
        EventBus.$on('audio:pause', this.pause);
        EventBus.$on('audio:resume', this.resume);
        EventBus.$on('audio:mute', this.mute);
        EventBus.$on('audio:unmute', this.unmute);
    },
});
