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
