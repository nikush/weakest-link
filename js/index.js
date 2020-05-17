const EventBus = new Vue();

var app = new Vue({
    el: '#app',
    data: {
        sharedState: Game.state,
    },
    created: function () {
        EventBus.$on('round:toggle', () => Game.toggleGameState());
        EventBus.$on('timer:complete', () => Game.endRound());

        EventBus.$on('chain:bank', () => Game.bankAnswerStreak());
        EventBus.$on('chain:reset', () => Game.resetAnswerStreak());
        EventBus.$on('chain:forward', () => Game.incrementAnswerStreak());
        EventBus.$on('chain:backward', () => Game.decrementAnswerStreak());
    },
    methods: {
        keyPress: function (event) {
            const keyMap = {
                //'ArrowUp': 'chain:forward',
                //'ArrowDown': 'chain:backward',
                'KeyS': 'round:toggle',
                'Space': 'chain:forward',
                'Backspace': 'chain:reset',
                'Enter': 'chain:bank',
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
