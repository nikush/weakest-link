Vue.component('Chain', {
    template: `
        <div>
            <ul class="pill-list list-unstyled mb-0">
                <li v-for="link in linksSorted"
                    class="pill mb-3"
                    :class="{active:link.active}"
                >
                    &pound;{{link.value}}
                </li>
            </ul>
            <p class="pill mb-5" data-text="Bank">&pound{{bank}}</p>
        </div>
    `,
    data: function () {
        return {
            bank: 0,
            sharedState: sourceOfTruth.state,
        }
    },
    computed: {
        linksSorted: function () {
            let linkObjs = this.sharedState.linkValues.map((link, index) => {
                return {
                    value: link,
                    active: this.displayStep === index,
                }
            });
            return linkObjs.reverse();
        },
        acquiredValue: function () {
            return this.staredState.linkValues[this.sharedState.answerStreak - 1] || 0;
        },
        // current step is allowed to exceed the number of links by 1
        // this is a wrapper around that to not exceed the last item for
        // display purposes
        displayStep: function () {
            if (this.sharedState.answerStreak === null) {
                return null;
            }
            return Math.min(this.sharedState.answerStreak, this.sharedState.linkValues.length-1);
        },
    },
    methods: {
        bankChain: function () {
            let fullChain = this.currentStep == this.links.length;

            this.bank += this.acquiredValue
            this.reset();

            if (fullChain) {
                this.endChain();
            }
        },
        endChain: function () {
            EventBus.$emit('chain:end', this.bank);
            EventBus.$emit('timer:stop');
            this.bank = 0;
            this.reset();
        },
    },
    created: function () {
        EventBus.$on('chain:bank', this.bankChain);
        EventBus.$on('timer:complete', this.endChain)
    }
});
