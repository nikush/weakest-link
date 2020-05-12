const EventBus = new Vue();

Vue.component('Chain', {
    template: `
        <ul class="pill-list list-unstyled mb-0">
            <li v-for="link in linksSorted"
                class="pill mb-3"
                :class="{active:link.active}"
            >
                &pound;{{link.value}}
            </li>
        </ul>
    `,
    data: function () {
        return {
            currentStep: null,
        }
    },
    props: {
        links: {
            type: Array,
            required: true
        },
    },
    computed: {
        linksSorted: function () {
            let linkObjs = this.links.map((link, index) => {
                return {
                    value: link,
                    active: this.currentStep == index,
                }
            });
            return linkObjs.reverse();
        }
    },
    methods: {
        incrementStep: function () {
            this.currentStep++;
        },
        decrementStep: function () {
            this.currentStep--;
        }
    },
    created: function () {
        EventBus.$on('chain:forward', this.incrementStep);
        EventBus.$on('chain:backward', this.decrementStep);
    }
});

Vue.component('Timer', {
    template: `<p class="pill" data-text="Time">{{timeFormatted}}</p>`,
    data: function () {
        return {
            time: 10,
            timeInterval: null,
        }
    },
    methods: {
        tick: function () {
            this.time--;
            if (this.time == 0) {
                this.stopTimer();
                this.$emit('complete');
            }
        },
        stopTimer: function () {
            clearInterval(this.timeInterval);
        },
        startTimer: function () {
            this.timeInterval = setInterval(this.tick, 1000);
        }
    },
    computed: {
        timeFormatted: function () {
            let seconds = this.time % 60;
            let mins = Math.floor(this.time / 60);
            if (seconds < 10) {
                seconds = "0" + seconds;
            }
            return `${mins}:${seconds}`
        }
    },
    created: function () {
        this.startTimer();
    }
});

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
            EventBus.$emit(event.data);
        },
        endRound: function () {
            console.log('time complete, ending round');
        },
        keyPress: function (event) {
            console.log(event);
            switch (event.code) {
                case 'ArrowUp':
                    EventBus.$emit('chain:forward');
                    break;
                case 'ArrowDown':
                    EventBus.$emit('chain:backward');
                    break;
            }
        }
    },
})

// work around to add global key presses
document.addEventListener('keyup', function (event) {
    app.keyPress(event);
});
