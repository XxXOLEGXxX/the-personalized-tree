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
        nodeStyle(){return {"border": "5px solid", "border-color": "rgba(255,0,0,0.25)","border-radius":"33%"}},
		color: "rgb(244,224,85)",
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
			{key: "f", description: "F: Reset for factorials", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
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
        nodeStyle(){return {"border": "5px solid", "border-color": "rgba(0,0,0,0.25)","border-radius":"33%"}},
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
            if(hasUpgrade("bb",32)) mult = mult.mul(tmp.bb.buyables[11].cps.add(tmp.bb.buyables[21].cps).add(tmp.bb.buyables[31].cps).add(1))
			return mult
		},
        effect(){return player.a.points.add(1).log(hasUpgrade("a",21)?2:3).add(1)},
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
                title: "Aforemention",
                description: "Averagenessess's effect log is nerfed<br>[3 => 2]",
                cost: new Decimal(720),
                unlocked(){return player.a.upgrades.length>=5},
            },
            22: {
                title: "Alert",
                description: "Averagenessess's effect divides factorial nerf at reduced rate",
                effect(){return tmp.a.effect.root(1.69)},
                effectDisplay(){return "x"+format(this.effect())},
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
                unlocked(){return hasUpgrade("a",25)}
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
            state: 0,
		}},
        nodeStyle(){return {"border": "5px solid", "border-color": "rgba(0,0,0,0.25)","border-radius":"33%"}},
        tabFormat: ["main-display","prestige-button","resource-display",["display-text", function(){return hasAchievement("achievements", "f46")?`Your Classicality's incremental increase in boost is +${format(tmp.c.clickables[player.c.state].effect)} stronger`:``}],"blank","clickables"],
        effect(){
            let uhh = new Decimal(1)
            let ahh = new Decimal(2).add(tmp.c.clickables[player.c.state].effect)
            for(i=0;i<player.c.points;i++){
                uhh = uhh.add(ahh)
                ahh = ahh.add(1).add(tmp.c.clickables[player.c.state].effect)
            }
            return uhh
        },
        effectDescription(){return `multiplying point gain by x${format(this.effect())}`},
        position: 1,
		color: "rgb(142,234,198)",
		requires(){return new Decimal(6).add(player.c.points.mul(0.5)).div(hasUpgrade("bb",21)?new Decimal(1.1).pow(player.bb.prestiges):1)}, // Can be a function that takes requirement increases into account
		resource: "classicality", // Name of prestige currency
		baseResource: "fractorified points", // Name of resource prestige is based on
		baseAmount() {return getFactorialEquilavent()}, // Get the current amount of baseResource
		type: "static",
		exponent: 0, // Prestige currency exponent
		gainMult() { // Calculate the multiplier for main currency from bonuses
			mult = new Decimal(1)
			return mult
		},
        clickables: {
            0: {
                effect: 0
            },
            11: {
                title: "Increase incremental based on factorified points",
                effect(){return getFactorialEquilavent().add(hasAchievement("achievements","f56")?player.u.points:0).div(10)},
                canClick: true,
                onClick(){player.c.state = 11},
                unlocked(){return hasAchievement("achievements","f46")}
            },
            12: {
                title: "Increase incremental based on averagenesses",
                effect(){return player.a.points.add(1).log(10).div(10)},
                canClick: true,
                onClick(){player.c.state = 12},
                unlocked(){return hasAchievement("achievements","f46")}
            },
            13: {
                title: "Increase incremental based on classifications",
                effect(){return player.c.points.div(10)},
                canClick: true,
                onClick(){player.c.state = 13},
                unlocked(){return hasAchievement("achievements","f46")}
            },
            14: {
                title: "Increase incremental based on points",
                effect(){return player.points.add(1).log(10).add(hasAchievement("achievements","f56")?player.u.points:0).div(10)},
                canClick: true,
                onClick(){player.c.state = 14},
                unlocked(){return hasAchievement("achievements","f46")}
            },
        },
        tooltipLocked(){return `Reach 12 factorified points (You have ${formatWhole(getFactorialEquilavent())} factorified points)`},
		gainExp() { // Calculate the exponent on main currency from bonuses
			return new Decimal(1)
		},
		row: 1, // Row the layer is in on the tree (0 is the first row)
		hotkeys: [
			{key: "c", description: "C: Reset for classicality", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
		],
        doReset(resettingLayer){
            if(tmp[resettingLayer].row>this.row&&tmp[resettingLayer].treeType=="factorial") layerDataReset("c")
        },
		layerShown(){return hasAchievement("achievements", "f36")},
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
    nodeStyle(){return player.bb.points.gte(450) ?
        {'height':'113.3333333px','border-radius':'6.666666666px','border': '20px solid',"font-size":"32px","border-color": "rgb(193,146,64)","background-color": "rgb(252,125,33)", "color": "rgb(236,24,23)","box-shadow":"rgb(102,254,91) 0px 0px 6.666666666px"} : 
        player.bb.points.gte(400) ?
        {'height':'113.3333333px','border-radius':'6.666666666px','border': '20px solid',"font-size":"32px","border-color": "rgb(255,255,255)","background-color": "rgb(217,66,99)", "color": "rgb(199,20,23)"} : 
        player.bb.points.gte(350) ?
        {'height':'113.3333333px','border-radius':'6.666666666px','border': '20px solid',"font-size":"32px","border-color": "rgb(232,213,120)","background-color": "rgb(211,193,188)", "color": "rgb(143,128,119)"} : 
        player.bb.points.gte(300) ?
        {'height':'113.3333333px','border-radius':'6.666666666px','border': '20px solid',"font-size":"32px","border-color": "rgb(255,237,185)","background-color": "rgb(65,78,125)", "color": "rgb(17,45,63)"} : 
        player.bb.points.gte(250) ?
        {'height':'113.3333333px','border-radius':'6.666666666px','border': '20px solid',"font-size":"32px","border-color": "rgb(126,90,64)","background-color": "rgb(202,19,10)", "color": "rgb(69,1,16)"} : 
        player.bb.points.gte(200) ?
        {'height':'113.3333333px','border-radius':'6.666666666px','border': '20px solid',"font-size":"32px","border-color": "rgb(221,180,102)","background-color": "rgb(225,192,150)", "color": "rgb(197,135,80)"} : 
        player.bb.points.gte(150) ?
        {'height':'113.3333333px','border-radius':'6.666666666px','border': '20px solid',"font-size":"32px","border-color": "rgb(221,180,102)","background-color": "rgb(67,45,42)", "color": "rgb(52,21,23)"} : 
        player.bb.points.gte(100) ?
        {'height':'113.3333333px','border-radius':'6.666666666px','border': '20px solid',"font-size":"32px","border-color": "rgb(225,177,109)","background-color": "rgb(103,35,17)", "color": "rgb(80,11,0)"} : 
        player.bb.points.gte(50) ?
        {'height':'113.3333333px','border-radius':'6.666666666px','border': '20px solid',"font-size":"32px","border-color": "rgb(52,12,2)","background-color": "rgb(195,147,56)", "color": "rgb(165,66,31)"} : 
        {'height':'113.3333333px','border-radius':'6.666666666px','border': '20px solid',"font-size":"32px","border-color": "rgb(52,12,2)","background-color": "rgb(195,147,56)", "color": "rgb(131,64,20)"}
    },
    symbol: "CBB",
    type: "none", 
    update(diff){
        if(hasAchievement("achievements","f16")) player.bb.points = player.points.div(new Decimal(1.1).pow(player.bb.points)).sub(50).div(50).floor().max(player.bb.points).min(player.bb.points.add(player.bb.prestiges.sub(player.bb.points.sub(50).div(50).floor().min(player.bb.prestiges)).add(1)))
        player.bb.cookies = player.bb.cookies.add(tmp.bb.buyables[11].cps.add(tmp.bb.buyables[21].cps).add(tmp.bb.buyables[31].cps).mul(diff))
        player.bb.kittenLevel = player.bb.kittenLevel.max(hasUpgrade("bb",22)?player.bb.cookies.max(1).log(100).floor():player.bb.cookies.max(1).log(1000).floor())
    },
    kittens: ["regular","black","grumpy","delicate","cookie","golden","lasagna","funny","grandma","eight-legged","omniscient","apocalyptc"],
    tabFormat: {
        "Butter Biscuit": {
            content: [["display-text", function(){return "You have <h2 style='color: brown; text-shadow: brown 0px 0px 10px;'>"+formatWhole(player.bb.points)+"</h2> butter biscuits, multiplying your point gain by x"+format(player.bb.points.mul(0.1).mul(tmp.bb.kittenPower).mul(new Decimal(1.1).pow(player.bb.prestiges)).add(1))+"<br><br>Your effecient point amount in this tree is "+format(player.points.div(new Decimal(1.1).pow(player.bb.points)))+"<br>Next butter buscuit: "+format(player.bb.points.mul(50).add(100))+" effecient points<br><br>To get your first butter biscuit, you need to exceed 100 point park, you'll gain the rest per 50 point mark. Each butter biscuit will boost your point gain by +x1.1, but nerf your effecient points by /1.1"}]],
            buttonStyle(){return{"border-color": "rgb(225,177,109)","background-color": "rgb(103,35,17)", "color": "rgb(208,132,94)"}}
        },
        "Cookie": {
            content: [["display-text", function(){return "You have <h2 style='color: brown; text-shadow: brown 0px 0px 10px;'>"+formatWhole(player.bb.points)+"</h2> butter biscuits, multiplying your point gain by x"+format(player.bb.points.mul(0.1).mul(tmp.bb.kittenPower).mul(new Decimal(1.1).pow(player.bb.prestiges)).add(1))+"<br><br>You currently have "+format(player.bb.cookies)+" cookies<br>Your "+tmp.bb.kittens[player.bb.kittenLevel]+" kitten makes your butter biscuits's effect and cookie gain x"+format(tmp.bb.kittenPower)+" better<br>Your kitten will get next evolution at "+formatWhole(new Decimal(hasUpgrade("bb",22)?100:1000).pow(player.bb.kittenLevel.add(1)))+" cookies<br><br>Enter the 2nd tab. This is where you'll spend your time the most in this layer. You can spend your BB to purchase Cookie Makers™, with which you can gather cookies and (eventually) evolve kittens and purchase upgrades.<br>Purchasing Cookie Makers resets your point progress."}],"blank","clickables","blank",["buyable",[11]],["buyable",[21]],["buyable",[31]],"blank",["upgrades",[1,3]]],
            buttonStyle(){return{"border-color": "rgb(52,12,2)","background-color": "rgb(195,147,56)", "color": "rgb(131,64,20)"}},
            unlocked(){return hasAchievement("achievements","c16")}
        },
        "Chocolate Butter Biscuit": {
            content: [["display-text", function(){return `You have <h2 style='color: brown; text-shadow: brown 0px 0px 10px'>${formatWhole(player.bb.prestiges)}</h2> chocolate butter biscuits, multiplying your butter biscuits's effect by x${format(new Decimal(1.1).pow(player.bb.prestiges))}`}],"blank",["buyable",["prestige"]],"blank",["display-text", function(){return `Welcome to the first prestige layer of this tree. Sorta. You lose all your previous progress in Cookie Tree (including your kitten) in exchange for chocolate butter biscuits, which will provide a multiplicative boost instead.`}],"blank",["upgrades",[2]]],
            buttonStyle(){return{"border-color": "rgb(225,177,109)","background-color": "rgb(103,35,17)", "color": "rgb(208,132,94)"}},
            unlocked(){return hasAchievement("achievements","c31")}
        }
    },
    kittenPower(){
        let base = new Decimal(hasUpgrade("bb",22)?0.15:0.1)
        let total = new Decimal(1)
        for(i=new Decimal(0);i.lt(player.bb.kittenLevel);i=i.add(1)){
            total = total.mul(base.add(1))
            base = base.add((hasUpgrade("bb",22)?0.025:0.025)*(i+1))
        }
        return total
    },
    totalBuildingsBoost(){
        let eff = new Decimal(1)
        if(hasAchievement("achievements","c33")&&hasAchievement("achievements","c35")) eff = eff.add(0.3)
        if(hasAchievement("achievements","c35")) eff = eff.add(0.3)
        if(hasAchievement("achievements","c43")&&hasAchievement("achievements","c35")) eff = eff.add(0.3)
        return eff
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
            style(){return{'width':'500px','border-radius':'100%', "border":"14.70588235px solid","border-color": "rgb(52,12,2)","background-color": "rgb(195,147,56)", "color": "rgb(52,12,2)"}}
        }
    },
    universalCpSMultiplier(){
        let base = new Decimal(1)
        base = base.mul(tmp.bb.kittenPower)
        base = base.mul(hasUpgrade("a",24)?player.a.points.add(1).log(10).add(1).root(2):1)
        base = base.mul(hasUpgrade("bb",31)?player.u.points.add(1):1)
        if(hasAchievement("achievements","c35")) base = base.mul(tmp.bb.totalBuildingsBoost)
        return base
    },
    buyables: {
        11: {
            title(){return "<h3>BB-Infused Clicker: <h2>"+formatWhole(player.bb.buyables[11])},
            baseCps(){return new Decimal(1).mul(hasUpgrade("bb",11)?1.5:1).mul(hasUpgrade("bb",12)?player.bb.points.mul(0.1).mul(tmp.bb.kittenPower).mul(new Decimal(1.1).pow(player.bb.prestiges)).add(1):1).mul(hasUpgrade("bb",14)?2:1).mul(tmp.bb.universalCpSMultiplier)},
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
            title(){return "<h3>Ave. Cookie Enjoyer: <h2>"+formatWhole(player.bb.buyables[21])},
            baseCps(){return new Decimal(15).mul(tmp.bb.universalCpSMultiplier).mul(hasUpgrade("bb",14)?2:1).mul(hasUpgrade("bb",15)?player.bb.buyables[31].add(1):1).mul(hasUpgrade("bb",23)?player.bb.buyables[11].add(player.bb.buyables[21]).add(player.bb.buyables[31]).mul(0.01).add(1):1)},
            cps(){return this.baseCps().mul(player.bb.buyables[21])},
            display(){return "<h2>Cost: "+formatWhole(this.cost())+" butter biscuits<br>CpS: "+format(this.cps())+" ("+format(this.baseCps())+"/s)"},
            canAfford(){return player.bb.points.gte(this.cost())},
            buy(){
                player.points = new Decimal(0)
                player.bb.points = player.bb.points.sub(this.cost())
                player.bb.buyables[21] = player.bb.buyables[21].add(1)
            },
            cost(){return player.bb.buyables[21].pow(2).add(40)},
            unlocked(){return hasAchievement("achievements","c25")},
            style(){return{'height':'80px','width':'288px','background-color':(this.canAfford()?'gray':''),'border-radius':'10px','border':'5px solid','border-color':'rgba(0,0,0,0.125)'}}
        },
        31: {
            title(){return "<h3>Dough Incubators: <h2>"+formatWhole(player.bb.buyables[31])},
            baseCps(){return new Decimal(400).mul(tmp.bb.universalCpSMultiplier)},
            cps(){return this.baseCps().mul(player.bb.buyables[31])},
            display(){return "<h2>Cost: "+formatWhole(this.cost())+" butter biscuits<br>CpS: "+format(this.cps())+" ("+format(this.baseCps())+"/s)"},
            canAfford(){return player.bb.points.gte(this.cost())},
            buy(){
                player.points = new Decimal(0)
                player.bb.points = player.bb.points.sub(this.cost())
                player.bb.buyables[31] = player.bb.buyables[31].add(1)
            },
            cost(){return player.bb.buyables[31].pow(2).add(160)},
            unlocked(){return hasUpgrade("bb",14)},
            style(){return{'height':'80px','width':'288px','background-color':(this.canAfford()?'gray':''),'border-radius':'10px','border':'5px solid','border-color':'rgba(0,0,0,0.125)'}}
        },
        prestige: {
			display(){return `<span style='font-family:"Inconsolata", monospace, bold; font-size: 1.333em'>Reset for +1 chocolate butter biscuit<br><br>Req: ${format(player.bb.points)} / ${format(player.bb.prestiges.mul(50).add(100))} butter biscuits`},
			canAfford() { return player.bb.points.gte(player.bb.prestiges.mul(50).add(100)) },
			buy() {
                let gain = player.bb.prestiges.add(1)
                let keep = hasAchievement("achievements","c36")||player.bb.points.gte(250)?player.bb.upgrades:[]
                let keep2 = hasAchievement("achievements","c45")||player.bb.points.gte(400)?[player.bb.buyables[11],player.bb.buyables[21],player.bb.buyables[31]]:[new Decimal(0),new Decimal(0),new Decimal(0)]
				layerDataReset("bb")
                player.bb.upgrades = keep
                player.points = new Decimal(0)
                player.bb.buyables[11] = keep2[0]
                player.bb.buyables[21] = keep2[1]
                player.bb.buyables[31] = keep2[2]
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
            effect(){return hasUpgrade("bb",23)?player.bb.cookies.add(1).log(5).add(1).root(2):player.bb.cookies.add(1).log(10).add(1).root(2)},
            effectDisplay(){return "x"+format(this.effect())},
            cost: new Decimal(35000),
			currencyInternalName: "cookies",
			currencyDisplayName: "cookies",
			currencyLayer: "bb",
            unlocked(){return hasUpgrade("bb",12)}
        },
        14: {
            title: "Farm's Grand Plantation",
            description: "Your previous Cookie Makers are twice as strong and unlocks 3rd Cookie Maker",
            cost: new Decimal(612500),
			currencyInternalName: "cookies",
			currencyDisplayName: "cookies",
			currencyLayer: "bb",
            unlocked(){return hasUpgrade("bb",13)}
        },
        15: {
            title: "Miner's Heaven",
            description: "Average Cookie Enjoyer's base CpS is better based on Dough Incubators",
            cost: new Decimal(10718750),
			currencyInternalName: "cookies",
			currencyDisplayName: "cookies",
			currencyLayer: "bb",
            unlocked(){return hasUpgrade("bb",14)}
        },
        31: {
            title: "Massively Produced Upgrades",
            description: "Bought upgrades boosts cookie gain",
            cost: new Decimal(187578125),
			currencyInternalName: "cookies",
			currencyDisplayName: "cookies",
			currencyLayer: "bb",
            unlocked(){return hasUpgrade("bb",15)}
        },
        32: {
            title: "Banked Gain Boost",
            description: "Your cookie gain boosts averageness gain and boosts point gain at reduced rate",
            effect(){return tmp.bb.buyables[11].cps.add(tmp.bb.buyables[21].cps).add(tmp.bb.buyables[31].cps).add(1)},
            effect2(){return tmp.bb.buyables[11].cps.root(3).add(tmp.bb.buyables[21].cps.root(3)).add(tmp.bb.buyables[31].cps.root(3)).add(1).root(3)},
            effectDisplay(){return "x"+format(this.effect())+", x"+format(this.effect2())},
            cost: new Decimal(3282617188),
			currencyInternalName: "cookies",
			currencyDisplayName: "cookies",
			currencyLayer: "bb",
            unlocked(){return hasUpgrade("bb",31)}
        },
        33: {
            title: "temple",
            description: "Average Cookie Enjoyer's base CpS is better based on Dough Incubators",
            cost: new Decimal(57445800790),
			currencyInternalName: "cookies",
			currencyDisplayName: "cookies",
			currencyLayer: "bb",
            unlocked(){return hasUpgrade("bb",32)}
        },
        21: {
            title: "Classic Discount",
            description: "Chocolate butter biscuit's effect cheapens classicality",
            cost: new Decimal(4),
			currencyInternalName: "prestiges",
			currencyDisplayName: "chocolate butter biscuits",
			currencyLayer: "bb",
            unlocked(){return hasAchievement("achievements","c36")}
        },
        22: {
            title: "Milky Overdose",
            description: "Base Multiplier +x0.05, Evolution Multiplier +x0.025, Evolution Scaling /10",
            cost: new Decimal(4),
			currencyInternalName: "prestiges",
			currencyDisplayName: "chocolate butter biscuits",
			currencyLayer: "bb",
            unlocked(){return hasAchievement("achievements","c36")}
        },
        23: {
            title: "Multi-Tree Assistance",
            description: `Grandma's Assistance uses better formula and each Cookie Maker boosts ACE by +1%`,
            cost: new Decimal(4),
			currencyInternalName: "prestiges",
			currencyDisplayName: "chocolate butter biscuits",
			currencyLayer: "bb",
            unlocked(){return hasAchievement("achievements","c36")}
        },
    },
    doReset(resettingLayer){
        if(tmp[resettingLayer].row>this.row&&tmp[resettingLayer].treeType=="cookie") layerDataReset("bb")
    },
})

