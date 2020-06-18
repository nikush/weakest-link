<template>
    <audio autoplay :src="src"></audio>
</template>

<script>
export default {
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
};
</script>
