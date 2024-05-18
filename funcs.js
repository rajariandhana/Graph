function GetRandomInteger(p, q) {
    return Math.floor(Math.random() * (q - p + 1)) + p;
}
function GetChar(number) {
    return String.fromCharCode(64 + number);
}
function NewGraph()
{
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
    options = {
        nodes: {
            color: {
              border: 'yellow',
              background: 'red'
            }
          },
        edges: {
            smooth: {
                type: 'straightCross',
                roundness: 0
            },
            color: {
                color: "yellow",
                highlight: "red"
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
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
function CreateGraph(event) {
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
    if (type === 'BFS') InitBFS();
    if (type === 'DFS') FInitDFS();
}
function FindAdjacentEdges(node)
{
    let adjEdges = [];
    edgeList.forEach(edge => {
        if(edge[0]==node) adjEdges.push([edge[0],edge[1]]);
        else if(edge[1]==node) adjEdges.push([edge[1],edge[0]]);
    });
    return adjEdges;
}
function UpdateQueue(q)
{
    document.getElementById('queue').textContent = "Queue: "+ q.contents();
}