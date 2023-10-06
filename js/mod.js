let modInfo = {
	name: "Oleg's Nostalgic Tree",
	id: "myolegtest1",
	author: "nobody",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (1), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.3",
	name: "7 FPS Simulation",
}

function getFactorialEquilavent(){
    return new Decimal(0.5).add(player.points.max(1).div(new Decimal(Math.PI*2).sqrt()).ln().div(Decimal.lambertw(new Decimal(Math.E).pow(-1).mul(player.points.max(1).div(new Decimal(Math.PI*2).sqrt()).ln())))).sub(1).max(1)
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.3: 7 FPS Simulation</h3><br>
		- All achievements have been properly named<br>
        - Pushed the endgame up to 52 factorified points
        - help me i can't properly balance beyond 50 factorified points with those lags<br>
	<h3>v0.2: A little bit better</h3><br>
		- Renamed "The Personalized Tree" to "Oleg's Nostalgic Tree"<br>
		- Fixed various bugs<br>
		- Rebalanced everything due aforementioned bugs<br>
		- Stylized each tree in their own way<br>
		- Added Upgrade Tree<br>
		- Added Paradox Tree<br>
	<h3>v0.1: Literally nothing</h3><br>
		- Added Factorial Tree<br>
		- Added Cookie Tree`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!

function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = tmp.f.buyables[11].effect
    gain = gain.mul(tmp.f.buyables[12].effect)
    
    gain = gain.mul(tmp.a.effect)
    gain = gain.mul(hasUpgrade("a",11)?getFactorialEquilavent():1)
    gain = gain.mul(hasUpgrade("a",12)?upgradeEffect("a",12):1)
    gain = gain.mul(hasUpgrade("a",14)?upgradeEffect("a",14):1)
    gain = gain.mul(hasUpgrade("a",23)?player.achievements.bestFactorial:1)
    
    gain = gain.div(
        inChallenge("a",12) ?
        player.f.total.mul(2).add(1).factorial().div(hasUpgrade("a",22)?tmp.a.effect.root(1.69):1) :
        inChallenge("a",11) ?
        player.f.total.add(1).factorial().factorial().div(hasUpgrade("a",22)?tmp.a.effect.root(1.69):1) :
        player.f.total.add(1).factorial().div(hasUpgrade("a",22)?tmp.a.effect.root(1.69):1)
    )
    gain = gain.mul(new Decimal(1.15).pow(player.a.challengeScore).pow(player.f.total))
    gain = gain.mul(new Decimal(1.3).pow(player.a.challengeScore2))
    gain = gain.mul(hasAchievement("achievements","f23")?new Decimal(1.5).pow(bingoAttemptTwo()):1)
    gain = gain.mul(player.points.lt(1)&&hasAchievement("achievements","f32")?3:1)
    
    
    if(hasAchievement("achievements","f16")) gain = gain.mul(player.bb.points.mul(0.1).mul(tmp.bb.kittenPower).mul(new Decimal(1.1).pow(player.bb.prestiges)).add(1))
    if(hasUpgrade("bb",13)) gain = gain.mul(player.bb.cookies.add(1).log(10).add(1).root(2))
    if(hasUpgrade("bb",32)) gain = gain.mul(tmp.bb.buyables[11].cps.root(3).add(tmp.bb.buyables[21].cps.root(3)).add(tmp.bb.buyables[31].cps.root(3)).add(1).root(3))
    if(hasMilestone("cookie",0)) gain = gain.mul(tmp.t.teaEffect)
        
    if(hasAchievement("achievements","f34")) gain = gain.mul(tmp.c.effect)
        
    if(hasUpgrade("u",11)) gain = gain.mul(tmp.u.effect)
    if(hasUpgrade("wu",11)) gain = gain.mul(6)
    if(hasUpgrade("wu",12)) gain = gain.mul(9)
    if(hasUpgrade("wu",13)) gain = gain.mul(6)
    if(hasUpgrade("wu",14)) gain = gain.mul(9)
        
    if(hasAchievement("achievements","f53")) gain = gain.mul(tmp.p.effect)
        
    gain = gain.mul(tmp.tf.effect)
    
    for(i=2;gain.gte(new Decimal(10*i).factorial());i++){
        gain = gain.pow(1/i).mul(new Decimal(10*i).factorial().pow(new Decimal(1).sub(1/i)))
    }
    return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
    function(){return (player.f.total.gte(1)||hasUpgrade("a",22)?`Your total Factorials is dividing point gain by /${format(inChallenge("a",12)?player.f.total.mul(2).add(1).factorial().div(hasUpgrade("a",22)?tmp.a.effect.root(1.69):1):inChallenge("a",11)?player.f.total.add(1).factorial().factorial().div(hasUpgrade("a",22)?tmp.a.effect.root(1.69):1):player.f.total.add(1).factorial().div(hasUpgrade("a",22)?tmp.a.effect.root(1.69):1))}`:``)+(getPointGen().gte(new Decimal(20).factorial())?`<br>Your point gain has been softcapped to the power of 1/`+(getPointGen().gte(new Decimal(80).factorial())?8:getPointGen().gte(new Decimal(70).factorial())?7:getPointGen().gte(new Decimal(60).factorial())?6:getPointGen().gte(new Decimal(50).factorial())?5:getPointGen().gte(new Decimal(40).factorial())?4:getPointGen().gte(new Decimal(30).factorial())?3:2)+`!`:``)}
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}

function bingoAttemptTwo() {
    let x = new Decimal(0)
    let y = new Decimal(0)
    let z = new Decimal(0)
    let w = new Decimal(0)
    let totalSum = new Decimal(0)
    for(i=1;i<99;i++){
        for(v=1;v<7;v++){
            if(hasAchievement("achievements", "f"+(v+(i*10)))) x=x.add(1)
            if(hasAchievement("achievements", "c"+(v+(i*10)))) y=y.add(1)
            if(hasAchievement("achievements", "u"+(v+(i*10)))) z=z.add(1)
            if(hasAchievement("achievements", "p"+(v+(i*10)))) w=w.add(1)
        }
        if(x.gte(6)){
            totalSum=totalSum.add(1)
            x=new Decimal(0)
        }
        if(y.gte(6)){
            totalSum=totalSum.add(1)
            y=new Decimal(0)
        }
        if(z.gte(6)){
            totalSum=totalSum.add(1)
            z=new Decimal(0)
        }
        if(w.gte(6)){
            totalSum=totalSum.add(1)
            w=new Decimal(0)
        }
    }
    return new Decimal(1)
}

function paradoxAch() {
    let x = new Decimal(0)
    for(i=1;i<3;i++){
        for(v=1;v<7;v++){
            if(hasAchievement("achievements", "p"+(v+(i*10)))) x=x.add(1)
        }
    }
    return x
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}