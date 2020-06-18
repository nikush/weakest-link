<template>
    <div>
        <div class="modal fade" :class="{show:display, 'd-block':display}">
            <div class="modal-dialog">
                <div class="modal-content bg-dark">
                    <div v-if="title" class="modal-header border-bottom-0">
                        <h5 class="modal-title">{{title}}</h5>
                    </div>
                    <div class="modal-body">
                        <slot></slot>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-backdrop fade" :class="{show:display,'d-none':!display}"></div>
    </div>
</template>

<script>
export default {
    props: {
        title: '',
        display: false,
    },
};
</script>
