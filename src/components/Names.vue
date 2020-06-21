<template>
    <div class="card shadow-sm bg-dark">
        <div class="card-header">
            Players
        </div>
        <div class="card-body">
            <div class="form-group" v-for="(player,index) in players">
                <input v-model="player.name" :key="index" type="text" class="form-control" @input="addField"/>
            </div>
            <button class="btn btn-block btn-primary"
                @click="submit"
                :disabled="nonEmptyNames.length < min"
            >Start Game</button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        min: Number,
        max: Number,
    },
    data: function () {
        return {
            players: [{name:null}],
        };
    },
    computed: {
        nonEmptyNames: function () {
            return this.trimmedNames.filter(player => player);
        },
        trimmedNames: function () {
            return this.players.map(player => player.name ? player.name.trim() : '');
        },
    },
    methods: {
        addField: function () {
            if (this.players.length == this.max) {
                return;
            }

            const lastPlayer = this.players.slice(-1)[0];
            if (lastPlayer.name != null) {
                this.players.push({name:null});
            }
        },
        submit: function () {
            this.$emit('submit', this.nonEmptyNames);
        },
    },
};
</script>
