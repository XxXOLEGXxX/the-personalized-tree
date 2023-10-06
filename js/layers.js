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
        tabFormat: ["main-display","prestige-button","resource-display","blank",["display-text", function(){return `Your best Factorials is ${formatWhole(player.achievements.bestFactorial)}`}],"blank",["buyables",[1]],"blank",["buyables",[2]]],
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
            21: {
                title: "<h1>Timeskip Grinding Montage",
                canAfford(){return true},
                buy(){
                    layerDataReset("f")
                    player.f.points = player.achievements.bestFactorial
                    player.f.total = player.achievements.bestFactorial
                    player.points = new Decimal(0)
                },
                unlocked(){return hasAchievement("achievements","f76")},
                style(){return{"width":"600px","height":"80px"}}
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
            let uhhh = hasAchievement("achievements","f74")?player.achievements.bestFactorial:player.f.total
			mult = new Decimal(1).mul(hasAchievement("achievements","f22")?uhhh.sub(4).max(1).factorial():1)
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
            if(tmp[resettingLayer].row>this.row&&tmp[resettingLayer].treeType=="factorial"){
                let keepScore = (hasAchievement("achievements","f73")||(player.tf.points.gte(9)&&player.c.points.gte(220)))?[player.a.challengeScore,player.a.challengeScore2]:[0,0]
                let keepUpgrades = (hasAchievement("achievements","f74")||(player.tf.points.gte(24)&&player.c.points.gte(520)))?player.a.upgrades:[]
                layerDataReset("a")
                player.a.upgrades = keepUpgrades
                player.a.challengeScore = keepScore[0]
                player.a.challengeScore2 = keepScore[1]
            }
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

addLayer("tf", {
		name: "tribute", // This is optional, only used in a few places, If absent it just uses the layer id.
        treeType: "factorial",
		symbol: "T", // This appears on the layer's node. Default is the id with the first letter capitalized
		position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
		startData() { return {
			unlocked: true,
			points: new Decimal(0),
		}},
        nodeStyle(){return {"border": "5px solid", "border-color": "rgba(0,0,0,0.25)","border-radius":"33%"}},
		color: "rgb(202,255,121)",
		requires(){return new Decimal(2).add(player.tf.points).mul(10)}, // Can be a function that takes requirement increases into account
        tooltipLocked(){return `Reach 40 classicalities (You have ${formatWhole(player.c.points)} classicalities)`},
		resource: "tributes", // Name of prestige currency
		baseResource: "classicalities", // Name of resource prestige is based on
		baseAmount() {return player.c.points}, // Get the current amount of baseResource
		type: "static",
        base: 1,
        effect(){
            let factorial = player.achievements.bestFactorifedPoints
            let eff = new Decimal(1)
            for(i=0;i<player.tf.points;i++){
                eff = eff.mul(factorial.sub(i).max(1))
            }
            return eff
        },
        effectDescription(){return `boosting point gain by x${format(this.effect())} based on your best factorified points so far`},
        tabFormat: ["main-display","prestige-button","resource-display",["display-text", function(){return `Best Factorified Points: ${format(player.achievements.bestFactorifedPoints)}`}]],
		exponent: 0, // Prestige currency exponent
		gainMult() { // Calculate the multiplier for main currency from bonuses
			mult = new Decimal(1)
			return mult
		},
		gainExp() { // Calculate the exponent on main currency from bonuses
			return new Decimal(1)
		},
		row: 2, // Row the layer is in on the tree (0 is the first row)
		hotkeys: [
			{key: "t", description: "T: Reset for tributes", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
		],
        branches: [["c"]],
		layerShown(){return hasAchievement("achievements","f64")},
        doReset(resettingLayer){
            if(tmp[resettingLayer].row>this.row&&tmp[resettingLayer].treeType=="factorial") layerDataReset("tf")
        },
})

addLayer("bb", {
    startData(){return{
        unlocked: true,
        points: new Decimal(0),
        cookies: new Decimal(0),
        kittenLevel: new Decimal(0),
        prestiges: new Decimal(0),
    }},
    nodeStyle(){return player.bb.points.gte(700) ?
        {'height':'113.3333333px','border-radius':'6.666666666px','border': '20px solid',"font-size":"32px","border-color": "rgb(221,180,102)","background-color": "rgb(225,192,50)", "color": "rgb(154,51,22)"} : 
        player.bb.points.gte(650) ?
        {'height':'113.3333333px','border-radius':'6.666666666px','border': '20px solid',"font-size":"32px","border-color": "rgb(221,180,102))","background-color": "rgb(221,180,102)", "color": "rgb(225,192,50)","box-shadow":"rgb(250,237,185) -3.333333333px 3.333333333px 3.333333333px, rgb(225,192,150) -3.333333333px -3.333333333px 3.333333333px, rgb(193,135,80) 3.333333333px 3.333333333px 3.333333333px, rgb(149,94,57) 3.333333333px -3.333333333px 3.333333333px"} : 
        player.bb.points.gte(600) ?
        {'height':'113.3333333px','border-radius':'6.666666666px','border': '20px solid',"font-size":"32px","border-color": "rgb(221,180,102)","background-color": "rgb(221,180,102)", "color": "rgb(255,204,47)"} : 
        player.bb.points.gte(550) ?
        {'height':'113.3333333px','border-radius':'6.666666666px','border': '20px solid',"font-size":"32px","border-color": "rgb(224,224,224)","background-color": "rgb(52,21,23)", "color": "rgb(0, 222, 255)","box-shadow":"rgb(255,255,255) -3.333333333px 3.333333333px 3.333333333px, rgb(224,224,224) -3.333333333px -3.333333333px 3.333333333px, rgb(204,179,172) 3.333333333px 3.333333333px 3.333333333px, rgb(193,168,140) 3.333333333px -3.333333333px 3.333333333px"} : 
        player.bb.points.gte(500) ?
        {'height':'113.3333333px','border-radius':'6.666666666px','border': '20px solid',"font-size":"32px","border-color": "rgb(144,128,119)","background-color": "rgb(10,5,8)", "color": "rgb(0,133,149)","box-shadow":"rgb(220,65,98) -3.333333333px 3.333333333px 3.333333333px, rgb(220,65,98) 3.333333333px 3.333333333px 3.333333333px, rgb(202,19,10) -3.333333333px 1.111111111px 3.333333333px, rgb(202,19,10) 3.333333333px 1.111111111px 3.333333333px, rgb(150,0,28) -3.333333333px -1.111111111px 3.333333333px, rgb(150,0,28) 3.333333333px -1.111111111px 3.333333333px, rgb(106,34,15) -3.333333333px -3.333333333px 3.333333333px, rgb(106,34,15) 3.333333333px -3.333333333px 3.333333333px" } : 
        player.bb.points.gte(450) ?
        {'height':'113.3333333px','border-radius':'6.666666666px','border': '20px solid',"font-size":"32px","border-color": "rgb(193,146,64)","background-color": "rgb(252,125,33)", "color": "rgb(236,24,23)","box-shadow":"rgb(102,254,91) -3.333333333px 3.333333333px 3.333333333px, rgb(154,183,62) -3.333333333px -3.333333333px 3.333333333px, rgb(60,128,48) 3.333333333px 3.333333333px 3.333333333px, rgb(82,110,78) 3.333333333px -3.333333333px 3.333333333px"} : 
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
    color: "rgb(165,66,31)",
    update(diff){
        if(hasAchievement("achievements","f16")) player.bb.points = player.points.mul(hasMilestone("cookie",0)?tmp.t.teaEffect:1).div(new Decimal(1.1).pow(player.bb.points.sub(player.bb.buyables[12].add(player.bb.buyables[22]).add(player.bb.buyables[32])).max(0))).sub(50).div(50).floor().max(player.bb.points).min(player.bb.points.add(player.points.div(new Decimal(1.1).pow(player.bb.points.sub(player.bb.buyables[12].add(player.bb.buyables[22]).add(player.bb.buyables[32])).max(0))).div(player.bb.points.mul(50).add(100).div(hasMilestone("cookie",0)?tmp.t.teaEffect:1)).max(1).log(10).round()).add(player.bb.prestiges.sub(player.bb.points.sub(50).div(50).floor().min(player.bb.prestiges)).add(1)))
        player.bb.cookies = player.bb.cookies.add(tmp.bb.buyables[11].cps.add(tmp.bb.buyables[21].cps).add(tmp.bb.buyables[31].cps).mul(diff))
        player.bb.kittenLevel = player.bb.kittenLevel.max(hasUpgrade("bb",22)?player.bb.cookies.max(1).log(100).floor():player.bb.cookies.max(1).log(1000).floor())
    },
    kittens(){
        let list = ["regular","black","grumpy","delicate","cookie","golden","lasagna","funny","grandma","eight-legged","omniscient","apocalyptc","wrinkler","self-aware","mod friendly","javascript","anti","morbidly obese","awfully long","incomprehensive"]
        return player.bb.kittenLevel.gte(19)?`level ${formatWhole(player.bb.kittenLevel.sub(18))} mafia`:list[player.bb.kittenLevel]
    },
    tabFormat: {
        "Butter Biscuit": {
            content: [["display-text", function(){return "You have <h2 style='color: brown; text-shadow: brown 0px 0px 10px;'>"+formatWhole(player.bb.points)+"</h2> butter biscuits, multiplying your point gain by x"+format(player.bb.points.mul(0.1).mul(tmp.bb.kittenPower).mul(new Decimal(1.1).pow(player.bb.prestiges)).add(1))+"<br><br>Your effecient point amount in this tree is "+format(player.points.div(new Decimal(1.1).pow(player.bb.points.sub(player.bb.buyables[12].add(player.bb.buyables[22]).add(player.bb.buyables[32])).max(0))))+"<br>Next butter buscuit: "+format(player.bb.points.mul(50).add(100).div(hasMilestone("cookie",0)?tmp.t.teaEffect:1))+" effecient points<br><br>To get your first butter biscuit, you need to exceed 100 point park, you'll gain the rest per 50 point mark. Each butter biscuit will boost your point gain by +x1.1, but nerf your effecient points by /1.1"}]],
            buttonStyle(){return{"border-color": "rgb(225,177,109)","background-color": "rgb(103,35,17)", "color": "rgb(208,132,94)"}}
        },
        "Cookie": {
            content: [["display-text", function(){return "You have <h2 style='color: brown; text-shadow: brown 0px 0px 10px;'>"+formatWhole(player.bb.points)+"</h2> butter biscuits, multiplying your point gain by x"+format(player.bb.points.mul(0.1).mul(tmp.bb.kittenPower).mul(new Decimal(1.1).pow(player.bb.prestiges)).add(1))+"<br><br>You currently have "+format(player.bb.cookies)+" cookies<br>Your "+tmp.bb.kittens+" kitten makes your butter biscuits's effect and cookie gain x"+format(tmp.bb.kittenPower)+" better<br>Your kitten will get next evolution at "+formatWhole(new Decimal(hasUpgrade("bb",22)?100:1000).pow(player.bb.kittenLevel.add(1)))+" cookies<br><br>Enter the 2nd tab. This is where you'll spend your time the most in this layer. You can spend your BB to purchase Cookie Makers™, with which you can gather cookies and (eventually) evolve kittens and purchase upgrades.<br>Purchasing Cookie Makers resets your point progress."}],"blank","clickables","blank",["row", [["buyable",[11]],["buyable",[12]],["buyable",[13]]]],["row", [["buyable",[21]],["buyable",[22]],["buyable",[23]]]],["row", [["buyable",[31]],["buyable",[32]],["buyable",[33]]]],"blank",["upgrades",[1,3]]],
            buttonStyle(){return{"border-color": "rgb(52,12,2)","background-color": "rgb(195,147,56)", "color": "rgb(131,64,20)"}},
            unlocked(){return hasAchievement("achievements","c16")}
        },
        "Chocolate Butter Biscuit": {
            content: [["display-text", function(){return `You have <h2 style='color: brown; text-shadow: brown 0px 0px 10px'>${formatWhole(player.bb.prestiges)}</h2> chocolate butter biscuits, multiplying your butter biscuits's effect by x${format(new Decimal(1.1).pow(player.bb.prestiges))}`}],"blank",["buyable",["prestige"]],"blank",["display-text", function(){return `Welcome to the first prestige layer of this tree. Sorta. You lose all your previous progress in Cookie Tree (including your kitten) in exchange for chocolate butter biscuits, which will provide a multiplicative boost instead.`}],"blank",["upgrades",[2]],["row",[["buyable",["tea1"]],["buyable",["tea2"]]]]],
            buttonStyle(){return{"border-color": "rgb(225,177,109)","background-color": "rgb(103,35,17)", "color": "rgb(208,132,94)"}},
            unlocked(){return hasAchievement("achievements","c31")}
        }
    },
    kittenPower(){
        let base = new Decimal(hasUpgrade("bb",22)?0.15:0.1)
        let total = new Decimal(1)
        for(i=new Decimal(0);i.lt(player.bb.kittenLevel);i=i.add(1)){
            total = total.mul(base.add(1))
            if(base.lt(2)) base = base.add((hasUpgrade("bb",22)?0.05:0.025)*(i+1))
            if(base.gte(2)) base = new Decimal(2)
        }
        return total
    },
    totalBuildingsBoost(){
        let eff = new Decimal(1)
        if(hasAchievement("achievements","c33")&&hasAchievement("achievements","c35")) eff = eff.add(0.3)
        if(hasAchievement("achievements","c35")) eff = eff.add(0.3)
        if(hasAchievement("achievements","c43")&&hasAchievement("achievements","c35")) eff = eff.add(0.3)
        if(hasAchievement("achievements","c66")&&hasAchievement("achievements","c35")) eff = eff.add(0.3)
        if(hasAchievement("achievements","c81")&&hasAchievement("achievements","c35")) eff = eff.add(0.3)
        if(hasAchievement("achievements","c92")&&hasAchievement("achievements","c35")) eff = eff.add(0.3)
        if(hasAchievement("achievements","c94")&&hasAchievement("achievements","c35")) eff = eff.add(0.3)
        if(hasAchievement("achievements","c95")&&hasAchievement("achievements","c35")) eff = eff.add(0.3)
        if(hasAchievement("achievements","c96")&&hasAchievement("achievements","c35")) eff = eff.add(0.3)
        return eff
    },
    exponent: 0.5,
    requires: new Decimal(10),
    treeType: "cookie",
    resource: "biscuits",
    row: 0,
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
        let base = new Decimal(1).mul(tmp.cookie.universalBoost)
        base = base.mul(tmp.bb.kittenPower)
        base = base.mul(hasUpgrade("a",24)?player.a.points.add(1).log(10).add(1).root(2):1)
        base = base.mul(hasUpgrade("bb",31)?player.u.points.add(1):1)
        if(hasAchievement("achievements","c35")) base = base.mul(tmp.bb.totalBuildingsBoost)
        base = base.mul(new Decimal(1.1).pow(player.cookie.upgrades.length))
        if(player.bb.buyables["tea2"].gte(1)) base = base.mul(tmp.t.teaEffect)
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
                if(hasAchievement("achievements","c81")){
                    let shit = player.bb.points
                    let bulk = new Decimal(0)
                    let count = new Decimal(1)
                    let cost = player.bb.buyables[11].add(player.bb.buyables[12]).pow(2).add(15)
                    for(count;shit.gte(cost);count=count.add(1)){
                        bulk = bulk.add(1)
                        cost = player.bb.buyables[11].add(count).add(player.bb.buyables[12]).pow(2).add(15)
                    }
                    cost = player.bb.buyables[11].add(count.sub(2)).add(player.bb.buyables[12]).pow(2).add(15)
                    player.bb.points = player.bb.points.sub(cost)
                    player.bb.buyables[11] = player.bb.buyables[11].add(bulk)
                } else {
                    player.bb.points = player.bb.points.sub(this.cost())
                    player.bb.buyables[11] = player.bb.buyables[11].add(1)
                }
                player.bb.buyables[12] = new Decimal(0)
                player.bb.buyables[22] = new Decimal(0)
                player.bb.buyables[32] = new Decimal(0)
            },
            cost(){return player.bb.buyables[11].add(player.bb.buyables[12]).pow(2).add(15)},
            style(){return{'height':'80px','width':'288px','background-color':(this.canAfford()?'gray':''),'border-radius':'10px','border':'5px solid','border-color':'rgba(0,0,0,0.125)'}}
        },
        12: {
            title(){return "<h4>Bank one<h3>("+formatWhole(player.bb.buyables[12])+")"},
            canAfford(){return player.bb.buyables[11].gte(1)},
            buy(){
                player.bb.buyables[11] = player.bb.buyables[11].sub(1)
                player.bb.buyables[12] = player.bb.buyables[12].add(1)
            },
            unlocked(){return hasUpgrade("bb",33)},
            style(){return{'height':'80px','width':'80px','background-color':(this.canAfford()?'gray':''),'border-radius':'10px','border':'5px solid','border-color':'rgba(0,0,0,0.125)'}}
        },
        13: {
            title(){return "<h4>Deposit one"},
            canAfford(){return player.bb.buyables[12].gte(1)},
            buy(){
                player.bb.buyables[12] = player.bb.buyables[12].sub(1)
                player.bb.buyables[11] = player.bb.buyables[11].add(1)
                player.bb.points = player.bb.points.sub(1)
            },
            unlocked(){return hasUpgrade("bb",33)},
            style(){return{'height':'80px','width':'80px','background-color':(this.canAfford()?'gray':''),'border-radius':'10px','border':'5px solid','border-color':'rgba(0,0,0,0.125)'}}
        },
        21: {
            title(){return "<h3>Ave. Cookie Enjoyer: <h2>"+formatWhole(player.bb.buyables[21])},
            baseCps(){return new Decimal(15).mul(tmp.bb.universalCpSMultiplier).mul(hasUpgrade("bb",14)?2:1).mul(hasUpgrade("bb",15)?player.bb.buyables[31].add(1):1).mul(hasUpgrade("bb",23)?player.bb.buyables[11].add(player.bb.buyables[21]).add(player.bb.buyables[31]).mul(0.01).add(1):1)},
            cps(){return this.baseCps().mul(player.bb.buyables[21])},
            display(){return "<h2>Cost: "+formatWhole(this.cost())+" butter biscuits<br>CpS: "+format(this.cps())+" ("+format(this.baseCps())+"/s)"},
            canAfford(){return player.bb.points.gte(this.cost())},
            buy(){
                player.points = new Decimal(0)
                if(hasAchievement("achievements","c81")){
                    let shit = player.bb.points
                    let bulk = new Decimal(0)
                    let count = new Decimal(1)
                    let cost = player.bb.buyables[21].add(player.bb.buyables[22]).pow(2).add(40)
                    for(count;shit.gte(cost);count=count.add(1)){
                        bulk = bulk.add(1)
                        cost = player.bb.buyables[21].add(count).add(player.bb.buyables[22]).pow(2).add(40)
                    }
                    cost = player.bb.buyables[21].add(count.sub(2)).add(player.bb.buyables[22]).pow(2).add(40)
                    player.bb.points = player.bb.points.sub(cost)
                    player.bb.buyables[21] = player.bb.buyables[21].add(bulk)
                } else {
                    player.bb.points = player.bb.points.sub(this.cost())
                    player.bb.buyables[21] = player.bb.buyables[21].add(1)
                }
                player.bb.buyables[12] = new Decimal(0)
                player.bb.buyables[22] = new Decimal(0)
                player.bb.buyables[32] = new Decimal(0)
            },
            cost(){return player.bb.buyables[21].add(player.bb.buyables[22]).pow(2).add(40)},
            unlocked(){return hasAchievement("achievements","c25")},
            style(){return{'height':'80px','width':'288px','background-color':(this.canAfford()?'gray':''),'border-radius':'10px','border':'5px solid','border-color':'rgba(0,0,0,0.125)'}}
        },
        22: {
            title(){return "<h4>Bank one<h3>("+formatWhole(player.bb.buyables[22])+")"},
            canAfford(){return player.bb.buyables[21].gte(1)},
            buy(){
                player.bb.buyables[21] = player.bb.buyables[21].sub(1)
                player.bb.buyables[22] = player.bb.buyables[22].add(1)
            },
            unlocked(){return hasUpgrade("bb",33)},
            style(){return{'height':'80px','width':'80px','background-color':(this.canAfford()?'gray':''),'border-radius':'10px','border':'5px solid','border-color':'rgba(0,0,0,0.125)'}}
        },
        23: {
            title(){return "<h4>Deposit one"},
            canAfford(){return player.bb.buyables[22].gte(1)},
            buy(){
                player.bb.buyables[22] = player.bb.buyables[22].sub(1)
                player.bb.buyables[21] = player.bb.buyables[21].add(1)
                player.bb.points = player.bb.points.sub(1)
            },
            unlocked(){return hasUpgrade("bb",33)},
            style(){return{'height':'80px','width':'80px','background-color':(this.canAfford()?'gray':''),'border-radius':'10px','border':'5px solid','border-color':'rgba(0,0,0,0.125)'}}
        },
        31: {
            title(){return "<h3>Dough Incubators: <h2>"+formatWhole(player.bb.buyables[31])},
            baseCps(){return new Decimal(400).mul(tmp.bb.universalCpSMultiplier)},
            cps(){return this.baseCps().mul(player.bb.buyables[31])},
            display(){return "<h2>Cost: "+formatWhole(this.cost())+" butter biscuits<br>CpS: "+format(this.cps())+" ("+format(this.baseCps())+"/s)"},
            canAfford(){return player.bb.points.gte(this.cost())},
            buy(){
                player.points = new Decimal(0)
                if(hasAchievement("achievements","c81")){
                    let shit = player.bb.points
                    let bulk = new Decimal(0)
                    let count = new Decimal(1)
                    let cost = player.bb.buyables[31].add(player.bb.buyables[32]).pow(2).add(160)
                    for(count;shit.gte(cost);count=count.add(1)){
                        bulk = bulk.add(1)
                        cost = player.bb.buyables[31].add(count).add(player.bb.buyables[32]).pow(2).add(160)
                    }
                    cost = player.bb.buyables[31].add(count.sub(2)).add(player.bb.buyables[32]).pow(2).add(160)
                    player.bb.points = player.bb.points.sub(cost)
                    player.bb.buyables[31] = player.bb.buyables[31].add(bulk)
                } else {
                    player.bb.points = player.bb.points.sub(this.cost())
                    player.bb.buyables[31] = player.bb.buyables[31].add(1)
                }
                player.bb.buyables[12] = new Decimal(0)
                player.bb.buyables[22] = new Decimal(0)
                player.bb.buyables[32] = new Decimal(0)
            },
            cost(){return player.bb.buyables[31].add(player.bb.buyables[32]).pow(2).add(160)},
            unlocked(){return hasUpgrade("bb",14)},
            style(){return{'height':'80px','width':'288px','background-color':(this.canAfford()?'gray':''),'border-radius':'10px','border':'5px solid','border-color':'rgba(0,0,0,0.125)'}}
        },
        32: {
            title(){return "<h4>Bank one<h3>("+formatWhole(player.bb.buyables[32])+")"},
            canAfford(){return player.bb.buyables[31].gte(1)},
            buy(){
                player.bb.buyables[31] = player.bb.buyables[31].sub(1)
                player.bb.buyables[32] = player.bb.buyables[32].add(1)
            },
            unlocked(){return hasUpgrade("bb",33)},
            style(){return{'height':'80px','width':'80px','background-color':(this.canAfford()?'gray':''),'border-radius':'10px','border':'5px solid','border-color':'rgba(0,0,0,0.125)'}}
        },
        33: {
            title(){return "<h4>Deposit one"},
            canAfford(){return player.bb.buyables[32].gte(1)},
            buy(){
                player.bb.buyables[32] = player.bb.buyables[32].sub(1)
                player.bb.buyables[31] = player.bb.buyables[31].add(1)
                player.bb.points = player.bb.points.sub(1)
            },
            unlocked(){return hasUpgrade("bb",33)},
            style(){return{'height':'80px','width':'80px','background-color':(this.canAfford()?'gray':''),'border-radius':'10px','border':'5px solid','border-color':'rgba(0,0,0,0.125)'}}
        },
        prestige: {
			display(){return `<span style='font-family:"Inconsolata", monospace, bold; font-size: 1.333em'>Reset for +${formatWhole(this.gain())} chocolate butter biscuit<br><br>Req: ${format(player.bb.points)} / ${format(player.bb.prestiges.mul(50).add(100))} butter biscuits`},
			canAfford() { return player.bb.points.gte(player.bb.prestiges.mul(50).add(100)) },
            gain(){return hasMilestone("cookie",1)?player.bb.points.div(50).sub(player.bb.prestiges.add(1)).max(0).floor():this.canAfford()?1:0},
			buy() {
                let gain = player.bb.prestiges.add(this.gain())
                let keep = hasAchievement("achievements","c36")||player.bb.points.gte(250)?player.bb.upgrades:[]
                let keep2 = hasAchievement("achievements","c45")||player.bb.points.gte(400)?[player.bb.buyables[11],player.bb.buyables[21],player.bb.buyables[31]]:[new Decimal(0),new Decimal(0),new Decimal(0)]
                keep2[3] = player.bb.buyables["tea2"]
				layerDataReset("bb")
                player.bb.upgrades = keep
                player.points = new Decimal(0)
                player.bb.buyables[11] = keep2[0]
                player.bb.buyables[21] = keep2[1]
                player.bb.buyables[31] = keep2[2]
                player.bb.buyables["tea2"] = keep2[3]
                player.bb.prestiges = gain
			},
			style(){return{"border-radius":"25%",'height':'120px', 'width':'180px', 'border': '4px solid', 'border-color': 'rgba(0, 0, 0, 0.125)','background-color':(this.canAfford()?'rgb(165,66,31)':'')}},
			unlocked(){return true}
		},
        tea1: {
            title: "<h1>Teacup",
            display(){return "<h2>Purchases one teacup<br><br>Cost: "+formatWhole(this.cost())+" chocolate butter biscuits"},
            canAfford(){return player.bb.prestiges.gte(this.cost())},
            buy(){
                player.points = new Decimal(0)
                player.bb.prestiges = player.bb.prestiges.sub(player.bb.buyables["tea2"].gte(4)?0:this.cost())
                player.t.points = player.t.points.add(1)
            },
            cost(){return player.t.points.add(6)},
            unlocked(){return hasMilestone("cookie",0)}
        },
        tea2: {
            title(){return player.bb.buyables["tea2"].gte(4)?"<h1>OUT OF STOCK":"<h1>"+["Cookie","Tea","Upgrade"][player.bb.buyables["tea2"]]+"<br>Milk"},
            display(){return player.bb.buyables["tea2"].gte(4)?"":"<h2>Adds flavor to the tea, giving them additional effects<br><br>Cost: "+formatWhole(this.cost())+" chocolate butter biscuits"},
            canAfford(){return player.bb.prestiges.gte(this.cost())&&player.bb.buyables["tea2"].lt(4)},
            buy(){
                player.points = new Decimal(0)
                player.bb.prestiges = player.bb.buyables["tea2"].gte(3)?player.bb.prestiges:player.bb.prestiges.sub(this.cost())
                player.bb.buyables["tea2"] = player.bb.buyables["tea2"].add(1)
            },
            cost(){
                let uhh = new Decimal(1)
                let factor = new Decimal(2)
                for(i=0;i<player.bb.buyables["tea2"];i++){
                    uhh = uhh.add(factor.factorial().round())
                    factor = factor.add(1)
                }
                return uhh.add(7)
            },
            unlocked(){return hasMilestone("cookie",0)}
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
            title: "Temple's Blessing",
            description: "You can bank your Cookie Maker to push butter biscuit requirement back by 1 each",
            cost: new Decimal(57445800790),
			currencyInternalName: "cookies",
			currencyDisplayName: "cookies",
			currencyLayer: "bb",
            unlocked(){return hasUpgrade("bb",32)}
        },
        34: {
            title: "temple", //wizard tower, shipment, alchemy lab, portal, timemachine, antimatter condenser, prism, chancemaker, fractal engine, javascript console, idleverse, cortex baker, you
            description: "Average Cookie Enjoyer's base CpS is better based on Dough Incubators",
            cost: new Decimal(1005301514000),
			currencyInternalName: "cookies",
			currencyDisplayName: "cookies",
			currencyLayer: "bb",
            unlocked(){return false}
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

addLayer("t", {
    startData(){return{
        unlocked: true,
        points: new Decimal(1),
        milliliters: new Decimal(0),
        teas: new Decimal(0),
        prestiges: new Decimal(0),
    }},
    nodeStyle(){return{'height':'113.3333333px','border-radius':'0px',"border-bottom-left-radius": "100%","border-bottom-right-radius": "100%",'border': '6.666666666px solid',"border-top-width":"0px","border-color": "rgb(48.75,48.75,48.75)", "background": "repeating-linear-gradient(rgb(195,195,195),rgb(195,195,195) "+format(new Decimal(113.3333333).sub(new Decimal(113.3333333).mul(player.t.milliliters.div(tmp.t.teaRequirement))))+"px, rgb(127,31,0) "+format(new Decimal(113.3333333).sub(new Decimal(113.3333333).mul(player.t.milliliters.div(tmp.t.teaRequirement))))+"px, rgb(127,31,0))"}},
    update(diff){
        if(hasMilestone("cookie",0)) player.t.milliliters=player.t.milliliters.add(this.effect().mul(diff))
        if(player.t.milliliters.gte(tmp.t.teaRequirement)){
            player.t.milliliters = new Decimal(0)
            player.t.teas = player.t.teas.add(tmp.t.effect.div(20).div(Decimal.pow(2.5, player.t.teas)).max(1).log(10).add(1).round())
        }
        if(hasMilestone("cookie",3)&&tmp.t.buyables[11].canAfford) player.t.prestiges = player.t.prestiges.add(player.t.teas.div(player.t.prestiges.mul(2).add(5)).max(1).floor())
    },
    teaEffect(){return new Decimal(1.578314934).pow(player.t.teas)},
    symbol: "T",
    type: "none", 
    treeType: "cookie",
    resource: "teacups",
    teaBagBoost(){
        let base = new Decimal(1)
        let boost = new Decimal(5)
        let nerf = new Decimal(0.578314934)
        let youReallyThought = new Decimal(0.578314934/300)
        for(i=new Decimal(0);i.lt(player.t.prestiges);i=i.add(1)){
            base = base.mul(boost)
            boost = boost.sub(1).div(nerf.mul(i.gte(301)?youReallyThought.mul(i.sub(300)):1).div(hasAchievement("achievements","c84")?player.p.points.add(1):1).add(1)).add(1)
        }
        return base
    },
    teaRequirement(){return new Decimal(20).mul(Decimal.pow(2.5, player.t.teas))},
    effect(){return player.t.points.mul(tmp.cookie.universalBoost).mul(tmp.t.teaBagBoost).mul(player.bb.buyables["tea2"].gte(2)?tmp.t.teaEffect:1)},
    effectDescription(){return "pouring down "+format(this.effect())+" milliliters of tea per second"},
    row: 0,
    tabFormat: ["main-display",["display-text", function(){return `You have filled ${formatWhole(player.t.teas)} cups, boosting point gain`+(player.bb.buyables["tea2"].gte(1)?`, cookie gain`:`,`)+(player.bb.buyables["tea2"].gte(2)?`, tea millileter gain`:`,`)+` effecient point amount by x${format(tmp.t.teaEffect)}`+(player.bb.buyables["tea2"].gte(3)?` and nerfing bought upgrade's cost by just as much`:``)+`<br>You have ${format(player.t.milliliters)} milliliters of tea<br><br>You need ${format(tmp.t.teaRequirement)} milliliters of tea to fill this cup.`}],"blank","buyables","blank",["display-text",function(){return hasAchievement("achievements","c56")?`You have ${formatWhole(player.t.prestiges)} tea bags, boosting your teacups's effect by x${format(tmp.t.teaBagBoost)}`:``}]], 
    doReset(resettingLayer){
        if(tmp[resettingLayer].row>this.row&&tmp[resettingLayer].treeType=="cookie") layerDataReset("t")
    },
    buyables: {
        11: {
			display(){return `<span style='font-family:"Inconsolata", monospace, bold; font-size: 1.333em'>Reset for +1 tea bag<br><br>Req: ${format(player.t.teas)} / ${format(player.t.prestiges.mul(2).add(5))} filled cups`},
			canAfford() { return player.t.teas.gte(player.t.prestiges.mul(2).add(5)) },
			buy() {
                let gain = player.t.prestiges.add(1)
                let keep = hasMilestone("cookie",2)?player.t.points:new Decimal(1)
				layerDataReset("t")
                player.t.points = keep
                player.t.prestiges = gain
			},
			style(){return{"border-radius":"25%",'height':'120px', 'width':'180px', 'border': '4px solid', 'border-color': 'rgba(0, 0, 0, 0.125)','background-color':(this.canAfford()?'rgb(127,31,0)':'')}},
			unlocked(){return hasAchievement("achievements","c56")}
		},
    },
    layerShown(){return hasMilestone("cookie",0)}
})

addLayer("cookie", {
    startData(){return{
        unlocked: true,
        points: new Decimal(0),
        levels: new Decimal(0)
    }},
    nodeStyle(){return {'height':'500px','width':'500px','border': '25px solid',"font-size":"100px","border-color": "rgb(52,12,2)","background-color": "rgb(195,147,56)", "color": "rgb(52,12,2)"}},
    canBuyMax: true,
    symbol: "COOKIE",
    color: "rgb(195,147,56)",
    canReset(){return this.getResetGain().gte(1)&&player.cookie.levels.lt("1e72")},
    prestigeButtonText(){return `Reset for ${formatWhole(this.getResetGain())} Heavenly Cookies<br><br>Get next at ${format(this.getNextAt())}`},
    getResetGain(){return player.bb.cookies.div("1e10").root(3).sub(player.cookie.levels).max(0).floor().min(new Decimal("1e72").sub(player.cookie.levels))},
    getNextAt(canMax=false){return new Decimal("1e10").mul(player.cookie.levels.add(this.getResetGain().add(1)).pow(3))},
    onPrestige(gain){
        player.cookie.levels = player.cookie.levels.add(gain)
    },
    universalBoost(){return player.cookie.levels.div(100).add(1)},
    type: "custom",
    exponent: 3,
    row: 1,
    base: 1,
    requires: new Decimal("1e10"),
    treeType: "cookie",
    resource: "Heavenly Cookies",
    milestones:{
        0:{
            requirementDescription: "1 Ascended Levels",
            effectDescription: "Reveals new layer and unlocks few buyables in CBB tab",
            done(){return player.cookie.levels.gte(1)}
        },
        1:{
            requirementDescription: "1,000 Ascended Levels",
            effectDescription: "You can buy max chocolate butter biscuits",
            done(){return player.cookie.levels.gte(1000)}
        },
        2:{
            requirementDescription: "1,000,000,000,000 Ascended Levels",
            effectDescription: "You keep teacups on tea reset",
            done(){return player.cookie.levels.gte(1000000000000)}
        },
        3:{
            requirementDescription: "1e72 Ascended Levels",
            effectDescription: "You gain tea bags passively",
            done(){return player.cookie.levels.gte("1e72")}
        }
    },
    upgrades: {
        11: {
            title: "Legacy Flavored Cookie",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(1),
            tooltip: `"Hey, look! It's the same cookie you've been clicking on... and it looks normal as well!"`,
        },
        21: {
            title: "Heart Shaped Cookie",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(100),
            tooltip: `"A perfect bite-sized gift for your love interest"`,
            unlocked(){return hasUpgrade("cookie",11)}
        },
        22: {
            title: "Bunny Shaped Cookie",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(100),
            tooltip: `"Made by rabbits, for rabbits."`,
            unlocked(){return hasUpgrade("cookie",11)}
        },
        31: {
            title: "Time Shifting Cookie",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(10000),
            tooltip: `"Side effects included: Amnesia, taste loss, spaghettification, significantly increased chance of encountering a bunch of alligators..."`,
            unlocked(){return hasUpgrade("cookie",21)}
        },
        32: {
            title: "Enhanced Bakery Powdered Cookie",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(10000),
            tooltip: `"Preferred to be consumed with ice cream"`,
            unlocked(){return hasUpgrade("cookie",21)||hasUpgrade("cookie",22)}
        },
        33: {
            title: "Vacuum Cookie",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(10000),
            tooltip: `"Tastes like factory reset air."`,
            unlocked(){return hasUpgrade("cookie",22)}
        },
        41: {
            title: "??? Cookie",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(1000000),
            tooltip: `"ooooooo so mysterious you want to write 7 pages documentary theoretical lore about that cookie"`,
            unlocked(){return hasUpgrade("cookie",31)}
        },
        42: {
            title: "Tea Biscuit",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(1000000),
            tooltip: `"Not to be confused with butter biscuits, innit."`,
            unlocked(){return hasUpgrade("cookie",31)||hasUpgrade("cookie",32)}
        },
        43: {
            title: "Tuc",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(1000000),
            tooltip: `"Crackers are technically considered as cookies. I think."`,
            unlocked(){return hasUpgrade("cookie",32)||hasUpgrade("cookie",33)}
        },
        44: {
            title: "Square Cookie",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(1000000),
            tooltip: `"An ethnical and nutricious choice for athelics and others alike."`,
            unlocked(){return hasUpgrade("cookie",33)}
        },
        51: {
            title: "Masha's America",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(100000000),
            tooltip: `"Wet and lacks oil. 4/10"`,
            unlocked(){return hasUpgrade("cookie",41)}
        },
        52: {
            title: "Empty Cookie-Shaped Bottle",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(100000000),
            tooltip: `"that's not a cookie"`,
            unlocked(){return hasUpgrade("cookie",41)||hasUpgrade("cookie",42)}
        },
        53: {
            title: "PNG File of Big Cookie",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(100000000),
            tooltip: `"Ever so bitsy and chrunchy, just as intended!"`,
            unlocked(){return hasUpgrade("cookie",42)||hasUpgrade("cookie",43)}
        },
        54: {
            title: "Cheetos Mac'n Cheese Cheesy Jalapeno",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(100000000),
            tooltip: `"No serás un jefe de galletas si no consideras esta comida como una delicia de galleta exótica."`,
            unlocked(){return hasUpgrade("cookie",43)||hasUpgrade("cookie",44)}
        },
        55: {
            title: "Horse",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(100000000),
            tooltip: `"How hungry?"`,
            unlocked(){return hasUpgrade("cookie",44)}
        },
        61: {
            title: "Blank Crackers",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(10000000000),
            unlocked(){return hasUpgrade("cookie",51)},
            style(){return{'height':'100px','width':'100px'}}
        },
        62: {
            title: "Blank Crackers",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(10000000000),
            unlocked(){return hasUpgrade("cookie",51)||hasUpgrade("cookie",52)},
            style(){return{'height':'100px','width':'100px'}}
        },
        63: {
            title: "Blank Crackers",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(10000000000),
            unlocked(){return hasUpgrade("cookie",52)||hasUpgrade("cookie",53)},
            style(){return{'height':'100px','width':'100px'}}
        },
        64: {
            title: "Blank Crackers",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(10000000000),
            unlocked(){return hasUpgrade("cookie",53)||hasUpgrade("cookie",54)},
            style(){return{'height':'100px','width':'100px'}}
        },
        65: {
            title: "Blank Crackers",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(10000000000),
            unlocked(){return hasUpgrade("cookie",54)||hasUpgrade("cookie",55)},
            style(){return{'height':'100px','width':'100px'}}
        },
        66: {
            title: "Blank Crackers",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(10000000000),
            unlocked(){return hasUpgrade("cookie",55)},
            style(){return{'height':'100px','width':'100px'}}
        },
        71: {
            title: "Blank Crackers",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(1000000000000),
            unlocked(){return hasUpgrade("cookie",61)||hasUpgrade("cookie",62)},
            style(){return{'height':'100px','width':'100px'}}
        },
        72: {
            title: "Blank Crackers",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(1000000000000),
            unlocked(){return hasUpgrade("cookie",61)||hasUpgrade("cookie",62)||hasUpgrade("cookie",63)},
            style(){return{'height':'100px','width':'100px'}}
        },
        73: {
            title: "Blank Crackers",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(1000000000000),
            unlocked(){return hasUpgrade("cookie",62)||hasUpgrade("cookie",63)||hasUpgrade("cookie",64)},
            style(){return{'height':'100px','width':'100px'}}
        },
        74: {
            title: "Blank Crackers",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(1000000000000),
            unlocked(){return hasUpgrade("cookie",63)||hasUpgrade("cookie",64)||hasUpgrade("cookie",65)},
            style(){return{'height':'100px','width':'100px'}}
        },
        75: {
            title: "Blank Crackers",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(1000000000000),
            unlocked(){return hasUpgrade("cookie",64)||hasUpgrade("cookie",65)||hasUpgrade("cookie",66)},
            style(){return{'height':'100px','width':'100px'}}
        },
        76: {
            title: "Blank Crackers",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(1000000000000),
            unlocked(){return hasUpgrade("cookie",65)||hasUpgrade("cookie",66)},
            style(){return{'height':'100px','width':'100px'}}
        },
        81: {
            title: "Blank Crackers",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(100000000000000),
            unlocked(){return hasUpgrade("cookie",71)||hasUpgrade("cookie",72)},
            style(){return{'height':'100px','width':'100px'}}
        },
        82: {
            title: "Blank Crackers",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(100000000000000),
            unlocked(){return hasUpgrade("cookie",71)||hasUpgrade("cookie",72)||hasUpgrade("cookie",73)},
            style(){return{'height':'100px','width':'100px'}}
        },
        83: {
            title: "Blank Crackers",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(100000000000000),
            unlocked(){return hasUpgrade("cookie",72)||hasUpgrade("cookie",73)||hasUpgrade("cookie",74)},
            style(){return{'height':'100px','width':'100px'}}
        },
        84: {
            title: "Blank Crackers",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(100000000000000),
            unlocked(){return hasUpgrade("cookie",73)||hasUpgrade("cookie",74)||hasUpgrade("cookie",75)},
            style(){return{'height':'100px','width':'100px'}}
        },
        85: {
            title: "Blank Crackers",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(100000000000000),
            unlocked(){return hasUpgrade("cookie",74)||hasUpgrade("cookie",75)||hasUpgrade("cookie",76)},
            style(){return{'height':'100px','width':'100px'}}
        },
        86: {
            title: "Blank Crackers",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(100000000000000),
            unlocked(){return hasUpgrade("cookie",75)||hasUpgrade("cookie",76)},
            style(){return{'height':'100px','width':'100px'}}
        },
        91: {
            title: "Blank Crackers",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(10000000000000000),
            unlocked(){return hasUpgrade("cookie",81)||hasUpgrade("cookie",82)},
            style(){return{'height':'100px','width':'100px'}}
        },
        92: {
            title: "Blank Crackers",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(10000000000000000),
            unlocked(){return hasUpgrade("cookie",81)||hasUpgrade("cookie",82)||hasUpgrade("cookie",83)},
            style(){return{'height':'100px','width':'100px'}}
        },
        93: {
            title: "Blank Crackers",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(10000000000000000),
            unlocked(){return hasUpgrade("cookie",82)||hasUpgrade("cookie",83)||hasUpgrade("cookie",84)},
            style(){return{'height':'100px','width':'100px'}}
        },
        94: {
            title: "Blank Crackers",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(10000000000000000),
            unlocked(){return hasUpgrade("cookie",83)||hasUpgrade("cookie",84)||hasUpgrade("cookie",85)},
            style(){return{'height':'100px','width':'100px'}}
        },
        95: {
            title: "Blank Crackers",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(10000000000000000),
            unlocked(){return hasUpgrade("cookie",84)||hasUpgrade("cookie",85)||hasUpgrade("cookie",86)},
            style(){return{'height':'100px','width':'100px'}}
        },
        96: {
            title: "Blank Crackers",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(10000000000000000),
            unlocked(){return hasUpgrade("cookie",85)||hasUpgrade("cookie",86)},
            style(){return{'height':'100px','width':'100px'}}
        },
        101: {
            title: "Blank Crackers",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(1000000000000000000),
            unlocked(){return hasUpgrade("cookie",91)||hasUpgrade("cookie",92)},
            style(){return{'height':'100px','width':'100px'}}
        },
        102: {
            title: "Blank Crackers",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(1000000000000000000),
            unlocked(){return hasUpgrade("cookie",91)||hasUpgrade("cookie",92)||hasUpgrade("cookie",93)},
            style(){return{'height':'100px','width':'100px'}}
        },
        103: {
            title: "Blank Crackers",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(1000000000000000000),
            unlocked(){return hasUpgrade("cookie",92)||hasUpgrade("cookie",93)||hasUpgrade("cookie",94)},
            style(){return{'height':'100px','width':'100px'}}
        },
        104: {
            title: "Blank Crackers",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(1000000000000000000),
            unlocked(){return hasUpgrade("cookie",93)||hasUpgrade("cookie",94)||hasUpgrade("cookie",95)},
            style(){return{'height':'100px','width':'100px'}}
        },
        105: {
            title: "Blank Crackers",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(1000000000000000000),
            unlocked(){return hasUpgrade("cookie",94)||hasUpgrade("cookie",95)||hasUpgrade("cookie",96)},
            style(){return{'height':'100px','width':'100px'}}
        },
        106: {
            title: "Blank Crackers",
            description: "Boosts your cookie gain by +10%",
            cost: new Decimal(1000000000000000000),
            unlocked(){return hasUpgrade("cookie",95)||hasUpgrade("cookie",96)},
            style(){return{'height':'100px','width':'100px'}}
        },
    },
    tabFormat: ["main-display","prestige-button","resource-display",["display-text",function(){return `You have ${formatWhole(player.cookie.levels)} Ascended Levels, permanently boosting Cookie Tree resources gain by x${format(tmp.cookie.universalBoost)}`}],"blank","milestones","blank","upgrades"],
    baseResource: "cookies",
    baseAmount(){return player.bb.cookies},
    doReset(resettingLayer){
        if(tmp[resettingLayer].row>this.row&&tmp[resettingLayer].treeType=="cookie") layerDataReset("cookie")
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
    requires(){return new Decimal("1e12").div(hasAchievement("achievements","f56")?tmp.a.effect:1).div(player.bb.buyables["tea2"].gte(3)?tmp.t.teaEffect:1)},
    effect(){
        let upgradeAmount = player.u.points.add(hasUpgrade("ru",21)?1:0).add(hasUpgrade("ru",22)?player.ru.upgrades.length:0)
        let eff = hasUpgrade("ru",11)?new Decimal(2).pow(upgradeAmount):upgradeAmount.add(1)
        return eff.pow(hasUpgrade("ru",31)?player.ru.points.add(1).log(5).add(1):1)
    },
    update(diff){
        if(canReset("u")&&hasAchievement("achievements","u22")) player.u.points = player.u.points.add(1)
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
        if(tmp[resettingLayer].row>this.row&&tmp[resettingLayer].treeType=="upgrade") layerDataReset("wu")
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
    requires(){return player.wu.unlocked&&!player.ru.unlocked?new Decimal(2.5):new Decimal([2/2,4/2,7/2,13/2,25/2,49/2,97/2][player.ru.points])},
    effect(){return player.u.points.add(1)},
    resource: "right upgrades",
    baseResource: "bought upgrades",
    tooltipLocked(){return `Reach 5 bought upgrades to unlock (You have ${formatWhole(player.u.points)} bought upgrades)`},
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
            description: "Right upgrades exponentiates bought upgrade's effect at reduced rate",
            effect(){return player.ru.points.add(1).log(5).add(1)},
            effectDisplay(){return "^"+format(this.effect())},
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
            paradox: new Decimal(0),
            antiParadox: new Decimal(0),
		}},
        nodeStyle(){return {'height':`${new Decimal(100).sub(new Decimal(100).mul(player.p.antiParadox.div(player.p.paradox).mul(new Decimal(Math.sin(player.achievements.sine.mul(3.6).root(new Decimal(1).sub(new Decimal(1).mul(player.p.antiParadox.div(player.p.paradox)))))).add(1).div(2))))}px`,'width':`${new Decimal(100).sub(new Decimal(100).mul(player.p.antiParadox.div(player.p.paradox).mul(new Decimal(Math.sin(player.achievements.sine.mul(4.2).root(new Decimal(1).sub(new Decimal(1).mul(player.p.antiParadox.div(player.p.paradox)))))).add(1).div(2))))}px`}},
        effect(){return player.p.points.add(1)},
        effectDescription(){return `multiplying point and paradox gain by x${format(this.effect())}`},
        update(diff){
            if(getFactorialEquilavent().gte(hasAchievement("achievements","p13")?10:20)){
                player.p.paradox = player.p.paradox.add(tmp.p.paradoxGain.mul(diff).div(tmp.p.timeScale))
                player.p.antiParadox = player.p.antiParadox.add(tmp.p.antiParadoxGain.b.mul(diff).div(tmp.p.timeScale)).mul(tmp.p.antiParadoxGain.m.pow(diff).root(tmp.p.timeScale))
            }
            if(player.p.antiParadox.gte(player.p.paradox)&&player.p.antiParadox.gte(0.1)){
                player.p.points = player.p.points.max(player.p.paradox)
                player.p.paradox = new Decimal(0)
                player.p.antiParadox = new Decimal(0)
            }
            if(hasAchievement("achievements","p14")){
                player.p.buyables[11] = player.p.buyables[11].add(player.a.points.gte(tmp.p.buyables[11].cost)?1:0)
                player.p.buyables[12] = player.p.buyables[12].add(player.t.teas.gte(tmp.p.buyables[12].cost)?1:0)
                player.p.buyables[13] = player.p.buyables[13].add(player.u.points.gte(tmp.p.buyables[13].cost)?1:0)
            }
        },
        paradoxGain(){
            let gain = (hasAchievement("achievements","f65")?player.achievements.bestFactorifedPoints:getFactorialEquilavent()).div(100).div(player.p.paradox.add(1)).mul(tmp.p.effect.min(10))
            return gain.mul(new Decimal(2).pow(player.p.buyables[11]))
        },
        antiParadoxGain(){
            let base = new Decimal(0.1).div(new Decimal(4/3).pow(player.p.buyables[13]))
            let mult = new Decimal(2)
            return {b: base, m: mult}
        },
        timeScale(){
            return new Decimal(60).div(new Decimal(1.05).pow(paradoxAch())).div(new Decimal(1.5).pow(player.p.buyables[12]))
        },
        tabFormat: ["main-display","resource-display",["display-text", function(){return `<br>You have ${format(player.p.paradox)} paradoxes (${format(tmp.p.paradoxGain)}/sec), which you gain based on your factorified points<br>You have ${format(player.p.antiParadox)} anti paradoxes (${format(tmp.p.antiParadoxGain.b)}/sec, x${format(tmp.p.antiParadoxGain.m)})<br><br>One second in this tree equals ${format(tmp.p.timeScale)} real life seconds`+(getFactorialEquilavent().gte(hasAchievement("achievements","p13")?10:20)?"":"<br><br>You need at least "+formatWhole(hasAchievement("achievements","p13")?10:20)+" factorified points to produce anything here")}],"blank","buyables"],
		color: "#7DC7FB",
        buyables: {
            11: {
                title: "Paradoxical Averageness",
                display(){return `<h3>x2 Paradox Gain<br><br>Level: ${formatWhole(player[this.layer].buyables[this.id])}<br>Effect: x${format(this.effect())}<br>Cost: ${format(this.cost())} averagenesses`},
                cost(){return new Decimal("1e200").mul(new Decimal("1e100").pow(player[this.layer].buyables[this.id].pow(1.375))).ceil()},
                effect(){return new Decimal(2).pow(player[this.layer].buyables[this.id])},
                canAfford(){return true},
                unlocked(){return hasAchievement("achievements","p14")}
            },
            12: {
                title: "Paradoxical Averageness",
                display(){return `<h3>x1.5 Time Acceleration<br><br>Level: ${formatWhole(player[this.layer].buyables[this.id])}<br>Effect: x${format(this.effect())}<br>Cost: ${format(this.cost())} filled cups`},
                cost(){return new Decimal(100).add(player[this.layer].buyables[this.id].gte(1)?new Decimal(100).mul(player[this.layer].buyables[this.id].pow(1.25)):0).ceil()}, 
                effect(){return new Decimal(1.5).pow(player[this.layer].buyables[this.id])},
                canAfford(){return true},
                unlocked(){return hasAchievement("achievements","p14")}
            },
            13: {
                title: "Degrade-inator",
                display(){return `<h3>/1.33 Anti Paradox gain<br><br>Level: ${formatWhole(player[this.layer].buyables[this.id])}<br>Effect: /${format(this.effect())}<br>Cost: ${format(this.cost())} bought upgrades`},
                cost(){return new Decimal(16).add(player[this.layer].buyables[this.id].gte(1)?new Decimal(2).mul(player[this.layer].buyables[this.id].pow(1.125)):0).ceil()},
                effect(){return new Decimal(4/3).pow(player[this.layer].buyables[this.id])},
                canAfford(){return true},
                unlocked(){return hasAchievement("achievements","p14")}
            },
        },
        componentStyles: {
            "buyable"(){return{"border-radius":"10px","width":"180px","height":"120px"}}
        },
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
            bestFactorifedPoints: new Decimal(0),
            sine: new Decimal(0)
        }
    },
    symbol: "A",
    resource: "achievements",
    row: "side",
    update(diff){
        player.achievements.bestFactorial = player.achievements.bestFactorial.max(player.f.total)
        player.achievements.bestFactorifedPoints = player.achievements.bestFactorifedPoints.max(getFactorialEquilavent())
        player.achievements.sine = player.achievements.sine.add(diff)
        if(hasAchievement("achievements","f71")&&tmp.c.canReset) player.c.points = player.c.points.max(getFactorialEquilavent().mul(hasUpgrade("bb",21)?new Decimal(1.1).pow(player.bb.prestiges):1).floor())
    },
    tabFormat: {
        "Factorial Tree": {
            content: ["main-display", ["row",[["achievement", ["f11"]],["achievement", ["f12"]],["achievement", ["f13"]],["achievement", ["f14"]],["achievement", ["f15"]],["achievement", ["f16"]]]],["row",[["achievement", ["f21"]],["achievement", ["f22"]],["achievement", ["f23"]],["achievement", ["f24"]],["achievement", ["f25"]],["achievement", ["f26"]]]],["row",[["achievement", ["f31"]],["achievement", ["f32"]],["achievement", ["f33"]],["achievement", ["f34"]],["achievement", ["f35"]],["achievement", ["f36"]]]],["row",[["achievement", ["f41"]],["achievement", ["f42"]],["achievement", ["f43"]],["achievement", ["f44"]],["achievement", ["f45"]],["achievement", ["f46"]]]],["row",[["achievement", ["f51"]],["achievement", ["f52"]],["achievement", ["f53"]],["achievement", ["f54"]],["achievement", ["f55"]],["achievement", ["f56"]]]],["row",[["achievement", ["f61"]],["achievement", ["f62"]],["achievement", ["f63"]],["achievement", ["f64"]],["achievement", ["f65"]],["achievement", ["f66"]]]],["row",[["achievement", ["f71"]],["achievement", ["f72"]],["achievement", ["f73"]],["achievement", ["f74"]],["achievement", ["f75"]],["achievement", ["f76"]]]],["row",[["achievement", ["f81"]],["achievement", ["f82"]],["achievement", ["f83"]],["achievement", ["f84"]],["achievement", ["f85"]],["achievement", ["f86"]]]]],
            unlocked(){return hasAchievement("achievements","f16")},
        },
        "Cookie Tree": {
            content: ["main-display", ["row",[["achievement", ["c11"]],["achievement", ["c12"]],["achievement", ["c13"]],["achievement", ["c14"]],["achievement", ["c15"]],["achievement", ["c16"]]]],["row",[["achievement", ["c21"]],["achievement", ["c22"]],["achievement", ["c23"]],["achievement", ["c24"]],["achievement", ["c25"]],["achievement", ["c26"]]]],["row",[["achievement", ["c31"]],["achievement", ["c32"]],["achievement", ["c33"]],["achievement", ["c34"]],["achievement", ["c35"]],["achievement", ["c36"]]]],["row",[["achievement", ["c41"]],["achievement", ["c42"]],["achievement", ["c43"]],["achievement", ["c44"]],["achievement", ["c45"]],["achievement", ["c46"]]]],["row",[["achievement", ["c51"]],["achievement", ["c52"]],["achievement", ["c53"]],["achievement", ["c54"]],["achievement", ["c55"]],["achievement", ["c56"]]]],["row",[["achievement", ["c61"]],["achievement", ["c62"]],["achievement", ["c63"]],["achievement", ["c64"]],["achievement", ["c65"]],["achievement", ["c66"]]]],["row",[["achievement", ["c71"]],["achievement", ["c72"]],["achievement", ["c73"]],["achievement", ["c74"]],["achievement", ["c75"]],["achievement", ["c76"]]]],["row",[["achievement", ["c81"]],["achievement", ["c82"]],["achievement", ["c83"]],["achievement", ["c84"]],["achievement", ["c85"]],["achievement", ["c86"]]]],,["row",[["achievement", ["c91"]],["achievement", ["c92"]],["achievement", ["c93"]],["achievement", ["c94"]],["achievement", ["c95"]],["achievement", ["c96"]]]],["row",[["achievement", ["c101"]],["achievement", ["c102"]],["achievement", ["c103"]],["achievement", ["c104"]],["achievement", ["c105"]],["achievement", ["c106"]]]]],
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
            name: `"i bet this tree can't get any more classic"`,
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
            name: "Triple A... uh",
            tooltip: "Get 3 classicalities",
            done(){return player.c.points.gte(3)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return player.c.points.gte(1)||hasAchievement("achievements","f42")}
        },
        f43:{
            name: "Iconic Magnitude!",
            tooltip: "Get 4 classicalities<br>Reward: Unlocks another tree",
            done(){return player.c.points.gte(4)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f42")}
        },
        f44:{
            name: "Lap 2 Complete",
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
            name: "the four layers used to live in harmony...",
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
            name: "",
            tooltip: `Reach 25 Factorials`,
            done(){return player.f.total.gte(25)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f51")||hasAchievement("achievements","f46")}
        },
        f53:{
            name: "A shiny quarter to cherish",
            tooltip: `Get 25 Classicalities<br>Reward: Unlocks yet another tree`,
            done(){return player.c.points.gte(25)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f46")}
        },
        f54:{
            name: "Friday the 13th",
            tooltip: `Get 13 Factorials in 2nd challenge`,
            done(){return player.a.challengeScore2.gte(13)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f53")}
        },
        f55:{
            name: "Not so average now",
            tooltip: `Reach x100 averagenesses effect`,
            done(){return tmp.a.effect.gte(100)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f54")}
        },
        f56:{
            name: "Intergalactical High Five",
            tooltip: `Reach 22 factorified points<br>Reward: Averageness's effect cheapens bought upgrades and bought upgrades add up 1st and 4th classicalities's clickables`,
            done(){return getFactorialEquilavent().gte(22)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f56")||hasAchievement("achievements","f55")}
        },
        f61:{
            name: "uh oh",
            tooltip: `Get 4 Factorials in 1st challenge`,
            done(){return player.a.challengeScore.gte(4)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f56")||hasAchievement("achievements","f61")}
        },
        f62:{
            name: "Gotta keep up with traditions, you know",
            tooltip: `Get 30 Factorials`,
            done(){return player.f.total.gte(30)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f61")||hasAchievement("achievements","f62")}
        },
        f63:{
            name: "mmmmmm chaotixs",
            tooltip: `Get 32 Factorials`,
            done(){return player.f.total.gte(32)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f62")}
        },
        f64:{
            name: "IS THAT A PRESTIGE TREE REFERENCE?!",
            tooltip: `Get 40 classicalities<br>Reward: Unlocks 4th layer in Factorial Tree`,
            done(){return player.c.points.gte(40)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f63")||hasAchievement("achievements","f62")}
        },
        f65:{
            name: "Advanced Bipolar Hallucination",
            tooltip: `Reach 24 factorified points<br>Reward: Your paradox gain is based on your highest factorified points instead`,
            done(){return getFactorialEquilavent().gte(22)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f63")||hasAchievement("achievements","f64")}
        },
        f66:{
            name: "Get load of this!",
            tooltip: `Reach 2 tributes`,
            done(){return player.tf.points.gte(2)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f65")||hasAchievement("achievements","f64")}
        },
        f71:{
            name: "YESSIR",
            tooltip: `Reach 3 tributes<br>Reward: You automatically gain classicalities whenever they're available`,
            done(){return player.tf.points.gte(3)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f65")||hasAchievement("achievements","f66")}
        },
        f72:{
            name: "Factorified points are just Passive Factorials",
            tooltip: `Reach 30 factorified points`,
            done(){return getFactorialEquilavent().gte(30)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f71")||hasAchievement("achievements","f66")}
        },
        f73:{
            name: "Penultimate Factoration",
            tooltip: `Reach 10 tributes<br>Reward: You keep averageness challenge completions on Row 3 reset`,
            done(){return player.tf.points.gte(10)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f71")||hasAchievement("achievements","f72")}
        },
        f74:{
            name: "Factorified points are just Passive Factorials",
            tooltip: `Reach 25 tributes<br>Reward: You keep averageness upgrades on Row 3 reset and your 8th Factorial Tree achievement uses best Factorial instead`,
            done(){return player.tf.points.gte(25)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f73")||hasAchievement("achievements","f72")}
        },
        f75:{
            name: "Barely useful",
            tooltip: `Reach 42 tributes`,
            done(){return player.tf.points.gte(42)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f73")||hasAchievement("achievements","f74")}
        },
        f76:{
            name: "The Last Nail to The Grinding's Coffin",
            tooltip: `Reach 145 Factorials<br>Reward: You may quick grind back to your best Factorial`,
            done(){return player.f.total.gte(145)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","f73")||hasAchievement("achievements","f74")}
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
            name: "Could use some jelly right now",
            tooltip: "Reach 25 butter biscuits",
            done(){return player.bb.points.gte(25)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c16")}
        },
        c24:{
            name: "Not enough for 34 cursors.",
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
            name: "Getting somewhere, alright",
            tooltip: "Reach 100,000 cookies",
            done(){return player.bb.cookies.gte(100000)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c24")}
        },
        c31:{
            name: "Recursive Economy",
            tooltip: "Reach 100 butter biscuits<br>Reward: Unlocks 2nd type of butter buscuits",
            done(){return player.bb.points.gte(100)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c25")}
        },
        c32:{
            name: "No.",
            tooltip: "Reach 1,000,000 cookies",
            done(){return player.bb.cookies.gte(1000000)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c26")}
        },
        c33:{
            name: "The Maker Maker",
            tooltip: "Get 5 of Cookie Makers each",
            done(){return player.bb.buyables[11].gte(5)&&player.bb.buyables[21].gte(5)&&player.bb.buyables[31].gte(5)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c33")||hasUpgrade("bb",14)}
        },
        c34:{
            name: "Cookieionaire",
            tooltip: "Reach 10,000,000 cookies",
            done(){return player.bb.cookies.gte(10000000)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c32")}
        },
        c35:{
            name: "Self-Referencing Shenanigans",
            tooltip: `Get 10 of Cookie Makers each<br>Reward: Each "Get X of Cookie Maker" achievement boosts cookie gain by +30%`,
            done(){return player.bb.buyables[11].gte(10)&&player.bb.buyables[21].gte(10)&&player.bb.buyables[31].gte(10)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c33")}
        },
        c36:{
            name: "Megazord Chocolate Butter Biscuits",
            tooltip: "Reach 4 chocolate butter biscuits<br>Reward: Unlocks CBB upgrades and you keep upgrades on reset",
            done(){return player.bb.prestiges.gte(4)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c31")}
        },
        c41:{
            name: "Yet another obligatory kitten achievement",
            tooltip: "Reach 100,000,000 cookies",
            done(){return player.bb.cookies.gte(100000000)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c34")}
        },
        c42:{
            name: "Mr. MacGuffins",
            tooltip: "Purchase all CBB upgrades",
            done(){return hasUpgrade("bb",21)&&hasUpgrade("bb",22)&&hasUpgrade("bb",23)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c36")}
        },
        c43:{
            name: "Master Chief<h5>(has nothing to do with an iconic character named master chief from halo)",
            tooltip: `Get 15 of Cookie Makers each`,
            done(){return player.bb.buyables[11].gte(15)&&player.bb.buyables[21].gte(15)&&player.bb.buyables[31].gte(15)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c35")}
        },
        c44:{
            name: "Where you're going to keep all those cookies at?",
            tooltip: "Reach 1,000,000,000 cookies",
            done(){return player.bb.cookies.gte(1000000000)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c41")}
        },
        c45:{
            name: "Bulky Chocolate Butter Buscuit",
            tooltip: "Reach 7 chocolate butter biscuits<br>Reward: You keep Cookie Makers on reset",
            done(){return player.bb.prestiges.gte(7)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c44")||hasAchievement("achievements","c45")}
        },
        c46:{
            name: "Excuse me what.",
            tooltip: "Reach 10,000,000,000 cookies<br>Reward:<br><h2>GO BEYOND.",
            done(){return player.bb.cookies.gte(10000000000)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c44")}
        },
        c51:{
            name: "Sweet home India.",
            tooltip: "Fill one cup.",
            done(){return player.t.teas.gte(1)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasMilestone("cookie",0)}
        },
        c52:{
            name: "And another one...",
            tooltip: "Fill two cups.",
            done(){return player.t.teas.gte(2)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c51")}
        },
        c53:{
            name: "and another one...",
            tooltip: "Fill three cups.",
            done(){return player.t.teas.gte(3)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c52")}
        },
        c54:{
            name: "another one bites the cup.",
            tooltip: "Fill four cups.",
            done(){return player.t.teas.gte(4)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c53")}
        },
        c55:{
            name: "Why.",
            tooltip: "Add milk into the cup.",
            done(){return player.bb.buyables["tea2"].gte(1)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c54")||hasAchievement("achievements","c55")}
        },
        c56:{
            name: "Did you know you can make multiple cups of tea with a single tea bag?",
            tooltip: "Fill five cups.<br>Reward: Unlocks prestige in Tea layer",
            done(){return player.t.teas.gte(5)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c54")||hasAchievement("achievements","c55")}
        },
        c61:{
            name: "Papyrus, Jacorb and Aarex enter the bar...",
            tooltip: "Get 3 teacups.",
            done(){return player.t.points.gte(3)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c56")||hasAchievement("achievements","c55")}
        },
        c62:{
            name: "Enough for The Mann",
            tooltip: "Fill six cups.",
            done(){return player.t.teas.gte(6)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c56")||hasAchievement("achievements","c61")}
        },
        c63:{
            name: "World Domination",
            tooltip: "Reach 100,000,000,000 cookies",
            done(){return player.bb.cookies.gte(100000000000)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c61")||hasAchievement("achievements","c62")}
        },
        c64:{
            name: "That cup is not big enough for two of us.",
            tooltip: "Get the 2nd tea bag.",
            done(){return player.t.prestiges.gte(2)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c63")||hasAchievement("achievements","c62")}
        },
        c65:{
            name: "I don't have any punchlines for this one",
            tooltip: "Reach 1 trillion cookies",
            done(){return player.bb.cookies.gte(1000000000000)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c63")}
        },
        c66:{
            name: "Masterful Disaster",
            tooltip: `Get 20 of Cookie Makers each`,
            done(){return player.bb.buyables[11].gte(20)&&player.bb.buyables[21].gte(20)&&player.bb.buyables[31].gte(20)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c64")||hasAchievement("achievements","c65")}
        },
        c71:{
            name: "Unrestrained Inflation",
            tooltip: `Get 6 tea bags`,
            done(){return player.t.prestiges.gte(6)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c66")||hasAchievement("achievements","c65")}
        },
        c72:{
            name: "Cursor Breaker",
            tooltip: "Reach 10 trillion cookies",
            done(){return player.bb.cookies.gte("1e13")},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c66")||hasAchievement("achievements","c71")}
        },
        c73:{
            name: "The Rolling Knight",
            tooltip: "Reach 100 trillion cookies",
            done(){return player.bb.cookies.gte("1e14")},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c72")||hasAchievement("achievements","c71")}
        },
        c74:{
            name: "Farming Session Truly Begins",
            tooltip: "Reach 1 quadrillion cookies",
            done(){return player.bb.cookies.gte("1e15")},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c73")||hasAchievement("achievements","c72")}
        },
        c75:{
            name: "Don't mine at night.",
            tooltip: "Reach 1 quintillion cookies",
            done(){return player.bb.cookies.gte("1e18")},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c74")||hasAchievement("achievements","c73")}
        },
        c76:{
            name: `"hahaha seckz number syntax im's so funny and original"`,
            tooltip: "Reach 1 sextillion cookies",
            done(){return player.bb.cookies.gte("1e21")},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c75")||hasAchievement("achievements","c74")}
        },
        c81:{
            name: "Devious Bakery",
            tooltip: `Get 25 of Cookie Makers each<br>Reward: You can bulk buy Cookie Makers`,
            done(){return player.bb.buyables[11].gte(25)&&player.bb.buyables[21].gte(25)&&player.bb.buyables[31].gte(25)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c75")||hasAchievement("achievements","c76")}
        },
        c82:{
            name: "Unbankable.",
            tooltip: "Reach 1 septillion cookies",
            done(){return player.bb.cookies.gte("1e24")},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c81")||hasAchievement("achievements","c76")}
        },
        c83:{
            name: "Cookie God is satisfied.",
            tooltip: "Reach 1 octillion cookies",
            done(){return player.bb.cookies.gte("1e27")},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c81")||hasAchievement("achievements","c82")}
        },
        c84:{
            name: "A slow idling grindsim with benefitial teas? Sign me up!",
            tooltip: "Fill 30 cups<br>Reward: Resolved paradoxes nerfs tea bag softcap",
            done(){return player.t.teas.gte(30)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c83")||hasAchievement("achievements","c82")}
        },
        c85:{
            name: "UNLIMITED POWER!",
            tooltip: "Reach 1 nonillion cookies",
            done(){return player.bb.cookies.gte("1e30")},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c83")||hasAchievement("achievements","c84")}
        },
        c86:{
            name: "Reject Cheese Moon, Embrace Milky Way",
            tooltip: "Reach 1 decillion cookies",
            done(){return player.bb.cookies.gte("1e33")},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c85")||hasAchievement("achievements","c84")}
        },
        c91:{
            name: "Loatable Application Business",
            tooltip: "Reach 1 undecillion cookies",
            done(){return player.bb.cookies.gte("1e36")},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c85")||hasAchievement("achievements","c86")}
        },
        c92:{
            name: "Milk Star Restaurant",
            tooltip: `Get 30 of Cookie Makers each`,
            done(){return player.bb.buyables[11].gte(30)&&player.bb.buyables[21].gte(30)&&player.bb.buyables[31].gte(30)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c91")||hasAchievement("achievements","c86")}
        },
        c93:{
            name: "Are they really worth it?",
            tooltip: "Reach 1 tredecillion cookies",
            done(){return player.bb.cookies.gte("1e39")},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c91")||hasAchievement("achievements","c92")}
        },
        c94:{
            name: "The call of kittens is calling you",
            tooltip: `Get 35 of Cookie Makers each`,
            done(){return player.bb.buyables[11].gte(35)&&player.bb.buyables[21].gte(35)&&player.bb.buyables[31].gte(35)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c92")||hasAchievement("achievements","c93")}
        },
        c95:{
            name: "The Pinnacle of Self-Improvisation",
            tooltip: `Get 40 of Cookie Makers each`,
            done(){return player.bb.buyables[11].gte(40)&&player.bb.buyables[21].gte(40)&&player.bb.buyables[31].gte(40)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c94")||hasAchievement("achievements","c93")}
        },
        c96:{
            name: "We've made so many achievements that we are starting to run out of ideas as what to put next",
            tooltip: `Get 45 of Cookie Makers each`,
            done(){return player.bb.buyables[11].gte(45)&&player.bb.buyables[21].gte(45)&&player.bb.buyables[31].gte(45)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements","c94")||hasAchievement("achievements","c95")}
        },
        u11:{
            name: "Seems pretty familiar",
            tooltip: `Purchase "Up" upgrade`,
            done(){return player.u.upgrades.length>=1},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
        },
        u12:{
            name: "May the Flour be with you.",
            tooltip: `Perform a 2nd row reset`,
            done(){return player.wu.unlocked||player.ru.unlocked},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements", "u11")}
        },
        u13:{
            name: "THE PRICING...<br><br><br>IT'S OVERFLOWING!",
            tooltip: `Purchase your 2nd Row 2 upgrade`,
            done(){return hasUpgrade("wu",21)||hasUpgrade("ru",21)||hasUpgrade("ru",22)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements", "u12")}
        },
        u14:{
            name: "You just fell for the oldest trick in Incrementals.<h5>(and you're going to fall for it again)",
            tooltip: `Unlock both Row 2 layers`,
            done(){return player.wu.unlocked && player.ru.unlocked},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements", "u13")}
        },
        u15:{
            name: "Upgrades, people! Upgrades!",
            tooltip: `Purchase 5 upgrades in total`,
            done(){return player.u.upgrades.length+player.wu.upgrades.length+player.ru.upgrades.length>=5},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements", "u14")}
        },
        u16:{
            name: "(the amount of upgrades you're most likely to have after reaching the endgame)",
            tooltip: `Get 8 bought upgrades`,
            done(){return player.u.points.gte(8)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements", "u15")}
        },
        u21:{
            name: "Can't make wrong choices if you can only make right ones",
            tooltip: `Purchase all right upgrades`,
            done(){return hasUpgrade("ru",31)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements", "u16")}
        },
        u22:{
            name: "Automatization Intensifies",
            tooltip: `Get 5 right upgrades<br>Reward: You automatically gain bought upgrades`,
            done(){return player.ru.points.gte(5)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements", "u21")}
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
            name: "Those Antimatter Dimensions NG-5 jokes are getting on my nerves",
            tooltip: `Reach 0.5 resolved paradox`,
            done(){return player.p.points.gte(0.5)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements", "p11")}
        },
        p13:{
            name: "Hell yeah! NOW we're getting somewhere far.",
            tooltip: `Reach 1 resolved paradox<br>Reward: You start generating paradoxes and anti-paradoxes at 10 factorified points instead`,
            done(){return player.p.points.gte(1)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements", "p12")}
        },
        p14:{
            name: "Hey. Can't have Paradox Tree without obligatory AD NG-5 references",
            tooltip: `Reach 2 resolved paradoxes<br>Reward: Unlocks Paradox Self-Upgradables`,
            done(){return player.p.points.gte(2)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements", "p13")}
        },
        p15:{
            name: "Quadruple Issue",
            tooltip: `Reach 4 resolved paradoxes`,
            done(){return player.p.points.gte(4)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements", "p14")}
        },
        p16:{
            name: "RIDDLE ME THIS, DR. OCTOPUS...",
            tooltip: `Reach 8 resolved paradoxes<br>(Paradox's paradox gain boost is hardcapped at x10)`,
            done(){return player.p.points.gte(8)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements", "p15")}
        },
        p21:{
            name: "More bits =/= Better sellings",
            tooltip: `Reach 32 resolved paradoxes`,
            done(){return player.p.points.gte(32)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements", "p16")}
        },
        p22:{
            name: "How does Mario come back exactly?",
            tooltip: `Reach 128 resolved paradoxes`,
            done(){return player.p.points.gte(128)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements", "p21")}
        },
        p23:{
            name: "<h5>oh, hey there. i see you made some good progress so far. it's sad to say, but this is the endgame",
            tooltip: `Reach 512 resolved paradoxes`,
            done(){return player.p.points.gte(512)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements", "p22")}
        },
        p24:{
            name: "yeah, you can't progress any further now",
            tooltip: `Reach 2,048 resolved paradoxes`,
            done(){return player.p.points.gte(2048)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements", "p23")}
        },
        p25:{
            name: "lalalallala",
            tooltip: `Reach 8,192 resolved paradoxes`,
            done(){return player.p.points.gte(8192)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements", "p24")}
        },
        p26:{
            name: "i hope they won't see me acting stupid",
            tooltip: `Reach 32,768 resolved paradoxes`,
            done(){return player.p.points.gte(32768)},
            onComplete(){
                player.achievements.points = player.achievements.points.add(1)
            },
            unlocked(){return hasAchievement("achievements", "p25")}
        },
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