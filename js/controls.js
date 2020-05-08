var app = new Vue({
    el: '#app',
    data: {
        bc: new BroadcastChannel('weakest_link'),
        message: 'Hello Vue!',
    },
    methods: {
        sendIt: function () {
            this.bc.postMessage(this.message);
        }
    },
})
