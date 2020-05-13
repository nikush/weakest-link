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
            currentStep: 0,
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
                    active: this.displayStep == index,
                }
            });
            return linkObjs.reverse();
        },
        acquiredValue: function () {
            return this.links[this.currentStep - 1] || 0;
        },
        // current step is allowed to exceed the number of links by 1
        // this is a wrapper around that to not exceed the last item for
        // display purposes
        displayStep: function () {
            return Math.min(this.currentStep, this.links.length-1);
        },
    },
    methods: {
        incrementStep: function () {
            // allow the steps to exceed the number of links by 1
            // because players have to surpass the last link and answer
            // correctly to earn it
            if (this.currentStep < this.links.length) {
                this.currentStep++;
            }
        },
        decrementStep: function () {
            if (this.currentStep > 0) {
                this.currentStep--;
            }

        },
        reset: function () {
            this.currentStep = 0;
        },
    },
    created: function () {
        EventBus.$on('chain:forward', this.incrementStep);
        EventBus.$on('chain:backward', this.decrementStep);
        EventBus.$on('chain:reset', this.reset);
    }
});
