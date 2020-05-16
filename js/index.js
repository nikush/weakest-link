const EventBus = new Vue();

var app = new Vue({
    el: '#app',
    data: {
        sharedState: Game.state,
        bc: new BroadcastChannel('weakest_link'),
    },
    created: function () {
        this.bc.onmessage = this.receiveBroadcast;

        EventBus.$on('round:start', () => Game.startRound());
        EventBus.$on('timer:complete', () => Game.endRound())

        EventBus.$on('chain:forward', () => Game.incrementAnswerStreak());
        EventBus.$on('chain:backward', () => Game.decrementAnswerStreak());
        EventBus.$on('chain:reset', () => Game.resetAnswerStreak());

        EventBus.$on('chain:bank', () => Game.bankAnswerStreak());

        EventBus.$on('game:controls', function () {
            window.open('controls.html', 'someWindowNow', 'height=500,width=600');
        });
    },
    methods: {
        receiveBroadcast: function (event) {
            EventBus.$emit(event.data);
        },

        keyPress: function (event) {
            const keyMap = {
                'ArrowUp': 'chain:forward',
                'ArrowDown': 'chain:backward',
                'KeyS': 'round:start',
                'Space': 'chain:forward',
                'Backspace': 'chain:reset',
                'Enter': 'chain:bank',
                'KeyC': 'game:controls',
            }
            if (event.code in keyMap) {
                EventBus.$emit(keyMap[event.code]);
            }
        }
    },
})

// work around to add global key presses
document.addEventListener('keyup', function (event) {
    app.keyPress(event);
});
