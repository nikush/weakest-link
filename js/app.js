var app = new Vue({
    el: '#app',
    data: {
        bc: new BroadcastChannel('weakest_link'),
        message: 'Hello Vue!',
    },
    created: function () {
        this.bc.onmessage = this.receiveBroadcast;
    },
    methods: {
        receiveBroadcast: function (event) {
            this.message = event.data;
        }
    }
})
