let modInfo = {
	name: "The Personalized Tree",
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
	num: "0.1",
	name: "Literally nothing",
}

function getFactorialEquilavent(){
    return new Decimal(0.5).add(player.points.max(1).div(new Decimal(Math.PI*2).sqrt()).ln().div(Decimal.lambertw(new Decimal(Math.E).pow(-1).mul(player.points.max(1).div(new Decimal(Math.PI*2).sqrt()).ln())))).sub(1).max(1)
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.1</h3><br>
		- Added Factorial Tree.<br>
		- Added Cookie Tree.`

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
        player.f.total.mul(2).add(1).factorial().div(hasUpgrade("a",21)?player.a.points.add(1).log(3).add(1):1) :
        inChallenge("a",11) ?
        player.f.total.add(1).factorial().factorial().div(hasUpgrade("a",21)?player.a.points.add(1).log(3).add(1):1) :
        player.f.total.add(1).factorial().div(hasUpgrade("a",21)?player.a.points.add(1).log(3).add(1):1)
    )
    gain = gain.mul(new Decimal(1.15).pow(player.a.challengeScore).pow(player.f.total))
    gain = gain.mul(new Decimal(1.3).pow(player.a.challengeScore2))
    gain = gain.mul(hasAchievement("achievements",24)?new Decimal(1.5).pow(bingoAttemptTwo()):1)
    gain = gain.mul(player.points.lt(1)&&hasAchievement("achievements",32)?3:1)
    
    if(hasAchievement("achievements","f16")) gain = gain.mul(player.bb.points.mul(0.1).mul(tmp.bb.kittenPower).mul(new Decimal(1.1).pow(player.bb.prestiges)).add(1))
    if(hasUpgrade("bb",13)) gain = gain.mul(player.bb.cookies.add(1).log(10).add(1).root(2))
        
    if(hasAchievement("achievements","f34")) gain = gain.mul(tmp.c.effect)
    if(getFactorialEquilavent().gte(20)||gain.gte(new Decimal(20).factorial())) gain = gain.pow(0.5).times(new Decimal(20).factorial().pow(Decimal.sub(1, 0.5)))
    return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
    function(){return (player.f.total.gte(1)||hasUpgrade("a",21)?`Your total Factorials is dividing point gain by /${format(inChallenge("a",12)?player.f.total.mul(2).add(1).factorial().div(hasUpgrade("a",21)?player.a.points.add(1).log(3).add(1):1):inChallenge("a",11)?player.f.total.add(1).factorial().factorial().div(hasUpgrade("a",21)?player.a.points.add(1).log(3).add(1):1):player.f.total.add(1).factorial().div(hasUpgrade("a",21)?player.a.points.add(1).log(3).add(1):1))}`:``)+(getFactorialEquilavent().gte(20)?`<br>Your point gain has been softcapped to the power of 1/2!`:``)}
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}

function bingoAttemptTwo() {
    let x = new Decimal(0)
    let totalSum = new Decimal(0)
    for(i=1;i<5;i++){
        for(v=1;v<7;v++){
            if(hasAchievement("achievements", "f"+(v+(i*10)))) x=x.add(1)
        }
        if(x.gte(6)){
            totalSum=totalSum.add(1)
            x=new Decimal(0)
        }
    }
    for(i=1;i<2;i++){
        for(v=1;v<7;v++){
            if(hasAchievement("achievements", "c"+(v+(i*10)))) x=x.add(1)
        }
        if(x.gte(6)){
            totalSum=totalSum.add(1)
            x=new Decimal(0)
        }
    }
    return totalSum
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