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
            content: [["tree", [["f"],["a","c"]]]],
            unlocked(){return hasAchievement("achievements", "f16")},
        },
        "Cookie Tree": {
            content: [["tree", [["bb"]]]],
            unlocked(){return hasAchievement("achievements", "f16")},
        }
    },
    previousTab: "",
    leftTab: true,
})