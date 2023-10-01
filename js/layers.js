addLayer("f", {
		name: "factorial", // This is optional, only used in a few places, If absent it just uses the layer id.
        treeType: "factorial",
		symbol: "F", // This appears on the layer's node. Default is the id with the first letter capitalized
		position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
		startData() { return {
			unlocked: true,
			points: new Decimal(0),
            total: new Decimal(0),
		}},
		color: "rgb(255,191,0)",
		requires(){return player.f.total.add(1).root(2.321928094887362).mul(0.5).div(tmp.f.buyables[13].effect)}, // Can be a function that takes requirement increases into account
		resource: "Factorials", // Name of prestige currency
		baseResource: "factorified points", // Name of resource prestige is based on
		baseAmount() {return getFactorialEquilavent()}, // Get the current amount of baseResource
		type: "static",
		exponent: 0, // Prestige currency exponent
		gainMult() { // Calculate the multiplier for main currency from bonuses
			mult = new Decimal(1)
			return mult
		},
		gainExp() { // Calculate the exponent on main currency from bonuses
			return new Decimal(1)
		},
		row: 0, // Row the layer is in on the tree (0 is the first row)
		hotkeys: [
			{key: "a", description: "F: Reset for factorials", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
		],
		layerShown(){return true},
        doReset(resettingLayer){
            if(tmp[resettingLayer].row>this.row&&tmp[resettingLayer].treeType=="factorial") layerDataReset("f")
        },
        buyables: {
            11: {
                title: "Factorial Generator",
                display(){return `Generates 1+n point per second<br><br>Amount: ${formatWhole(player[this.layer].buyables[this.id])}<br>Effect: +${format(this.effect())}<br>Cost: ${format(this.cost())} factorials`},
                cost(){return player[this.layer].buyables[this.id].add(1)},
                effect(){return player[this.layer].buyables[this.id].mul(new Decimal(1).add(player[this.layer].buyables[this.id].sub(1).div(2)))},
                canAfford(){return player.f.points.gte(this.cost())},
                buy(){
                    player.f.points = player.f.points.sub(this.cost())
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                canSellOne(){return player[this.layer].buyables[this.id].gte(1)},
                sellOne(){
                    player[this.layer].buyables[this.id]=player[this.layer].buyables[this.id].sub(1)
                    player.f.points = player.f.points.add(player[this.layer].buyables[this.id].add(1))
                    player.points = new Decimal(0)
                }
            },
            12: {
                title: "Factorial Booster",
                display(){return `Multiplies point gain by 2`+(hasUpgrade("a",13)?`.5`:``)+`x<br><br>Amount: ${formatWhole(player[this.layer].buyables[this.id])}<br>Effect: x${format(this.effect())}<br>Cost: ${format(this.cost())} factorials`},
                cost(){return player[this.layer].buyables[this.id].add(1)},
                effect(){return new Decimal(2).add(hasUpgrade("a",13)?0.5:0).pow(player[this.layer].buyables[this.id])},
                canAfford(){return player.f.points.gte(this.cost())},
                buy(){
                    player.f.points = player.f.points.sub(this.cost())
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                canSellOne(){return player[this.layer].buyables[this.id].gte(1)},
                sellOne(){
                    player[this.layer].buyables[this.id]=player[this.layer].buyables[this.id].sub(1)
                    player.f.points = player.f.points.add(player[this.layer].buyables[this.id].add(1))
                    player.points = new Decimal(0)
                },
                unlocked(){return hasAchievement("achievements","f15")}
            },
            13: {
                title: "Factorial Cheapener",
                display(){return `Cheapens Factorial by /1.15<br><br>Amount: ${formatWhole(player[this.layer].buyables[this.id])}<br>Effect: /${format(this.effect())}<br>Cost: ${format(this.cost())} factorials`},
                cost(){return player[this.layer].buyables[this.id].add(1)},
                effect(){return new Decimal(1.15).pow(player[this.layer].buyables[this.id])},
                canAfford(){return player.f.points.gte(this.cost())},
                buy(){
                    player.f.points = player.f.points.sub(this.cost())
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                canSellOne(){return player[this.layer].buyables[this.id].gte(1)},
                sellOne(){
                    player[this.layer].buyables[this.id]=player[this.layer].buyables[this.id].sub(1)
                    player.f.points = player.f.points.add(player[this.layer].buyables[this.id].add(1))
                    player.points = new Decimal(0)
                },
                unlocked(){return hasUpgrade("a",13)},
            },
        }
})

addLayer("a", {
		name: "average", // This is optional, only used in a few places, If absent it just uses the layer id.
        treeType: "factorial",
		symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
		position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
		startData() { return {
			unlocked: false,
			points: new Decimal(0),
            challengeScore: new Decimal(0),
            challengeScore2: new Decimal(0),
		}},
        update(diff){
            if(inChallenge("a",11)) player.a.challengeScore=player.a.challengeScore.max(player.f.total)
            if(inChallenge("a",12)) player.a.challengeScore2=player.a.challengeScore2.max(player.f.total)
        },
		color: "purple",
		requires(){return new Decimal(1)}, // Can be a function that takes requirement increases into account
		resource: "averagenesses", // Name of prestige currency
		baseResource: "points", // Name of resource prestige is based on
		baseAmount() {return player.points}, // Get the current amount of baseResource
		type: "normal",
		exponent: 0.5, // Prestige currency exponent
		gainMult() { // Calculate the multiplier for main currency from bonuses
			mult = new Decimal(1).mul(hasAchievement("achievements","f22")?player.f.total.sub(4).max(1).factorial():1)
			return mult
		},
        effect(){return player.a.points.add(1).log(hasUpgrade("a",22)?2:3).add(1)},
        effectDescription(){return "multiplying point gain by x"+format(this.effect())},
        canReset(){return player.f.total.gte(5)&&player.points.gte(1)},
        tooltip(){return formatWhole(player.a.points)+" averagenesses<h5>You need at least 5 total Factorials to reset"},
		gainExp() { // Calculate the exponent on main currency from bonuses
			return new Decimal(1)
		},
		row: 1, // Row the layer is in on the tree (0 is the first row)
		hotkeys: [
			{key: "a", description: "A: Reset for averagenesses", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
		],
		layerShown(){return hasAchievement("achievements", "f15")},
        branches: [["f", 1]],
        doReset(resettingLayer){
            if(tmp[resettingLayer].row>this.row&&tmp[resettingLayer].treeType=="factorial") layerDataReset("a")
        },
        upgrades: {
            11: {
                title: "Asterisk",
                description: "You gain more points based on factorified points",
                effect(){return new Decimal(0.5).add(player.points.max(1).div(new Decimal(Math.PI*2).sqrt()).ln().div(Decimal.lambertw(new Decimal(Math.E).pow(-1).mul(player.points.max(1).div(new Decimal(Math.PI*2).sqrt()).ln())))).sub(1).max(1)},
                effectDisplay(){return "x"+format(this.effect())},
                cost: new Decimal(1),
            },
            12: {
                title: "Aftermath",
                description: "Factorials boost your point gain at reduced rate",
                effect(){return player.f.total.add(1)},
                effectDisplay(){return "x"+format(this.effect())},
                cost: new Decimal(2),
            },
            13: {
                title: "Alteration",
                description: "Factorial Booster is +x0.5 stronger and unlocks 3rd Factorial buyable",
                cost: new Decimal(6),
            },
            14: {
                title: "Afterimage",
                description: "Unspent Factorials boost your point gain",
                effect(){return player.f.points.add(1).pow(1.15)},
                effectDisplay(){return "x"+format(this.effect())},
                cost: new Decimal(24),
            },
            15: {
                title: "Amalgamate",
                description: "Unlocks the challenge",
                cost: new Decimal(120),
            },
            21: {
                title: "Alert",
                description: "Averagenesses's effect divides factorial nerf",
                cost: new Decimal(720),
                unlocked(){return player.a.upgrades.length>=5},
            },
            22: {
                title: "Aforemention",
                description: "Averagenesses's effect log is nerfed<br>[3 => 2]",
                cost: new Decimal(10080),
                unlocked(){return player.a.upgrades.length>=5},
            },
            23: {
                title: "Abstract",
                description: "Your best Factorial boosts your point gain",
                effect(){return player.achievements.bestFactorial.add(1).root(1.15).root(1.15)},
                effectDisplay(){return "x"+format(this.effect())},
                cost: new Decimal(241920),
                unlocked(){return player.a.upgrades.length>=5},
            },
            24: {
                title: "Alliance",
                description: "Averagenessess boost your cookie gain at reduced rate",
                effect(){return player.a.points.add(1).log(10).add(1).root(2)},
                effectDisplay(){return "x"+format(this.effect())},
                cost: new Decimal(8709120),
                unlocked(){return player.a.upgrades.length>=5},
            },
            25: {
                title: "Affirmation",
                description: "Unlocks another challenge",
                cost: new Decimal(435456000),
                unlocked(){return player.a.upgrades.length>=5},
            }
        },
        clickables: {
            11: {
                title: "Force averagenessess reset",
                canClick: true,
                onClick(){
                    player.a.points = player.a.points.add(tmp.a.canReset?getResetGain("a"):0)
                    doReset("a", true)
                }
            }
        },
        challenges: {
            11: {
                name: "Ultra Factorial",
                challengeDescription: "Factorial nerf is factorified.",
                goalDescription(){return "Getting as much Factorials as possible<br>Current record: "+formatWhole(player.a.challengeScore)+" Factorials"},
                rewardDescription(){return "Point gain is x"+format(new Decimal(1.15).pow(player.a.challengeScore))+" better per Factorial"},
                unlocked(){return hasUpgrade("a",15)}
            },
            12: {
                name: "Double Odd Factorial",
                challengeDescription: "Factorial nerf uses double factorial function with odd series.",
                goalDescription(){return "Getting as much Factorials as possible<br>Current record: "+formatWhole(player.a.challengeScore2)+" Factorials"},
                rewardDescription(){return "Point gain is x"+format(new Decimal(1.3).pow(player.a.challengeScore2))+" better"},
                unlocked(){return hasUpgrade("a",15)}
            },
        }
})

addLayer("c", {
		name: "classic", // This is optional, only used in a few places, If absent it just uses the layer id.
        treeType: "factorial",
		symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
		position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
		startData() { return {
			unlocked: false,
			points: new Decimal(0),
            challengeScore: new Decimal(0)
		}},
        effect(){return player.c.points.add(1).pow(player.c.points.add(1))},
        effectDescription(){return `multiplying point gain by x${format(this.effect())}`},
        position: 1,
		color: "cyan",
		requires(){return new Decimal(6).add(player.c.points.mul(0.5))}, // Can be a function that takes requirement increases into account
		resource: "classicality", // Name of prestige currency
		baseResource: "fractorified points", // Name of resource prestige is based on
		baseAmount() {return getFactorialEquilavent()}, // Get the current amount of baseResource
		type: "static",
		exponent: 0, // Prestige currency exponent
		gainMult() { // Calculate the multiplier for main currency from bonuses
			mult = new Decimal(1)
			return mult
		},
        tooltipLocked(){return `Reach 12 factorified points (You have ${formatWhole(getFactorialEquilavent())} factorified points)`},
		gainExp() { // Calculate the exponent on main currency from bonuses
			return new Decimal(1)
		},
		row: 1, // Row the layer is in on the tree (0 is the first row)
		hotkeys: [
			{key: "c", description: "C: Reset for averagenesses", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
		],
        doReset(resettingLayer){
            if(tmp[resettingLayer].row>this.row&&tmp[resettingLayer].treeType=="factorial") layerDataReset("c")
        },
		layerShown(){return hasAchievement("achievements", "f34")},
        branches: [["f", 1]],
})

addLayer("bb", {
    startData(){return{
        unlocked: true,
        points: new Decimal(0),
        cookies: new Decimal(0),
        kittenLevel: new Decimal(0),
        prestiges: new Decimal(0),
    }},
    symbol: "CBB",
    color: "brown",
    type: "none",
    update(diff){
        if(hasAchievement("achievements","f16")) player.bb.points = player.points.div(new Decimal(1.1).pow(player.bb.points)).sub(50).div(50).floor().max(player.bb.points).min(player.bb.points.add(player.bb.prestiges.sub(player.bb.points.sub(50).div(50).floor().min(player.bb.prestiges)).add(1)))
        player.bb.cookies = player.bb.cookies.add(tmp.bb.buyables[11].cps.add(tmp.bb.buyables[21].cps).mul(diff))
        player.bb.kittenLevel = player.bb.kittenLevel.max(player.bb.cookies.max(1).log(1000).floor())
    },
    kittens: ["regular","black","grumpy","delicate","cookie","golden","lasagna","funny","grandma","eight-legged","omniscient","apocalyptc"],
    tabFormat: {
        "Butter Biscuit": {
            content: [["display-text", function(){return "You have <h2 style='color: brown; text-shadow: brown 0px 0px 10px;'>"+formatWhole(player.bb.points)+"</h2> butter biscuits, multiplying your point gain by x"+format(player.bb.points.mul(0.1).mul(tmp.bb.kittenPower).mul(new Decimal(1.1).pow(player.bb.prestiges)).add(1))+"<br><br>Your effecient point amount in this tree is "+format(player.points.div(new Decimal(1.1).pow(player.bb.points)))+"<br>Next butter buscuit: "+format(player.bb.points.mul(50).add(100))+" effecient points<br><br>To get your first butter biscuit, you need to exceed 100 point park, you'll gain the rest per 50 point mark. Each butter biscuit will boost your point gain by +x1.1, but nerf your effecient points by /1.1"}]]
        },
        "Cookie": {
            content: [["display-text", function(){return "You have <h2 style='color: brown; text-shadow: brown 0px 0px 10px;'>"+formatWhole(player.bb.points)+"</h2> butter biscuits, multiplying your point gain by x"+format(player.bb.points.mul(0.1).mul(tmp.bb.kittenPower).mul(new Decimal(1.1).pow(player.bb.prestiges)).add(1))+"<br><br>You currently have "+format(player.bb.cookies)+" cookies<br>Your "+tmp.bb.kittens[player.bb.kittenLevel]+" kitten makes your butter biscuits's effect and cookie gain x"+format(tmp.bb.kittenPower)+" better<br>Your kitten will get next evolution at "+formatWhole(new Decimal(1000).pow(player.bb.kittenLevel.add(1)))+" cookies<br><br>Enter the 2nd tab. This is where you'll spend your time the most in this layer. You can spend your BB to purchase Cookie Makers™, with which you can gather cookies and (eventually) evolve kittens and purchase upgrades.<br>Purchasing Cookie Makers resets your point progress."}],"blank","clickables","blank",["buyable",[11]],["buyable",[21]],"blank","upgrades"],
            unlocked(){return hasAchievement("achievements","c13")}
        },
        "Chocolate Butter Biscuit": {
            content: [["display-text", function(){return `You have <h2 style='color: brown; text-shadow: brown 0px 0px 10px'>${formatWhole(player.bb.prestiges)}</h2> chocolate butter biscuits, multiplying your butter biscuits's effect by x${format(new Decimal(1.1).pow(player.bb.prestiges))}`}],"blank",["buyable",["prestige"]],"blank",["display-text", function(){return `Welcome to the first prestige layer of this tree. Sorta. You lose all your previous progress in Cookie Tree (including your kitten) in exchange for chocolate butter biscuits, which will provide a multiplicative boost instead.`}]],
            unlocked(){return hasAchievement("achievements","c21")}
        }
    },
    kittenPower(){
        let base = new Decimal(0.1)
        let total = new Decimal(1)
        for(i=new Decimal(0);i.lt(player.bb.kittenLevel);i=i.add(1)){
            total = total.mul(base.add(1))
            base = base.add(0.025*(i+1))
        }
        return total
    },
    exponent: 0.5,
    requires: new Decimal(10),
    treeType: "cookie",
    resource: "biscuits",
    baseResource: "points",
    baseAmount(){return player.points},
    clickables: {
        11: {
            title: "<p style='transform: scale(2.6, 2)'>Awfully Long Cookie :3",
            display(){return `<p style='transform: scale(2.6, 2)'>+${format(tmp.bb.buyables[11].baseCps)} cookies per click`},
            canClick(){return true},
            onClick(){
                player.bb.cookies = player.bb.cookies.add(tmp.bb.buyables[11].baseCps)
            },
            unlocked(){return hasUpgrade("bb",11)},
            style(){return{'width':'500px','border-radius':'100%'}}
        }
    },
    universalCpSMultiplier(){
        let base = new Decimal(1)
        base = base.mul(tmp.bb.kittenPower)
        base = base.mul(hasUpgrade("a",24)?player.a.points.add(1).log(10).add(1).root(2):1)
        return base
    },
    buyables: {
        11: {
            title(){return "<h3>BB-Infused Clicker: "+formatWhole(player.bb.buyables[11])},
            baseCps(){return new Decimal(1).mul(hasUpgrade("bb",11)?1.5:1).mul(hasUpgrade("bb",12)?player.bb.points.mul(0.1).mul(tmp.bb.kittenPower).mul(new Decimal(1.1).pow(player.bb.prestiges)).add(1):1).mul(tmp.bb.universalCpSMultiplier)},
            cps(){return this.baseCps().mul(player.bb.buyables[11])},
            display(){return "<h2>Cost: "+formatWhole(this.cost())+" butter biscuits<br>CpS: "+format(this.cps())+" ("+format(this.baseCps())+"/s)"},
            canAfford(){return player.bb.points.gte(this.cost())},
            buy(){
                player.points = new Decimal(0)
                player.bb.points = player.bb.points.sub(this.cost())
                player.bb.buyables[11] = player.bb.buyables[11].add(1)
            },
            cost(){return player.bb.buyables[11].pow(2).add(15)},
            style(){return{'height':'80px','width':'288px','background-color':(this.canAfford()?'gray':''),'border-radius':'10px','border':'5px solid','border-color':'rgba(0,0,0,0.125)'}}
        },
        21: {
            title(){return "<h3>Average Cookie Enjoyer: "+formatWhole(player.bb.buyables[21])},
            baseCps(){return new Decimal(15).mul(tmp.bb.universalCpSMultiplier)},
            cps(){return this.baseCps().mul(player.bb.buyables[21])},
            display(){return "<h2>Cost: "+formatWhole(this.cost())+" butter biscuits<br>CpS: "+format(this.cps())+" ("+format(this.baseCps())+"/s)"},
            canAfford(){return player.bb.points.gte(this.cost())},
            buy(){
                player.points = new Decimal(0)
                player.bb.points = player.bb.points.sub(this.cost())
                player.bb.buyables[21] = player.bb.buyables[21].add(1)
            },
            cost(){return player.bb.buyables[21].pow(2).add(40)},
            unlocked(){return hasAchievement("achievements","c16")},
            style(){return{'height':'80px','width':'288px','background-color':(this.canAfford()?'gray':''),'border-radius':'10px','border':'5px solid','border-color':'rgba(0,0,0,0.125)'}}
        },
        prestige: {
			display(){return `<span style='font-family:"Inconsolata", monospace, bold; font-size: 1.333em'>Reset for +1 chocolate butter biscuit<br><br>Req: ${format(player.bb.points)} / ${format(player.bb.prestiges.mul(50).add(100))} butter biscuits`},
			canAfford() { return player.bb.points.gte(player.bb.prestiges.mul(50).add(100)) },
			buy() {
                let gain = player.bb.prestiges.add(1)
				layerDataReset("bb")
                player.points = new Decimal(0)
                player.bb.prestiges = gain
			},
			style(){return{"border-radius":"25%",'height':'120px', 'width':'180px', 'border': '4px solid', 'border-color': 'rgba(0, 0, 0, 0.125)','background-color':(this.canAfford()?'brown':'')}},
			unlocked(){return true}
		},
    },
    upgrades: {
        11: {
            title: "Clicker Enhancing Mechanic",
            description: "BB-Infused Clicker is x1.5 stronger and you unlock manual clicking",
            cost: new Decimal(100),
			currencyInternalName: "cookies",
			currencyDisplayName: "cookies",
			currencyLayer: "bb",
        },
        12: {
            title: "Cookie BB Synergy",
            description: "BB-Infused Clicker's base is multiplied by your butter biscuits",
            cost: new Decimal(2000),
			currencyInternalName: "cookies",
			currencyDisplayName: "cookies",
			currencyLayer: "bb",
            unlocked(){return hasUpgrade("bb",11)}
        },
        13: {
            title: "Grandma's Assistance",
            description: "Your cookies multiply point gain at reduced rate",
            effect(){return player.bb.cookies.add(1).log(10).add(1).root(2)},
            effectDisplay(){return "x"+format(this.effect())},
            cost: new Decimal(35000),
			currencyInternalName: "cookies",
			currencyDisplayName: "cookies",
			currencyLayer: "bb",
            unlocked(){return hasUpgrade("bb",12)}
        },
    },
})

addLayer("achievements", {
    startData(){
        return{
            unlocked: true,
            points: new Decimal(0),
            bestFactorial: new Decimal(0)
        }
    },
    symbol: "A",
    resource: "achievements",
    row: "side",
    update(diff){
        player.achievements.bestFactorial = player.achievements.bestFactorial.max(player.f.total)
    },
    tabFormat: {
        "Factorial Tree": {
            content: ["main-display", ["row",[["achievement", ["f11"]],["achievement", ["f12"]],["achievement", ["f13"]],["achievement", ["f14"]],["achievement", ["f15"]],["achievement", ["f16"]]]],["row",[["achievement", ["f21"]],["achievement", ["f22"]],["achievement", ["f23"]],["achievement", ["f24"]],["achievement", ["f25"]],["achievement", ["f26"]]]],["row",[["achievement", ["f31"]],["achievement", ["f32"]],["achievement", ["f33"]],["achievement", ["f34"]],["achievement", ["f35"]],["achievement", ["f36"]]]],["row",[["achievement", ["f41"]],["achievement", ["f42"]],["achievement", ["f43"]],["achievement", ["f44"]],["achievement", ["f45"]],["achievement", ["f46"]]]],["achievement", ["f51"]]],
            unlocked(){return hasAchievement("achievements","f16")},
        },
        "Cookie Tree": {
            content: ["main-display", ["row",[["achievement", ["c11"]],["achievement", ["c12"]],["achievement", ["c13"]],["achievement", ["c14"]],["achievement", ["c15"]],["achievement", ["c16"]]]],["row",[["achievement", ["c21"]],["achievement", ["c22"]],["achievement", ["c23"]],["achievement", ["c24"]],["achievement", ["c25"]],["achievement", ["c26"]]]],["row",[["achievement", ["c31"]],["achievement", ["c32"]],["achievement", ["c33"]],["achievement", ["c34"]],["achievement", ["c35"]],["achievement", ["c36"]]]]],
            unlocked(){return hasAchievement("achievements","f16")},
        },
    },
    achievements: {
        f11:{
            name: "The rules are very simple",
            tooltip: "Get 1 Factorial",
            done(){return player.f.total.gte(1)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
        },       
        f12:{
            name: "You need to reach a certain amount of fractorified points",
            tooltip: "Get 2 Factorials",
            done(){return player.f.total.gte(2)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f11")}
        },       
        f13:{
            name: "And perform a Factorial reset to purchase buyables with Factorials",
            tooltip: "Get 3 Factorials",
            done(){return player.f.total.gte(3)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f12")}
        },        
        f14:{
            name: "Factorials will be harder to get as you progress",
            tooltip: "Get 4 Factorials",
            done(){return player.f.total.gte(4)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f13")}
        },       
        f15:{
            name: "That's all I have to say, good luck!<h5>(selling factorial buyables resets your progress, that's all i have to say for real)",
            tooltip: "Get 5 Factorials<br>Reward: Unlocks new content",
            done(){return player.f.total.gte(5)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f14")}
        },   
        f16:{
            name: "Limit Break",
            tooltip: "Ascend once<br>Reward: Reveals this tree's gimmick mechanic",
            done(){return player.a.unlocked},
            onComplete(){player.achievements.points = player.achievements.points.add(1)},
            unlocked(){return hasAchievement("achievements","f15")}
        },
        f21:{
            name: "Probably shouldn't have done that",
            tooltip: "Get 6 Factorials",
            done(){return player.f.total.gte(6)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f16")}
        },
        f22:{
            name: "At last, I've found that DAMN 7th Factorial!",
            tooltip: "Get 7 Factorials<br>Reward: You gain my averagenessess based on Factorials, starting from 6th Factorial<br>[(F-5)!]",
            done(){return player.f.total.gte(7)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f21")||hasAchievement("achievements","f22")}
        },
        f23:{
            name: "Antimatter Dimensions? Really? It's been 7 years!",
            tooltip: "Get 8 Factorials<br>Reward: 1.5x point gain per completed row",
            done(){return player.f.total.gte(8)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f22")}
        },
        f24:{
            name: "Full Ascension Package",
            tooltip: "Purchase 5 A upgrades<br>Reward: Unlocks 2nd row of Factorial upgrades",
            done(){return player.a.upgrades.length>=5},
            onComplete(){player.achievements.points = player.achievements.points.add(1)},
            unlocked(){return hasAchievement("achievements","f23")}
        },
        f25:{
            name: "It almost like I'm wearing nothng at all.<h5>(Nothing at all.)",
            tooltip: "Get 9 Factorials",
            done(){return player.f.total.gte(9)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f23")}
        },
        f26:{
            name: "NO NEW LAYER?",
            tooltip: "Get 10 Factorials",
            done(){return player.f.total.gte(10)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f25")}
        },
        f31:{
            name: "It only gets worse from here now on",
            tooltip: "Get 11 Factorials",
            done(){return player.f.total.gte(11)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f26")}
        },
        f32:{
            name: "Enter the 3D",
            tooltip: "Get 12 Factorials<br>Reward: Point gain is tripled when you have less than one point",
            done(){return player.f.total.gte(12)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f31")}
        },
        f33:{
            name: "If not me, then who will?",
            tooltip: "Get 13 Factorials",
            done(){return player.f.total.gte(13)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f32")}
        },
        f34:{
            name: "???",
            tooltip: "Reach 10 factorified points<br>Reward: Unlocks new layer in Factorial Tree",
            done(){return getFactorialEquilavent().gte(10)},
            onComplete(){player.achievements.points = player.achievements.points.add(1)},
            unlocked(){return hasAchievement("achievements","f33")}
        },
        f35:{
            name: "haha get it the skeppy numbah laugh now",
            tooltip: "Get 14 Factorials",
            done(){return player.f.total.gte(14)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f33")}
        },
        f36:{
            name: "A solid number",
            tooltip: "Get 15 Factorials",
            done(){return player.f.total.gte(15)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f35")}
        },
        f41:{
            name: "Back to the roots, aren't we?",
            tooltip: "Get 1 classicality",
            done(){return player.c.points.gte(1)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f34")}
        },
        f42:{
            name: "2!^2!",
            tooltip: "Get 16 Factorials",
            done(){return player.f.total.gte(16)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f36")}
        },
        f43:{
            name: "Classical Frenzy",
            tooltip: "Get 2 classicalities",
            done(){return player.c.points.gte(2)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f41")}
        },
        f44:{
            name: "Perhaps we shouldn't have assigned achievements to Factorials",
            tooltip: "Get 18 Factorials",
            done(){return player.f.total.gte(18)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f42")}
        },
        f45:{
            name: "Mortar Classification",
            tooltip: "Get 5 classicalities",
            done(){return player.c.points.gte(5)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f43")}
        },
        f46:{
            name: "fuck the inflation, all my homies hate it",
            tooltip: "Reach 20 factorified points",
            done(){return getFactorialEquilavent().gte(20)},
            onComplete(){player.achievements.points = player.achievements.points.add(1)},
            unlocked(){return hasAchievement("achievements","f44")||hasAchievement("achievements","f45")}
        },
        f51:{
            name: "???",
            tooltip: "Get 13 classicalities<br>[ENDGAME]",
            done(){return player.c.points.gte(13)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f45")||hasAchievement("achievements","f46")}
        },
        c11:{
            name: "where cookie clicker",
            tooltip: "Get your first butter biscuit",
            done(){return player.bb.points.gte(1)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
        },
        c12:{
            name: "Is this nerf doing anything, really?",
            tooltip: "Reach 5 butter biscuits",
            done(){return player.bb.points.gte(5)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c11")}
        },
        c13:{
            name: "Subversion 101",
            tooltip: "Reach 15 butter biscuits<br>Reward: Unlocks new tab in CBB layer",
            done(){return player.bb.points.gte(15)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c12")}
        },
        c14:{
            name: "Grandma is so proud of you",
            tooltip: "Reach 100 cookies",
            done(){return player.bb.cookies.gte(100)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c13")}
        },
        c15:{
            name: "Do not milk the kitten",
            tooltip: "Reach 1,000 cookies",
            done(){return player.bb.cookies.gte(1000)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c14")}
        },
        c16:{
            name: "At last, my OCs is canon in this tree!",
            tooltip: "Reach 50 butter biscuits<br>Reward: Unlocks new butter biscuit buyable",
            done(){return player.bb.points.gte(50)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c14")}
        },
        c21:{
            name: "Recursive Economy",
            tooltip: "Reach 100 butter biscuits<br>Reward: ???",
            done(){return player.bb.points.gte(100)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c16")}
        },
    },
})