var app = new Vue({
    el: '#app',
    data: {
        bc: new BroadcastChannel('weakest_link'),
        message: 'Hello Vue!',

        bank: 0,
        round: 1,
        kitty: 0
    },
    created: function () {
        this.bc.onmessage = this.receiveBroadcast;
    },
    methods: {
        receiveBroadcast: function (event) {
            this.message = event.data;
        }
    },
    computed: {
        timeFormatted: function () {
            return '0:00'
        }
    }
})
