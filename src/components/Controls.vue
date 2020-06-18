<template>
    <div class="card shadow mb-4 bg-dark">
        <div class="card-body">
            <button class="btn btn-outline-secondary btn-block mb-3" @click="toggleSounds">
                {{muted?'Unmute':'Mute'}} Sounds
            </button>
            <table class="table table-dark mb-0">
                <tbody>
                    <tr> <td><kbd>s</kbd></td> <td>start/pause the round</td> </tr>
                    <tr> <td><kbd>space</kbd></td> <td>correct answer, step chain forward</td> </tr>
                    <tr> <td><kbd>backspace</kbd></td> <td>incorrect answer, break chain</td> </tr>
                    <tr> <td><kbd>enter</kbd>/<kbd>b</kbd></td> <td>bank</td> </tr>
                    <tr> <td><kbd>z</kbd></td> <td>undo the last correct/incorrect answer/bank</td> </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    data: function () {
        return {
            muted: false,
        }
    },
    methods: {
        toggleSounds: function () {
            this.muted = !this.muted;
            this.$emit('muted', this.muted);
        },
    },
};
</script>
