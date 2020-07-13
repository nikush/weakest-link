<template>
    <div class="card shadow-sm bg-dark">
        <div class="card-header">
            Players
        </div>
        <div class="card-body">
            <transition-group>
                <div class="form-group" v-for="(player,index) in players" :key="index">
                    <input v-model="player.name" type="text" class="form-control" @input="addField"/>
                </div>
            </transition-group>
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

<style scoped>
.v-enter-active, .v-leave-active {
    transition: all 0.3s ease;
}
.v-enter, .v-leave-to {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
}
</style>
