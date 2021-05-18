Vue.component('add-generator-button', {
    props: {
        target: String 
    },
    methods: {
        format(amount) {
            return format(amount)
        },
        addGenerator() {
            if (player.graphics < this.tierCost()) return
            player.graphics -= this.tierCost()
            player[this.target].push(createGenerator(player[this.target].length, this.target))
        },
        tierCost() {
            return Math.pow(10, player[this.target].length * (player[this.target].length + 1) * getColumn(this.target))
        }
    },
    template: 
    `
    <button style="margin-top:0;" @click="addGenerator()">+1 Tier, costs {{ format(tierCost()) }} power</button>
    `
})