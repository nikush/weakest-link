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
            sharedState: Game.state,
        }
    },
    computed: {
        linksSorted: function () {
            let linkObjs = this.sharedState.linkValues.map((link, index) => {
                return {
                    value: link,
                    active: this.displayStreak === index,
                }
            });
            return linkObjs.reverse();
        },
        // answer streak can be infinite, but we only go as far as highlighting
        // the last link in the chain
        displayStreak: function () {
            if (this.sharedState.answerStreak === null) {
                return null;
            }
            return Math.min(this.sharedState.answerStreak, this.sharedState.linkValues.length-1);
        },
    },
});
