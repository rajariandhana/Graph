function GetRandomInteger(p, q) {
    return Math.floor(Math.random() * (q - p + 1)) + p;
}
function GetChar(number) {
    return String.fromCharCode(64 + number);
}
function NewGraph()
{
    nodes = new vis.DataSet(
        // nodeList.map(node => ({ id: node, label: node, color: '#97C2FC' }))
        nodeList.map(node => ({
            id: node,
            label: node,
            color: {
                background: 'white',
                border: 'white'
            },
            font: {
                color: 'black'
            },
            shape:'circle',
            size:30,
            labelOffset: {
                x: 0,
                y: 0.5
            },
            borderWidth: 2,
            borderWidthSelected: 4 
        }))
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
            //   border: 'yellow',
            //   background: 'red'
            }
          },
        edges: {
            smooth: {
                type: 'straightCross',
                roundness: 0
            },
            color: {
                // color: "yellow",
                // highlight: "red"
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
function ChangeNodeColor(nodeid, newcolor) {
    nodes.update([{ id: nodeid, color: { background: newcolor[0] }, font: {color: newcolor[1] } }]);
}
function ChangeEdgeColor(edgeid, newcolor) {
    edges.update([{ id: edgeid, color: { color: newcolor[0] } }]);
}
function HighlightNode(nodeid)
{
    // nodes.update([{ id: nodeid, color: { background: 'beige' }, font: {color: 'black' } }]);
    nodes.update([{ id: nodeid, color: { border: 'beige' } }]);
}
function DeactivateNode(nodeid)
{
    // nodes.update([{ id: nodeid, color: { background: 'grey' }, font: {color: 'white' } }]);
    nodes.update([{ id: nodeid, color: { border: 'grey' } }]);
}
function GetColorForLayer(layer) {
    // const colors = ['#FF5733', '#FFC300', '#33FF57', '#339CFF', '#FF33C6', '#33FFFF', '#F5A9D0', '#7B68EE', '#58D3F7', '#F1C40F'];
    const colors = ['red', 'orange', 'yellow', 'lime', 'green', 'aqua', 'blue', 'purple', 'pink', '#F1C40F'];
    const fonts = ['white','white','black','white','white','black','white','white','white','black'];
    let i = layer%colors.length;
    return [colors[i],fonts[i]];
}
let stepsList = document.querySelector('.steps');
// function AppendStep(step) {
//     let stepItem = document.createElement('li');
//     stepItem.textContent = step;
//     stepsList.appendChild(stepItem);
// }
let step = document.getElementById('step');
function NewStep(stepText)
{
    step.innerHTML = '';
    AppendStep(stepText);
}
function AppendStep(stepText)
{
    let p = document.createElement('p');
    p.textContent = stepText;
    step.appendChild(p);
}
function UpdateStep(stepText)
{
    curStep.textContent = step;
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
function CreateGraph(event) {
    n_nodes = document.getElementById('n_nodes').value;
    explanation.style.display = 'none';
    document.getElementById('traversalType').selectedIndex = 0;
    nodeList = [];
    edgeList = [];
    const minConnections = 1;
    // const maxConnections = Math.min(n_nodes - 1, 5);
    const maxConnections = 3;


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
    explanation.style.display = 'flex';
    if (type === 'BFS') InitBFS();
    if (type === 'DFS') InitDFS();
}
function FindAdjacentEdges(node)
{
    let adjEdges = [];
    // edgeList.forEach(edge => {
    //     if(edge[0]==node) adjEdges.push([edge[0],edge[1]]);
    //     else if(edge[1]==node) adjEdges.push([edge[1],edge[0]]);
    // });
    edges.forEach(edge=>{
        if(node==edge.from || node==edge.to) adjEdges.push(edge);
    });
    return adjEdges;
}
function FindAdjacentNodes(node)
{
    let adjNodes = [];
    edges.forEach(edge=>{
        if(node==edge.from) adjNodes.push(edge.to);
        else if(node==edge.to) adjNodes.push(edge.from);
    });
    return adjNodes;
}
function FindEdge(nodeA, nodeB)
{ 
    let res = null;
    edges.forEach(edge=>{
        if((nodeA==edge.from && nodeB==edge.to) || (nodeA==edge.to && nodeB==edge.from))
        {
            res = edge;
            // return edge;
        }
    });
    // for(let edge of edges)
    // {
    //     if((nodeA==edge.from && nodeB==edge.to) || (nodeA==edge.to && nodeB==edge.from))
    //     {
    //         return edge;
    //     }
    // }
    return res;
}
function UpdateDS(ds)
{
    document.getElementById('ds').value = ds.contents();
}
function UpdateVisited()
{
    let v = '';
    for(let key in updateVis)
    {
        if(updateVis[key]==true) v+= key+" ";
    }
    console.log(v);
    document.getElementById('visited').value = v;
}
function HighlightEdge(edge)
{
    ChangeEdgeColor(edge.id, "red");
}
function HighlightAdjEdge(node) {
    let adjEdges = FindAdjacentEdges(node);
    adjEdges.forEach(edge => {
        ChangeEdgeColor(edge.id, "red");
    });
}

function HighlightAdjUnvEdge(node) {
    let adjEdges = FindAdjacentEdges(node);
    adjEdges.forEach(edge => {
        if (edge.from == node && !visited[edge.to] || edge.to == node && !visited[edge.from]) {
            ChangeEdgeColor(edge.id, "blue");
        }
    });
}

let visited = {};
let updateVis = {};
let layer = 0;
let nodesInCurrentLayer = 0;
let nodesInNextLayer = 0;
let prevNode = null;
let prevPrev = null;
let nodeLayer = {};
let edgeLayer = {};
let visCtr = 0;
document.getElementById('n_nodes').addEventListener('change', CreateGraph);
document.getElementById('traversalType').addEventListener('change', Traverse);
let explanation = document.querySelector('.explanation')
explanation.style.display = 'none';