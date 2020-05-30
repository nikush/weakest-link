Vue.component('Controls', {
    template: `
        <div class="card shadow mb-4 bg-dark">
            <div class="card-body">
                <button class="btn btn-outline-secondary btn-block" @click="toggleSounds">
                    {{sharedState.muted?'Unmute':'Mute'}} Sounds
                </button>
                <ul class="list-unstyled mb-0 mt-3 text-left text-light">
                    <li><kbd>s</kbd> start/pause the round</li>
                    <li><kbd>space</kbd> correct answer, step chain forward</li>
                    <li><kbd>backspace</kbd> incorrect answer, break chain</li>
                    <li><kbd>enter</kbd> bank</li>
                    <li><kbd>z</kbd> undo the last correct/incorrect answer/bank</li>
                </ul>
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
    },
});
