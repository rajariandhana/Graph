function GetRandomInteger(p, q)
{
    return Math.floor(Math.random() * (q - p + 1)) + p;
}
function GetChar(number)
{
    return String.fromCharCode(64 + number);
}
function NewGraph() {
    nodes = new vis.DataSet(
        nodeList.map(node => ({ id: node, label: node, color: '#97C2FC' }))
    );
    edges = new vis.DataSet(
        edgeList.map(edge => ({ from: edge[0], to: edge[1], color: { color: '#848484' }, smooth: false }))
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
function ChangeNodeColor(newid, newcolor)
{
    nodes.update([{id: newid, color:newcolor}]);
}
function ChangeEdgeColor(newid, newcolor)
{
    edges.update([{id: newid, color:newcolor}]);
}
function GetColorForLayer(layer) {
    const colors = ['#FF5733', '#FFC300', '#33FF57', '#339CFF', '#FF33C6', '#33FFFF', '#F5A9D0', '#7B68EE', '#58D3F7', '#F1C40F'];
    return colors[layer % colors.length];
}

let n_nodes = 0;
let nodeList = [];
let edgeList = [];
function Main(event)
{
    event.preventDefault();
    n_nodes = document.getElementById('n_nodes').value;
    nodeList = [];
    edgeList = [];
    if(n_nodes < 5 || n_nodes > 20) return;

    // Define minimum and maximum number of connections per node
    const minConnections = 1;
    const maxConnections = Math.min(n_nodes - 1, 5); // Ensure there are enough nodes to connect to

    for(let i = 1; i <= n_nodes; i++) {
        let nodeA = GetChar(i);
        nodeList.push(nodeA);
        
        // Generate a random number of connections for the current node
        const numConnections = GetRandomInteger(minConnections, maxConnections);
        
        // Create an array of nodes excluding the current one
        const otherNodes = Array.from({ length: n_nodes }, (_, j) => GetChar(j + 1)).filter(node => node !== nodeA);
        
        // Shuffle the array of other nodes to randomize the connection order
        shuffleArray(otherNodes);

        // Select the first numConnections nodes from the shuffled array
        for(let k = 0; k < numConnections; k++) {
            let nodeB = otherNodes[k];
            if (!EdgeExist(nodeA, nodeB)) {
                let newEdge = [nodeA, nodeB];
                edgeList.push(newEdge);
            }
        }
    }
    console.log(n_nodes);
    console.log(nodeList);
    console.log(edgeList);
    NewGraph();

}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
function BFS() {
    let queue = [];
    let res = [];
    queue.push({ node: nodeList[0], layer: 0 });
    AppendStep(`Push node ${nodeList[0]} into the queue.`);
    let visited = {};
    let inQueue = {};
    inQueue[nodeList[0]] = true;

    // Define a function to process the next step in the BFS after a delay
    function processNextStep() {
        if (queue.length > 0) {
            let { node, layer } = queue.shift();
            AppendStep(`Pop node ${node} from the queue.`);
            ChangeNodeColor(node, GetColorForLayer(layer));
            visited[node] = true;

            // Change the color of the edges connected to the current node
            let connectedEdges = [];
            edgeList.forEach((edge, index) => {
                if (edge[0] === node || edge[1] === node) {
                    ChangeEdgeColor(index, GetColorForLayer(layer));
                    connectedEdges.push(index);
                }
            });

            setTimeout(function() {
                let connectedNodes = [];
                edgeList.forEach(edge => {
                    if (edge[0] == node && !(edge[1] in visited)) {
                        connectedNodes.push(edge[1]);
                    } else if (edge[1] == node && !(edge[0] in visited)) {
                        connectedNodes.push(edge[0]);
                    }
                });
                AppendStep(`Adjacent unvisited nodes of ${node} are: ${connectedNodes.join(', ')}`);
                let unvisConNodes = [];
                connectedNodes.forEach(adjNode => {
                    if (!inQueue[adjNode]) {
                        ChangeNodeColor(adjNode, GetColorForLayer(layer + 1));
                        queue.push({ node: adjNode, layer: layer + 1 });
                        inQueue[adjNode] = true;
                        unvisConNodes.push(adjNode)
                    }
                });
                if(unvisConNodes.length>0)
                {AppendStep(`Push nodes ${unvisConNodes} into the queue.`);}

                setTimeout(function() {
                    // Revert the color of the edges connected to the current node
                    connectedEdges.forEach(edgeId => {
                        ChangeEdgeColor(edgeId, '#848484');
                    });

                    setTimeout(processNextStep, 1000);
                }, 1000);
            }, 1000);
        } else {
            AppendStep("BFS complete. All nodes visited.");
            console.log(res);
        }
    }

    // Start processing the BFS steps
    processNextStep();
}



document.getElementById('myForm').addEventListener('submit', Main);
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

function AppendStep(step) {
    let stepsList = document.querySelector('.steps');
    let stepItem = document.createElement('li');
    stepItem.textContent = step;
    stepsList.appendChild(stepItem);
}