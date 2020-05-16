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
    },
    created: function () {
        EventBus.$on('audio:play', this.play);
    },
});
