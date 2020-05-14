const EventBus = new Vue();

var app = new Vue({
    el: '#app',
    data: {
        bc: new BroadcastChannel('weakest_link'),
        round: 1,
        kitty: 0,
        roundTimes: [180, 170, 160, 150, 140, 130, 120, 90],
        audio: document.getElementById('audio'),
        audioTracks: [
            'Round 1 - 9 people',
            'Round 2 - 8 people',
            'Round 3 - 7 people',
            'Round 4 - 6 people',
            'Round 5 - 5 people',
            'Round 6 - 4 people',
            'Round 7 - 3 people',
            'Round 8 - 2 people',
            'Round Win',
        ],
    },
    created: function () {
        this.bc.onmessage = this.receiveBroadcast;
        EventBus.$on('round:start', this.startRound);
        EventBus.$on('chain:end', this.endRound);
    },
    methods: {
        receiveBroadcast: function (event) {
            EventBus.$emit(event.data);
        },
        startRound: function () {
            EventBus.$emit('timer:start', this.roundTimes[this.round-1]);

            let track = this.audioTracks[this.round-1];
            this.audio.src=`./audio/${track}.mp3`;
            this.audio.play();
        },
        endRound: function (bank) {
            this.kitty += bank;
            this.round++;
        },
        /* TODO: contextually add/remove keys
         *       eg. don't allow the chain to manipulated if the round hasn't
         *       started
         */
        keyPress: function (event) {
            const keyMap = {
                'ArrowUp': 'chain:forward',
                'ArrowDown': 'chain:backward',
                'KeyS': 'round:start',
                'Space': 'chain:forward',
                'Backspace': 'chain:reset',
                'Enter': 'chain:bank',
            }
            if (event.code in keyMap) {
                EventBus.$emit(keyMap[event.code]);
            } else {
                console.warn('Unrecognised key', event);
            }
        }
    },
})

// work around to add global key presses
document.addEventListener('keyup', function (event) {
    app.keyPress(event);
});
