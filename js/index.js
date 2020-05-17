const EventBus = new Vue();

var app = new Vue({
    el: '#app',
    data: {
        sharedState: Game.state,
    },
    created: function () {
        EventBus.$on('round:start', () => Game.startRound());
        EventBus.$on('timer:complete', () => Game.endRound());
        EventBus.$on('round:pause', () => {
            console.log('pausing the round');
            EventBus.$emit('timer:pause');
        });
        EventBus.$on('round:resume', () => {
            console.log('resume the round');
            EventBus.$emit('timer:resume');
        });

        EventBus.$on('chain:forward', () => Game.incrementAnswerStreak());
        EventBus.$on('chain:backward', () => Game.decrementAnswerStreak());
        EventBus.$on('chain:reset', () => Game.resetAnswerStreak());

        EventBus.$on('chain:bank', () => Game.bankAnswerStreak());

        EventBus.$on('game:controls', function () {
            window.open('controls.html', 'someWindowNow', 'height=500,width=600');
        });
    },
    methods: {
        toggleSounds: function () {
            EventBus.$emit(this.sharedState.muted?'audio:unmute':'audio:mute');
            this.sharedState.muted = !this.sharedState.muted;
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
