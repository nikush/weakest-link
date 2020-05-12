var app = new Vue({
    el: '#app',
    data: {
        bc: new BroadcastChannel('weakest_link'),
        message: 'Hello Vue!',
    },
    methods: {
        broadcast: function (payload) {
            this.bc.postMessage(payload);
        },
    },
})
