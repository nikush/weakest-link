<template>
    <transition>
        <div class="modal show d-block" v-if="display">
            <div class="modal-dialog shadow-lg">
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
    </transition>
</template>

<script>
export default {
    props: {
        title: String,
        display: Boolean,
    },
};
</script>
