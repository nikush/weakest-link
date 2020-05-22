Vue.component('Modal', {
    template: `
        <div>
            <div class="modal fade d-block" :class="{show:display}" tabindex="-1" role="dialog">
                <div class="modal-dialog">
                    <div class="modal-content text-dark">
                        <div class="modal-header">
                            <h5 class="modal-title">Modal title</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="display = false">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <p>Modal body text goes here.</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-backdrop fade" :class="{show:display}"></div>
        </div>
    `,
    data: function () {
        return {
            display: true,
        };
    },
});
