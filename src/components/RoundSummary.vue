<template>
    <div>
        <table class="h3 table table-dark w-75 mx-auto">
            <tbody>
                <tr><th>Round</th><td class="text-right">{{round}}</td></tr>
                <tr>
                    <th>Bank<span v-if="isFinal"> &times; 3</span></th>
                    <td class="text-right"><small class="text-muted" v-if="isFinal">({{bank/3 | currency}})</small> {{bank | currency}}</td>
                </tr>
                <tr><th>Kitty</th><td class="text-right">{{kitty | currency}}</td></tr>
                <tr><th>Total</th><td class="text-right">{{(kitty + bank) | currency}}</td></tr>
            </tbody>
        </table>

        <button class="btn btn-block btn-primary" @click="$emit('click')">
            {{ isFinal ? 'Final Round' : 'Eliminate Players' }}
        </button>
    </div>
</template>

<script>
export default {
    props: {
        round: Number,
        kitty: Number,
        bank: Number,
        isFinal: Boolean,
    },
};
</script>
