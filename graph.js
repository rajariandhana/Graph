let n_nodes = 0;
let nodeList = [];
let edgeList = [];

let nodes = new vis.DataSet();
let edges = new vis.DataSet();
let container = document.getElementById('mynetwork');
let data = {
    nodes: nodes,
    edges: edges
};
let options = {
    edges: {
        smooth: {
            type: 'straightCross',
            roundness: 0
        }
    },
    physics: {
        forceAtlas2Based: {
            gravitationalConstant: -50,
            centralGravity: 0.005,
            springLength: 100,
            springConstant: 0.18
        },
        maxVelocity: 146,
        solver: 'forceAtlas2Based',
        timestep: 0.35,
        stabilization: { iterations: 150 }
    },
    layout: {
        improvedLayout: true
    }
};
let network = new vis.Network(container, data, options);