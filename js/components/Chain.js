Vue.component('Chain', {
    props: ['links', 'progress'],
    template: `
        <ul class="pill-list list-unstyled mb-0">
            <li v-for="link in linksSorted"
                class="pill mb-3"
                :class="{active:link.active}"
            >
                {{link.value | currency}}
            </li>
        </ul>
    `,
    data: function () {
        return {
        }
    },
    computed: {
        linksSorted: function () {
            let linkObjs = this.links.map((link, index) => {
                return {
                    value: link,
                    active: this.displayStreak === index,
                }
            });
            return linkObjs.reverse();
        },
        // progress can be infinite, but we only go as far as highlighting
        // the last link in the chain
        displayStreak: function () {
            if (this.progress === null) {
                return null;
            }
            return Math.min(this.progress, this.links.length-1);
        },
    },
});
