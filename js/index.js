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
            EventBus.$emit('timer:pause');
            EventBus.$emit('audio:pause');
        });
        EventBus.$on('round:resume', () => {
            EventBus.$emit('timer:resume');
            EventBus.$emit('audio:resume');
        });

        EventBus.$on('chain:forward', () => Game.incrementAnswerStreak());
        EventBus.$on('chain:backward', () => Game.decrementAnswerStreak());
        EventBus.$on('chain:reset', () => Game.resetAnswerStreak());

        EventBus.$on('chain:bank', () => Game.bankAnswerStreak());
    },
    computed: {
        gameStateCopy: function () {
            switch (this.sharedState.roundState) {
                case 'ended':
                    return 'Start';
                case 'started':
                    return 'Pause';
                case 'paused':
                    return 'Resume';
            }
        }
    },
    methods: {
        toggleGameState: function () {
            switch (this.sharedState.roundState) {
                case 'ended':
                    this.sharedState.roundState = 'started';
                    EventBus.$emit('round:start');
                    break;
                case 'started':
                    this.sharedState.roundState = 'paused';
                    EventBus.$emit('round:pause');
                    break;
                case 'paused':
                    this.sharedState.roundState = 'started';
                    EventBus.$emit('round:resume');
                    break;
            }
        },
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
