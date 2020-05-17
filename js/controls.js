var app = new Vue({
    el: '#app',
    data: {
        bc: new BroadcastChannel('weakest_link'),
        message: 'Hello Vue!',

        roundStarted: false,
        roundPaused: false,
        roundButtonCopy: 'Start',
    },
    methods: {
        broadcast: function (payload) {
            this.bc.postMessage(payload);
        },

        toggleRound: function () {
            console.log(this.roundStarted);
            if (!this.roundStarted) {
                this.broadcast('round:start');
                this.roundStarted = true;
                this.roundButtonCopy =  'Pause';
            } else {
                if (this.roundPaused) {
                    this.broadcast('round:resume');
                    this.roundPaused = false;
                    this.roundButtonCopy = 'Pause';
                } else {
                    this.broadcast('round:pause');
                    this.roundPaused = true;
                    this.roundButtonCopy = 'Resume';
                }
            }
        }
    },
})
