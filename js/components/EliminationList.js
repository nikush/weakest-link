Vue.component('elimination-list', {
    props: ['players'],
    template: `
        <div>
            <button v-for="player in players"
                class="btn btn-outline-primary btn-block"
                @click="$emit('selected', player)"
                v-text="player">
            </button>
        </div>
    `,
});
