function GetRandomInteger(p, q) {
    return Math.floor(Math.random() * (q - p + 1)) + p;
}

function GetChar(number) {
    return String.fromCharCode(64 + number);
}

function NewGraph() {
    nodes = new vis.DataSet(
        nodeList.map(node => ({ id: node, label: node, color: '#97C2FC' }))
    );
    edges = new vis.DataSet(
        edgeList.map((edge, index) => ({ id: index, from: edge[0], to: edge[1], color: { color: '#848484' }, smooth: false }))
    );
    container = document.getElementById('mynetwork');
    data = {
        nodes: nodes,
        edges: edges
    };

    network = new vis.Network(container, data, options);
}

function EdgeExist(nodeA, nodeB) {
    for (let i = 0; i < edgeList.length; i++) {
        const edge = edgeList[i];
        if ((edge[0] === nodeA && edge[1] === nodeB) || (edge[0] === nodeB && edge[1] === nodeA)) {
            return true;
        }
    }
    return false;
}

function ChangeNodeColor(newid, newcolor) {
    nodes.update([{ id: newid, color: { background: newcolor } }]);
}

function ChangeEdgeColor(newid, newcolor) {
    edges.update([{ id: newid, color: { color: newcolor } }]);
}

function GetColorForLayer(layer) {
    const colors = ['#FF5733', '#FFC300', '#33FF57', '#339CFF', '#FF33C6', '#33FFFF', '#F5A9D0', '#7B68EE', '#58D3F7', '#F1C40F'];
    return colors[layer % colors.length];
}

function AppendStep(step) {
    let stepsList = document.querySelector('.steps');
    let stepItem = document.createElement('li');
    stepItem.textContent = step;
    stepsList.appendChild(stepItem);
}

let n_nodes = 0;
let nodeList = [];
let edgeList = [];

function Main(event) {
    n_nodes = document.getElementById('n_nodes').value;
    nodeList = [];
    edgeList = [];
    const minConnections = 1;
    const maxConnections = Math.min(n_nodes - 1, 5);

    for (let i = 1; i <= n_nodes; i++) {
        let nodeA = GetChar(i);
        nodeList.push(nodeA);

        const numConnections = GetRandomInteger(minConnections, maxConnections);
        const otherNodes = Array.from({ length: n_nodes }, (_, j) => GetChar(j + 1)).filter(node => node !== nodeA);
        shuffleArray(otherNodes);

        for (let k = 0; k < numConnections; k++) {
            let nodeB = otherNodes[k];
            if (!EdgeExist(nodeA, nodeB)) {
                let newEdge = [nodeA, nodeB];
                edgeList.push(newEdge);
            }
        }
    }
    NewGraph();
}



function Traverse(event) {
    let type = document.getElementById('traversalType').value;
    if (n_nodes < 3) return;
    if (type === 'BFS') BFS();
    if (type === 'DFS') DFS();
}

let bfsState = {
    queue: [],
    visited: {},
    inQueue: {},
    layer: 0,
    currentNode: null,
    connectedEdges: [],
    connectedNodes: []
};

function BFS() {
    bfsState.queue = [{ node: nodeList[0], layer: 0 }];
    AppendStep(`Push node ${nodeList[0]} into the queue.`);
    bfsState.visited = {};
    bfsState.inQueue = { [nodeList[0]]: true };
    bfsState.layer = 0;
    bfsState.currentNode = null;
    bfsState.connectedEdges = [];
    bfsState.connectedNodes = [];
}

function NextStep() {
    if (bfsState.queue.length > 0) {
        if (bfsState.currentNode === null) {
            let { node, layer } = bfsState.queue.shift();
            bfsState.currentNode = node;
            bfsState.layer = layer;
            AppendStep(`Pop node ${node} from the queue.`);
            ChangeNodeColor(node, GetColorForLayer(layer));
            bfsState.visited[node] = true;

            bfsState.connectedEdges = [];
            edgeList.forEach((edge, index) => {
                if (edge[0] === node || edge[1] === node) {
                    ChangeEdgeColor(index, GetColorForLayer(layer));
                    bfsState.connectedEdges.push(index);
                }
            });

            bfsState.connectedNodes = [];
            edgeList.forEach(edge => {
                if (edge[0] === node && !(edge[1] in bfsState.visited)) {
                    bfsState.connectedNodes.push(edge[1]);
                } else if (edge[1] === node && !(edge[0] in bfsState.visited)) {
                    bfsState.connectedNodes.push(edge[0]);
                }
            });
            AppendStep(`Adjacent unvisited nodes of ${node} are: ${bfsState.connectedNodes.join(', ')}`);
        } else {
            let unvisitedConnectedNodes = bfsState.connectedNodes.filter(node => !bfsState.inQueue[node]);
            unvisitedConnectedNodes.forEach(adjNode => {
                ChangeNodeColor(adjNode, GetColorForLayer(bfsState.layer + 1));
                bfsState.queue.push({ node: adjNode, layer: bfsState.layer + 1 });
                bfsState.inQueue[adjNode] = true;
                AppendStep(`Push node ${adjNode} into the queue.`);
            });

            bfsState.connectedEdges.forEach(edgeId => {
                ChangeEdgeColor(edgeId, '#848484');
            });

            bfsState.currentNode = null;
        }
    } else {
        AppendStep("BFS complete. All nodes visited.");
    }
}

document.getElementById('n_nodes').addEventListener('change', Main);
document.getElementById('traversalType').addEventListener('change', Traverse);

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
