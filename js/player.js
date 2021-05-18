var player = {
    money: 10,
    graphics: 0,
    blood: 0,
    marketing: [],
    artists: [],
    evil: [],
    lastUpdate: Date.now()
}

var firstMarketing = {
    tier: 0,
    cost: 10,
    mult: 1,
    amount: 0,
    bought: 0,
    name: "Miner"
}

var firstArtist = {
    tier: 0,
    cost: 30,
    mult: 1,
    amount: 0,
    bought: 0,
    name: "Power Generator"
}

var firstEvil = {
    tier: 0,
    cost: 100000000,
    mult: 1,
    amount: 0,
    bought: 0,
    name: "Evil Extractor"
}

player.marketing.push(new Generator(firstMarketing))
player.artists.push(new Generator(firstArtist))
player.evil.push(new Generator(firstEvil))
