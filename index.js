function GetRandomInteger(p, q)
{
    return Math.floor(Math.random() * (q - p + 1)) + p;
}
function GetChar(number)
{
    return String.fromCharCode(64 + number);
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

function NewGraph()
{
    nodes = new vis.DataSet(
        nodeList.map(node => ({ id: node, label: node, color: '#97C2FC' }))
    );
    edges = new vis.DataSet(
        edgeList.map(edge => ({ from: edge[0], to: edge[1], color: { color: '#848484' } }))
    );
    container = document.getElementById('mynetwork');
    data = {
        nodes: nodes,
        edges: edges
    };
    network = new vis.Network(container, data, options);
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
    if(n_nodes < 5 || n_nodes > 15) return;

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
function DFS() {
    let stack = [];
    let res = [];
    stack.push(nodeList[0]);
    console.log(stack);
    let visited = {};
    let inStack = {};
    inStack[nodeList[0]] = true;
    res.push(nodeList[0]);

    // Define a function to process the next step in the DFS after a delay
    function processNextStep() {
        setTimeout(function() {
            if (stack.length > 0) {
                let cur = stack.pop();
                ChangeNodeColor(cur, 'blue');
                inStack[cur] = false;
                console.log("cur " + cur);
                if (!(cur in visited)) {
                    visited[cur] = true;
                    ChangeNodeColor(cur, 'red');
                    res.push(cur);
                    edgeList.forEach(edge => {
                        if (edge[0] == cur && !(edge[1] in visited)) {
                            if (!inStack[edge[1]]) {
                                stack.push(edge[1]);
                                inStack[edge[1]] = true;
                            }
                        } else if (edge[1] == cur && !(edge[0] in visited)) {
                            if (!inStack[edge[0]]) {
                                stack.push(edge[0]);
                                inStack[edge[0]] = true;
                            }
                        }
                    });
                }
                console.log(stack);
                // Call the function again to process the next step after a delay
                processNextStep();
            } else {
                console.log(res);
            }
        }, 1000); // Adjust the delay time as needed (here, it's set to 1 second)
    }

    // Start processing the DFS steps
    processNextStep();
}

function BFS() {
    let queue = [];
    let res = [];
    queue.push({ node: nodeList[0], layer: 0 }); // Include layer information in the queue
    console.log(queue);
    let visited = {};
    let inQueue = {};
    inQueue[nodeList[0]] = true;
    res.push(nodeList[0]);

    // Define a function to process the next step in the BFS after a delay
    function processNextStep() {
        setTimeout(function() {
            if (queue.length > 0) {
                let { node, layer } = queue.shift();
                ChangeNodeColor(node, getColorForLayer(layer)); // Get color for the current layer
                console.log("cur " + node + " layer " + layer);
                if (!(node in visited)) {
                    visited[node] = true;
                    res.push(node);
                    edgeList.forEach(edge => {
                        if (edge[0] == node && !(edge[1] in visited)) {
                            if (!inQueue[edge[1]]) {
                                queue.push({ node: edge[1], layer: layer + 1 }); // Include layer information for next nodes
                                inQueue[edge[1]] = true;
                            }
                        } else if (edge[1] == node && !(edge[0] in visited)) {
                            if (!inQueue[edge[0]]) {
                                queue.push({ node: edge[0], layer: layer + 1 }); // Include layer information for next nodes
                                inQueue[edge[0]] = true;
                            }
                        }
                    });
                }
                console.log(queue);
                // Call the function again to process the next step after a delay
                processNextStep();
            } else {
                console.log(res);
            }
        }, 1000); // Adjust the delay time as needed (here, it's set to 1 second)
    }

    // Start processing the BFS steps
    processNextStep();
}

// Function to get color for each layer
function getColorForLayer(layer) {
    // Define colors for different layers
    const colors = ['#FF5733', '#FFC300', '#33FF57', '#339CFF', '#FF33C6', '#33FFFF', '#F5A9D0', '#7B68EE', '#58D3F7', '#F1C40F'];
    // Return color based on layer index, cycle through colors if there are more layers than defined colors
    return colors[layer % colors.length];
}




document.getElementById('myForm').addEventListener('submit', Main);
let nodes = new vis.DataSet();
let edges = new vis.DataSet();
let container = document.getElementById('mynetwork');
let data = {
    nodes: nodes,
    edges: edges
};
let options = {};
let network = new vis.Network(container, data, options);

function ChangeNodeColor(newid, newcolor)
{
    nodes.update([{id: newid, color:newcolor}]);
}
// function changeNodeColors() {
//     ChangeNodeColor('A','red');
// }

// // Function to change the color of specific edges
// function changeEdgeColors() {
// edges.update([
//     { id: edges.get({ filter: (edge) => edge.from === 'A' && edge.to === 'B' })[0].id, color: { color: '#FF0000' } },
//     { id: edges.get({ filter: (edge) => edge.from === 'A' && edge.to === 'C' })[0].id, color: { color: '#FF0000' } },
//     { id: edges.get({ filter: (edge) => edge.from === 'B' && edge.to === 'D' })[0].id, color: { color: '#FF0000' } }
// ]);
// }
/*
current:red

visited:red
unvisited:blue
current:yellow
*/