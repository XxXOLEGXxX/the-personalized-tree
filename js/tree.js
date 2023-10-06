var layoutInfo = {
    startTab: "none",
    startNavTab: "tree-tab",
	showTree: true,

    treeLayout: ""

    
}


// A "ghost" layer which offsets other layers in the tree
addNode("blank", {
    layerShown: "ghost",
}, 
)


addLayer("tree-tab", {
    tabFormat: {
        "Factorial Tree": {
            content: [["tree", [["f"],["a","c"],["tf"]]]],
            unlocked(){return hasAchievement("achievements", "f16")},
        },
        "Cookie Tree": {
            content: [["tree", [["bb","t"],["cookie"]]]],
            unlocked(){return hasAchievement("achievements", "f16")},
        },
        "Upgrade Tree": {
            content: [["tree", [["u"],["wu","ru"]]]],
            unlocked(){return hasAchievement("achievements", "f43")},
        },
        "Paradox Tree": {
            content: [["tree", [["p"]]]],
            unlocked(){return hasAchievement("achievements", "f53")},
        }
    },
    previousTab: "",
    leftTab: true,
})