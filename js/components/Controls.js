Vue.component('Controls', {
    template: `
        <div class="card shadow mb-4 bg-dark">
            <div class="card-body">
                <button class="btn btn-primary btn-block" @click="toggleGameState">
                    {{gameStateCopy}} Round
                </button>
                <button class="btn btn-secondary btn-block" @click="undoAction" :disabled="Object.keys(sharedState.history).length === 0">
                    Undo Last Action
                </button>
                <hr class="border-secondary"/>
                <button class="btn btn-outline-secondary btn-block" @click="toggleSounds">
                    {{sharedState.muted?'Unmute':'Mute'}} Sounds
                </button>
                <button class="btn btn-outline-secondary btn-block" @click="showHelp=!showHelp">
                    Help
                </button>
                <ul class="list-unstyled mb-0 mt-3" v-if="showHelp">
                    <li><kbd>s</kbd> start the round</li>
                    <li><kbd>space</kbd> correct answer, step chain forward</li>
                    <li><kbd>backspace</kbd> incorrect answer, break chain</li>
                    <li><kbd>enter</kbd> bank</li>
                    <li><kbd>z</kbd> undo the last correct/incorrect answer/bank</li>
                    <li><kbd>up/down</kbd> amend place in chain up/down one step</li>
                    <!--
                    <li><kbd>left/right</kbd> amend value in the bank by increments of 2</li>
                    -->
                </ul>
            </div>
        </div>
    `,
    data: function () {
        return {
            sharedState: Game.state,
            showHelp: false,
        }
    },
    methods: {
        toggleSounds: function () {
            EventBus.$emit(this.sharedState.muted?'audio:unmute':'audio:mute');
            this.sharedState.muted = !this.sharedState.muted;
        },
        toggleGameState: function () {
            EventBus.$emit('round:toggle');
        },
        undoAction: function () {
            Game.undoLastAction();
        },
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
