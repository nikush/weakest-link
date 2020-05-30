Vue.component('round-summary', {
    props: ['round','kitty','bank', 'isFinal'],
    template: `
        <div>
            <table class="h3 table table-dark w-75 mx-auto">
                <tbody>
                    <tr><th>Round</th><td class="text-right">{{round}}</td></tr>
                    <tr><th>Bank</th> <td class="text-right">&pound;{{bank}}</td></tr>
                    <tr><th>Kitty</th><td class="text-right">&pound;{{kitty}}</td></tr>
                    <tr><th>Total</th><td class="text-right">&pound;{{kitty + bank}}</td></tr>
                </tbody>
            </table>

            <button class="btn btn-primary" @click="$emit('click')">
                {{ isFinal ? 'Final Round' : 'Eliminate Players' }}
            </button>
        </div>
    `,
});
