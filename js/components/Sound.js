Vue.component('Sound', {
    template: `
        <audio autoplay :src="src"></audio>
    `,
    data: function () {
        return {
            src: null,
            sharedState: Game.state,
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
        mute: function () {
            this.$el.volume = 0;
        },
        unmute: function () {
            this.$el.volume = 1;
        },
    },
    created: function () {
        EventBus.$on('audio:play', this.play);
        EventBus.$on('audio:pause', this.play);
        EventBus.$on('audio:stop', this.play);
        EventBus.$on('audio:resume', this.play);
        EventBus.$on('audio:mute', this.mute);
        EventBus.$on('audio:unmute', this.unmute);
    },
});
