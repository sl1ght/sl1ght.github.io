Vue.component('generator', {
    props: {
        generator: Generator
    },
    data: function() {
        return {

        }
    },
    methods: {
        format(amount) {
            return format(amount)
        }
    },
    template: 
    `<div  @click="generator.buy()">
            <h2 style="margin-top:.5rem;">{{ generator.name}} Tier {{ generator.tier + 1}}</h2>
            <h3 style="margin: 0;">Build 1</h3>
            <span class="generator-amount">{{ format(generator.amount) }}</span> 
            <span class="generator-multiplier">x{{ format(generator.mult) }}</span> 
            <span class="generator-cost">Cost: $&#8203{{ format(generator.cost) }}</span> 
        </div>
`
})