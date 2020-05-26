Vue.component('Modal', {
    template: `
        <div>
            <div class="modal fade xd-block" :class="{show:sharedState.showModal, 'd-block':sharedState.showModal}">
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
            <div class="modal-backdrop fade" :class="{show:sharedState.showModal,'d-none':!sharedState.showModal}"></div>
        </div>
    `,
    props: {
        title: '',
    },
    data: function () {
        return {
            sharedState: Game.state,
        };
    },
});
