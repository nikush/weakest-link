const EventBus = new Vue();

var app = new Vue({
    el: '#app',
    data: {
        sharedState: Game.state,
        showControls: false,
        stateKeyMap: {
            'round:ended': {
                'KeyS': 'round:toggle',
            },
            'round:started': {
                'KeyS': 'round:toggle',
                'Space': 'question:correct',
                'Backspace': 'question:incorrect',
                'Enter': 'chain:bank',
                'ArrowUp': 'chain:forward',
                'ArrowDown': 'chain:backward',
                'KeyZ': 'history:undo',
            },
            'round:paused': {
                'KeyS': 'round:toggle',
                'KeyZ': 'history:undo',
            },
        },
    },
    created: function () {
        EventBus.$on('round:toggle', () => Game.toggleGameState());
        EventBus.$on('timer:complete', () => Game.endRound());

        EventBus.$on('question:correct', () => Game.questionCorrect());
        EventBus.$on('question:incorrect', () => Game.questionIncorrect());

        EventBus.$on('chain:bank', () => Game.bankAnswerStreak());
        EventBus.$on('chain:reset', () => Game.resetAnswerStreak());
        EventBus.$on('chain:forward', () => Game.incrementAnswerStreak());
        EventBus.$on('chain:backward', () => Game.decrementAnswerStreak());

        EventBus.$on('history:undo', () => Game.undoLastAction());
    },
    methods: {
        submitNames: function (names) {
            Game.setPlayers(names);
            Game.startGame();

            console.log(names);
        },

        keyPress: function (event) {
            if (!this.stateKeyMap.hasOwnProperty(this.sharedState.gameState)) {
                return;
            }

            const currentKeyMap = this.stateKeyMap[this.sharedState.gameState];
            if (event.code in currentKeyMap) {
                EventBus.$emit(currentKeyMap[event.code]);
            }
        }
    },
})

// work around to add global key presses
document.addEventListener('keyup', function (event) {
    app.keyPress(event);
});
