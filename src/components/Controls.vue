<template>
    <div class="card shadow mb-4 bg-dark">
        <div class="card-body">
            <button class="btn btn-outline-secondary btn-block mb-3" @click="toggleMuted">
                {{muted?'Unmute':'Mute'}} Sounds
            </button>
            <table class="table table-dark mb-0">
                <tbody>
                    <tr> <td><kbd>s</kbd></td> <td>start/pause the round</td> </tr>
                    <tr> <td><kbd>space</kbd></td> <td>correct answer, step chain forward</td> </tr>
                    <tr> <td><kbd>backspace</kbd></td> <td>incorrect answer, break chain</td> </tr>
                    <tr> <td><kbd>enter</kbd>/<kbd>b</kbd></td> <td>bank</td> </tr>
                    <!-- <tr> <td><kbd>z</kbd></td> <td>undo the last correct/incorrect answer/bank</td> </tr> -->
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
    computed: mapState(['muted']),
    methods: mapMutations(['toggleMuted']),
};
</script>