addLayer("u", {
    startData(){return{
        unlocked: true,
        points: new Decimal(0)
    }},
    nodeStyle(){return{'border':'1.666666667px solid','border-radius':'25%'}},
    color: "rgb(119,191,95)",
    symbol: "U",
    row: 0,
    treeType: "upgrade",
    type: "static",
    exponent: 2,
    base: 2,
    requires(){return new Decimal("1e12").div(hasAchievement("achievements","f56")?tmp.a.effect:1)},
    effect(){
        let upgradeAmount = player.u.points.add(hasUpgrade("ru",21)?1:0).add(hasUpgrade("ru",22)?player.ru.upgrades.length:0)
        return hasUpgrade("ru",11)?new Decimal(2).pow(upgradeAmount):upgradeAmount.add(1)
    },
    effectDescription(){return hasUpgrade("u",11)?"boosting your point gain by x"+format(this.effect()):""},
    resource: "bought upgrades",
    baseResource: "points",
    upgrades: {
        11: {
            title: "Up",
            description: "Bought upgrades have an effect",
            cost: new Decimal(1),
        }
    },
	hotkeys: [
		{key: "u", description: "U: Reset for bought upgrades", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
	],
    baseAmount(){return player.points},
    doReset(resettingLayer){
        if(tmp[resettingLayer].row>this.row&&tmp[resettingLayer].treeType=="upgrade"){
            layerDataReset("u")
            if(hasUpgrade("ru",21)) player.u.upgrades = [11]
        }
    }
})

addLayer("wu", {
    startData(){return{
        unlocked: false,
        points: new Decimal(0)
    }},
    nodeStyle(){return{'border':'1.666666667px solid','border-radius':'25%'}},
    color: "rgb(191,119,95)",
	hotkeys: [
		{key: "w", description: "W: Reset for wrong upgrades", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
	],
    symbol: "w",
    row: 1,
    position: 0,
    treeType: "upgrade",
    type: "static",
    exponent: 2,
    base: 2,
    requires(){return !player.wu.unlocked&&player.ru.unlocked?new Decimal(5):new Decimal(2)},
    effect(){return player.u.points.add(1)},
    resource: "wrong upgrades",
    baseResource: "bought upgrades",
    upgrades: {
        11: {
            title: "e",
            description: "point gain x6",
            cost: new Decimal(1),
        },
        21: {
            title: "p",
            description: "point gain x9",
            cost: new Decimal(2),
        },
        31: {
            title: "i",
            description: "point gain x6",
            cost: new Decimal(3),
        },
        41: {
            title: "c",
            description: "point gain x9",
            cost: new Decimal(4),
        }
    },
    baseAmount(){return player.u.points},
    branches: [["u", 1]],
    unlocked(){return player.wu.unlocked||hasUpgrade("u",11)||player.u.points.gte(1)},
    doReset(resettingLayer){
        if(tmp[resettingLayer].row>this.row&&tmp[resettingLayer].treeType=="upgradeT") layerDataReset("wu")
    }
})

addLayer("ru", {
    startData(){return{
        unlocked: false,
        points: new Decimal(0)
    }},
    nodeStyle(){return{'border':'1.666666667px solid','border-radius':'25%'}},
    color: "rgb(119,191,95)",
	hotkeys: [
		{key: "r", description: "R: Reset for right upgrades", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
	],
    symbol: "R",
    row: 1,
    position: 1,
    treeType: "upgrade",
    type: "static",
    exponent: 0,
    base: 1,
    requires(){return player.wu.unlocked&&!player.ru.unlocked?new Decimal(2.5):new Decimal([2/2,4/2,7/2,13/2,25/2][player.ru.points])},
    effect(){return player.u.points.add(1)},
    resource: "right upgrades",
    baseResource: "bought upgrades",
    upgrades: {
        11: {
            title: "Up",
            description: "Bought upgrade's effect uses much better formula",
            cost: new Decimal(1),
        },
        21: {
            title: "Up",
            description: `Keeps "Up" upgrade and "Up" upgrade includes itself`,
            cost(){return new Decimal(hasUpgrade("ru",22)?3:2)},
        },
        22: {
            title: "Up",
            description: `"Up" upgrade includes right upgrades's upgrades`,
            cost(){return new Decimal(hasUpgrade("ru",21)?3:2)},
        },
        31: {
            title: "Up",
            description: "Bought upgrades have an effect",
            cost: new Decimal(4),
        }
    },
    baseAmount(){return player.u.points},
    branches: [["u", 1]],
    unlocked(){return player.ru.unlocked||hasUpgrade("u",11)||player.u.points.gte(1)},
    doReset(resettingLayer){
        if(tmp[resettingLayer].row>this.row&&tmp[resettingLayer].treeType=="upgrade") layerDataReset("ru")
    },
})

addLayer("p", {
		name: "paradox", // This is optional, only used in a few places, If absent it just uses the layer id.
        treeType: "paradox",
		symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
		position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
		startData() { return {
			unlocked: true,
			points: new Decimal(0),
            best: new Decimal(0),
            paradox: new Decimal(0),
            antiParadox: new Decimal(0),
		}},
        nodeStyle(){return {'height':`${new Decimal(100).sub(new Decimal(100).mul(player.p.antiParadox.div(player.p.paradox).mul(new Decimal(Math.sin(player.achievements.sine.mul(3.6).root(new Decimal(1).sub(new Decimal(1).mul(player.p.antiParadox.div(player.p.paradox)))))).add(1).div(2))))}px`,'width':`${new Decimal(100).sub(new Decimal(100).mul(player.p.antiParadox.div(player.p.paradox).mul(new Decimal(Math.sin(player.achievements.sine.mul(4.2).root(new Decimal(1).sub(new Decimal(1).mul(player.p.antiParadox.div(player.p.paradox)))))).add(1).div(2))))}px`}},
        effect(){return player.p.points.add(1)},
        effectDescription(){return `multiplying point and paradox gain by x${format(this.effect())}`},
        update(diff){
            if(getFactorialEquilavent().gte(20)){
                player.p.paradox = player.p.paradox.add(tmp.p.paradoxGain.mul(diff).div(tmp.p.timeScale))
                player.p.antiParadox = player.p.antiParadox.add(tmp.p.antiParadoxGain.b.mul(diff).div(tmp.p.timeScale)).mul(tmp.p.antiParadoxGain.m.pow(diff).root(tmp.p.timeScale))
            }
            if(player.p.antiParadox.gte(player.p.paradox)&&player.p.antiParadox.gte(0.1)){
                player.p.points = player.p.points.max(player.p.paradox)
                player.p.paradox = new Decimal(0)
                player.p.antiParadox = new Decimal(0)
            }
        },
        paradoxGain(){
            let gain = getFactorialEquilavent().div(100).div(player.p.paradox.add(1)).mul(tmp.p.effect)
            return gain
        },
        antiParadoxGain(){
            let base = new Decimal(0.1)
            let mult = new Decimal(2)
            return {b: base, m: mult}
        },
        timeScale(){
            return new Decimal(60).div(new Decimal(1.05).pow(paradoxAch()))
        },
        tabFormat: ["main-display","resource-display",["display-text", function(){return `<br>You have ${format(player.p.paradox)} paradoxes (${format(tmp.p.paradoxGain)}/sec), which you gain based on your factorified points<br>You have ${format(player.p.antiParadox)} anti paradoxes (${format(tmp.p.antiParadoxGain.b)}/sec, x${format(tmp.p.antiParadoxGain.m)})<br><br>One second in this tree equals ${format(tmp.p.timeScale)} real life seconds`+(getFactorialEquilavent().gte(20)?"":"<br><br>You need at least 20 factorified points to produce anything here")}]],
		color: "#7DC7FB",
		requires(){return new Decimal(10)}, // Can be a function that takes requirement increases into account
		resource: "resolved paradoxes", // Name of prestige currency
		type: "none",
		exponent: 0, // Prestige currency exponent
		gainMult() { // Calculate the multiplier for main currency from bonuses
			mult = new Decimal(1)
			return mult
		},
		gainExp() { // Calculate the exponent on main currency from bonuses
			return new Decimal(1)
		},
		row: 0, // Row the layer is in on the tree (0 is the first row)
		layerShown(){return true},
        doReset(resettingLayer){
            if(tmp[resettingLayer].row>this.row&&tmp[resettingLayer].treeType=="paradox") layerDataReset("p")
        },
})

addLayer("achievements", {
    startData(){
        return{
            unlocked: true,
            points: new Decimal(0),
            bestFactorial: new Decimal(0),
            sine: new Decimal(0)
        }
    },
    symbol: "A",
    resource: "achievements",
    row: "side",
    update(diff){
        player.achievements.bestFactorial = player.achievements.bestFactorial.max(player.f.total)
        player.achievements.sine = player.achievements.sine.add(diff)
    },
    tabFormat: {
        "Factorial Tree": {
            content: ["main-display", ["row",[["achievement", ["f11"]],["achievement", ["f12"]],["achievement", ["f13"]],["achievement", ["f14"]],["achievement", ["f15"]],["achievement", ["f16"]]]],["row",[["achievement", ["f21"]],["achievement", ["f22"]],["achievement", ["f23"]],["achievement", ["f24"]],["achievement", ["f25"]],["achievement", ["f26"]]]],["row",[["achievement", ["f31"]],["achievement", ["f32"]],["achievement", ["f33"]],["achievement", ["f34"]],["achievement", ["f35"]],["achievement", ["f36"]]]],["row",[["achievement", ["f41"]],["achievement", ["f42"]],["achievement", ["f43"]],["achievement", ["f44"]],["achievement", ["f45"]],["achievement", ["f46"]]]],["row",[["achievement", ["f51"]],["achievement", ["f52"]],["achievement", ["f53"]],["achievement", ["f54"]],["achievement", ["f55"]],["achievement", ["f56"]]]]],
            unlocked(){return hasAchievement("achievements","f16")},
        },
        "Cookie Tree": {
            content: ["main-display", ["row",[["achievement", ["c11"]],["achievement", ["c12"]],["achievement", ["c13"]],["achievement", ["c14"]],["achievement", ["c15"]],["achievement", ["c16"]]]],["row",[["achievement", ["c21"]],["achievement", ["c22"]],["achievement", ["c23"]],["achievement", ["c24"]],["achievement", ["c25"]],["achievement", ["c26"]]]],["row",[["achievement", ["c31"]],["achievement", ["c32"]],["achievement", ["c33"]],["achievement", ["c34"]],["achievement", ["c35"]],["achievement", ["c36"]]]],["row",[["achievement", ["c41"]],["achievement", ["c42"]],["achievement", ["c43"]],["achievement", ["c44"]],["achievement", ["c45"]],["achievement", ["c46"]]]]],
            unlocked(){return hasAchievement("achievements","f16")},
        },
        "Upgrade Tree": {
            content: ["main-display", ["row",[["achievement", ["u11"]],["achievement", ["u12"]],["achievement", ["u13"]],["achievement", ["u14"]],["achievement", ["u15"]],["achievement", ["u16"]]]],["row",[["achievement", ["u21"]],["achievement", ["u22"]],["achievement", ["u23"]],["achievement", ["u24"]],["achievement", ["u25"]],["achievement", ["u26"]]]],["row",[["achievement", ["u31"]],["achievement", ["u32"]],["achievement", ["u33"]],["achievement", ["u34"]],["achievement", ["u35"]],["achievement", ["u36"]]]]],
            unlocked(){return hasAchievement("achievements","f43")},
        },
        "Paradox Tree": {
            content: ["main-display", ["row",[["achievement", ["p11"]],["achievement", ["p12"]],["achievement", ["p13"]],["achievement", ["p14"]],["achievement", ["p15"]],["achievement", ["p16"]]]],["row",[["achievement", ["p21"]],["achievement", ["p22"]],["achievement", ["p23"]],["achievement", ["p24"]],["achievement", ["p25"]],["achievement", ["p26"]]]],["row",[["achievement", ["p31"]],["achievement", ["p32"]],["achievement", ["p33"]],["achievement", ["p34"]],["achievement", ["p35"]],["achievement", ["p36"]]]]],
            unlocked(){return hasAchievement("achievements","f53")},
        },
        "???": {
            content: ["main-display", ["blank",["0px","160px"]], ["tree", [["starglitcher"]]]],
            unlocked(){return player.achievements.achievements.length>=52},
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
            unlocked(){return hasAchievement("achievements","f21")}
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
            name: "haha get it the skeppy numbah laugh now",
            tooltip: "Get 14 Factorials",
            done(){return player.f.total.gte(14)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f33")}
        },
        f35:{
            name: "A solid number",
            tooltip: "Get 15 Factorials",
            done(){return player.f.total.gte(15)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f34")}
        },
        f36:{
            name: "???",
            tooltip: "Reach 12 factorified points<br>Reward: Unlocks new layer in Factorial Tree",
            done(){return getFactorialEquilavent().gte(12)},
            onComplete(){player.achievements.points = player.achievements.points.add(1)},
            unlocked(){return hasAchievement("achievements","f35")||hasAchievement("achievements","f36")}
        },
        f41:{
            name: "2!^2!",
            tooltip: "Get 16 Factorials",
            done(){return player.f.total.gte(16)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f35")||hasAchievement("achievements","f36")}
        },
        f42:{
            name: "uh",
            tooltip: "Get 3 classicalities",
            done(){return player.c.points.gte(3)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return player.c.points.gte(1)||hasAchievement("achievements","f42")}
        },
        f43:{
            name: "uh",
            tooltip: "Get 4 classicalities<br>Reward: Unlocks another tree",
            done(){return player.c.points.gte(4)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f42")}
        },
        f44:{
            name: "",
            tooltip: "Get 20 Factorials",
            done(){return player.f.total.gte(20)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f41")}
        },
        f45:{
            name: "SEE THE UNSEEABLE BREAK THE UNBREAKABLE",
            tooltip: "Get 10 Factorials in 2nd challenge<h5>(ROW! ROW! FIGHT THE POWER!)",
            done(){return player.a.challengeScore2.gte(10)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f43")||hasAchievement("achievements","f44")||hasAchievement("achievements","f45")}
        },
        f46:{
            name: "SEE THE UNSEEABLE BREAK THE UNBREAKABLE",
            tooltip: `Get 16 Classicalities<br>Reward: Makes Classicality a bit more "unique"`,
            done(){return player.c.points.gte(16)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f43")||hasAchievement("achievements","f44")||hasAchievement("achievements","f45")}
        },
        f51:{
            name: "Factorified points are just Passive Factorials",
            tooltip: `Reach 20 factorified points`,
            done(){return getFactorialEquilavent().gte(20)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f51")||hasAchievement("achievements","f46")}
        },
        f52:{
            name: "Factorified points are just Eternity Factorials",
            tooltip: `Reach 25 Factorials`,
            done(){return player.f.total.gte(25)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f51")||hasAchievement("achievements","f46")}
        },
        f53:{
            name: "SEE THE UNSEEABLE BREAK THE UNBREAKABLE",
            tooltip: `Get 25 Classicalities<br>Reward: Unlocks yet another tree`,
            done(){return player.c.points.gte(25)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f46")}
        },
        f54:{
            name: "SEE THE UNSEEABLE BREAK THE UNBREAKABLE",
            tooltip: `Get 13 Factorials in 2nd challenge`,
            done(){return player.a.challengeScore2.gte(13)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f53")}
        },
        f55:{
            name: "SEE THE UNSEEABLE BREAK THE UNBREAKABLE",
            tooltip: `Get x100 effect`,
            done(){return tmp.a.effect.gte(100)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f54")}
        },
        f56:{
            name: "SEE THE UNSEEABLE BREAK THE UNBREAKABLE",
            tooltip: `Reach 22 factorified points<br>Reward: Averageness's effect cheapens bought upgrades and bought upgrades add up 1st and 4th classicalities's clickables`,
            done(){return getFactorialEquilavent().gte(22)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f56")||hasAchievement("achievements","f55")}
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
            name: "Two biscuits for the price of one",
            tooltip: "Reach 3 butter biscuits",
            done(){return player.bb.points.gte(3)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c11")}
        },
        c13:{
            name: "Is this nerf doing anything, really?",
            tooltip: "Reach 5 butter biscuits",
            done(){return player.bb.points.gte(5)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c12")}
        },
        c14:{
            name: "Cutting your salary into half",
            tooltip: "Reach 8 butter biscuits",
            done(){return player.bb.points.gte(8)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c13")}
        },
        c15:{
            name: "hah",
            tooltip: "Reach 13 butter biscuits",
            done(){return player.bb.points.gte(13)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c14")}
        },
        c16:{
            name: "Subversion 101",
            tooltip: "Reach 15 butter biscuits<br>Reward: Unlocks new tab in CBB layer",
            done(){return player.bb.points.gte(15)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c15")}
        },
        c21:{
            name: "Grandma is so proud of you",
            tooltip: "Reach 100 cookies",
            done(){return player.bb.cookies.gte(100)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c16")}
        },
        c22:{
            name: "Do not milk the kitten",
            tooltip: "Reach 1,000 cookies",
            done(){return player.bb.cookies.gte(1000)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c21")}
        },
        c23:{
            name: "At last, my OCs is canon in this tree!",
            tooltip: "Reach 25 butter biscuits",
            done(){return player.bb.points.gte(25)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c16")}
        },
        c24:{
            name: "Do not milk the kitten",
            tooltip: "Reach 10,000 cookies",
            done(){return player.bb.cookies.gte(10000)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c22")}
        },
        c25:{
            name: "At last, my OCs is canon in this tree!",
            tooltip: "Reach 50 butter biscuits<br>Reward: Unlocks 2nd Cookie Maker",
            done(){return player.bb.points.gte(50)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c23")}
        },
        c26:{
            name: "Do not milk the kitten",
            tooltip: "Reach 100,000 cookies",
            done(){return player.bb.cookies.gte(100000)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c24")}
        },
        c31:{
            name: "Recursive Economy",
            tooltip: "Reach 100 butter biscuits<br>Reward: ???",
            done(){return player.bb.points.gte(100)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c25")}
        },
        c32:{
            name: "Do not milk the kitten",
            tooltip: "Reach 1,000,000 cookies",
            done(){return player.bb.cookies.gte(1000000)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c26")}
        },
        c33:{
            name: "Do not milk the kitten",
            tooltip: "Get 5 of Cookie Makers each",
            done(){return player.bb.buyables[11].gte(5)&&player.bb.buyables[21].gte(5)&&player.bb.buyables[31].gte(5)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c33")||hasUpgrade("bb",14)}
        },
        c34:{
            name: "Do not milk the kitten",
            tooltip: "Reach 10,000,000 cookies",
            done(){return player.bb.cookies.gte(10000000)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c32")}
        },
        c35:{
            name: "Do not milk the kitten",
            tooltip: `Get 10 of Cookie Makers each<br>Reward: Each "Get X of Cookie Maker" achievement boosts cookie gain by +30%`,
            done(){return player.bb.buyables[11].gte(10)&&player.bb.buyables[21].gte(10)&&player.bb.buyables[31].gte(10)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c33")}
        },
        c36:{
            name: "Recursive Economy",
            tooltip: "Reach 4 chocolate butter biscuits<br>Reward: Unlocks CBB upgrades and you keep upgrades on reset",
            done(){return player.bb.prestiges.gte(4)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c31")}
        },
        c41:{
            name: "Recursive Economy",
            tooltip: "Reach 100,000,000 cookies",
            done(){return player.bb.cookies.gte(100000000)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c34")}
        },
        c42:{
            name: "Recursive Economy",
            tooltip: "Purchase all CBB upgrades",
            done(){return hasUpgrade("bb",21)&&hasUpgrade("bb",22)&&hasUpgrade("bb",23)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c36")}
        },
        c43:{
            name: "Do not milk the kitten",
            tooltip: `Get 15 of Cookie Makers each`,
            done(){return player.bb.buyables[11].gte(15)&&player.bb.buyables[21].gte(15)&&player.bb.buyables[31].gte(15)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c35")}
        },
        c44:{
            name: "Recursive Economy",
            tooltip: "Reach 1,000,000,000 cookies",
            done(){return player.bb.cookies.gte(1000000000)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c41")}
        },
        c45:{
            name: "Recursive Economy",
            tooltip: "Reach 7 chocolate butter biscuits<br>Reward: You keep Cookie Makers on reset",
            done(){return player.bb.prestiges.gte(7)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c44")||hasAchievement("achievements","c45")}
        },
        c46:{
            name: "Recursive Economy",
            tooltip: "Reach 10,000,000,000 cookies<br>Reward:<br><h1>[ENDGAME]",
            done(){return player.bb.cookies.gte(10000000000)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c44")}
        },
        u11:{
            name: "Nostalgia Tree could've fit this tree much better",
            tooltip: `Purchase "Up" upgrade`,
            done(){return player.u.upgrades.length>=1},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
        },
        u12:{
            name: "Nostalgia Tree could've fit this tree much better",
            tooltip: `Perform a 2nd row reset`,
            done(){return player.wu.unlocked||player.ru.unlocked},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements", "u11")}
        },
        u13:{
            name: "Nostalgia Tree could've fit this tree much better",
            tooltip: `Purchase your 2nd Row 2 upgrade`,
            done(){return hasUpgrade("wu",21)||hasUpgrade("ru",21)||hasUpgrade("ru",22)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements", "u12")}
        },
        u14:{
            name: "Nostalgia Tree could've fit this tree much better",
            tooltip: `Unlock both Row 2 layers`,
            done(){return player.wu.unlocked && player.ru.unlocked},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements", "u13")}
        },
        u15:{
            name: "Nostalgia Tree could've fit this tree much better",
            tooltip: `Purchase 5 upgrades in total`,
            done(){return player.u.upgrades.length+player.wu.upgrades.length+player.ru.upgrades.length>=5},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements", "u13")}
        },
        p11:{
            name: "ugh",
            tooltip: `Annihilate paradoxes and anti paradoxes<br>Reward: Each achievement in this tab speeds up time by x1.05`,
            done(){return player.p.points.gt(0)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
        },
        p12:{
            name: "ugh",
            tooltip: `Reach 0.5 resolved paradox`,
            done(){return player.p.points.gte(0.5)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements", "p11")}
        },
        /*p13:{
            name: "ugh",
            tooltip: `Reach 1 resolved paradox<br>Reward: You start generating paradoxes and anti-paradoxes at 10 factorified points instead`,
            done(){return player.p.points.gte(1)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements", "p12")}
        },*/
    },
})

addLayer("starglitcher", {
		name: "star glitcher", // This is optional, only used in a few places, If absent it just uses the layer id.
        treeType: "starglitcher",
		symbol: "...", // This appears on the layer's node. Default is the id with the first letter capitalized
		position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
		startData() { return {
			unlocked: true,
			points: new Decimal(0),
            mode: "none",
		}},
        tooltip: ". . .",
		color: "darkgray",
		type: "none",
        tabFormat: [["display-text", function(){return "It's still in development. Scram."}]],
		row: 0, // Row the layer is in on the tree (0 is the first row)
		layerShown(){return true},
})