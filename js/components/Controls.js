Vue.component('Controls', {
    template: `
        <div class="card shadow mb-4 bg-dark">
            <div class="card-body">
                <button class="btn btn-outline-primary btn-block" @click="toggleGameState">
                    {{gameStateCopy}} Round
                </button>
                <button class="btn btn-outline-secondary btn-block" @click="toggleSounds">
                    {{sharedState.muted?'Unmute':'Mute'}} Sounds
                </button>
                <button class="btn btn-outline-secondary btn-block" disabled>
                    Undo Last Action
                </button>
            </div>
        </div>
    `,
    data: function () {
        return {
            sharedState: Game.state,
        }
    },
    methods: {
        toggleSounds: function () {
            EventBus.$emit(this.sharedState.muted?'audio:unmute':'audio:mute');
            this.sharedState.muted = !this.sharedState.muted;
        },
        toggleGameState: function () {
            EventBus.$emit('round:toggle');
        }
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
});
