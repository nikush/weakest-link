const EventBus = new Vue();

const _currencyFormatter = new Intl.NumberFormat(
    'en-GB',
    {
        style: 'currency',
        currency: 'GBP',
    }
);
Vue.filter('currency', (number) => _currencyFormatter.format(number));

var app = new Vue({
    el: '#app',
    data: {
        sharedState: Game.state,
        showControls: false,
    },
    methods: {
        submitNames: function (names) {
            Game.setPlayers(names);
            Game.startGame();
        },
    },
})
