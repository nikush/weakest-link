<template>
    <ul class="players list-unstyled">
        <li v-for="player in players"
            v-text="player.name"
            class="mb-2 p-3 rounded h5"
            :class="{active:player.active, eliminated:player.eliminated}"
        ></li>
    </ul>
</template>

<script>
export default {
    props: {
        players: Array,
    },
};
</script>

<style>
.players > li {
    background-color: hsla(0, 0%, 100%, 0.1);
    border-width: medium;
    border-style: solid;
    border-color: transparent;
    text-transform: capitalize;
    text-align: center;
}
.players > li.eliminated {
    opacity: 0.4;
    text-decoration: line-through;
}
.players > li.active {
    border-color: rgba(255,255,255,0.5);
}
</style>
