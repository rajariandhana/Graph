let q = new Queue();
let visited = {};
let updateVis = {};
let layer = 0;
let nodesInCurrentLayer = 0;
let nodesInNextLayer = 0;

function InitBFS() {
    q = new Queue();
    visited = {};
    updateVis = {};
    layer = 0;
    nodesInCurrentLayer = 1;
    nodesInNextLayer = 0;
    let start = nodeList[0];
    q.enqueue(start);
    visited[start] = true;
    ChangeNodeColor(start, GetColorForLayer(layer));
    UpdateQueue(q);
    NewStep("Start with A, enqueues A");
    document.getElementById('NextBFS').disabled = false;
    // UpdateQueue(q);
    // UpdateVisited();
    // console.log("init BFS");
    // console.log("enq " + start);
}

function NextBFS() {
    // console.log("NextBFS");
    if (q.size() <= 0)
    {
        document.getElementById('NextBFS').disabled = true;
        NewStep("BFS is finished");
        return;
    }

    let node = q.dequeue();
    // q.dequeue();
    nodesInCurrentLayer--;
    HighlightNode(node);
    UpdateQueue(q);
    NewStep("Dequeues "+node);
    updateVis[node]=true;
    UpdateVisited();
    // console.log("deq " + node);

    // console.log(adjEdges);
    let adjNodes = FindAdjacentNodes(node);
    AppendStep("Nodes adjacent to "+node+": "+adjNodes.toString());
    let adjUnvisNodes = [];
    let adjEdges = FindAdjacentEdges(node);
    adjEdges.forEach(edge => {
        if (edge.from == node && !visited[edge.to]) {
            visited[edge.to] = true;
            // UpdateVisited();
            q.enqueue(edge.to);
            adjUnvisNodes.push(edge.to);
            nodesInNextLayer++;
            UpdateQueue(q);
            // UpdateStep(edge.to+" is unvisited, enqueues "+edge.to);
            ChangeEdgeColor(edge.id, GetColorForLayer(layer + 1));
            ChangeNodeColor(edge.to, GetColorForLayer(layer + 1));
            // console.log("enq " + edge.to);
        } else if (edge.to == node && !visited[edge.from]) {
            visited[edge.from] = true;
            // UpdateVisited();
            q.enqueue(edge.from);
            adjUnvisNodes.push(edge.from);
            nodesInNextLayer++;
            UpdateQueue(q);
            // UpdateStep(edge.from+" is unvisited, enqueues "+edge.from);
            ChangeEdgeColor(edge.id, GetColorForLayer(layer + 1));
            ChangeNodeColor(edge.from, GetColorForLayer(layer + 1));
            // console.log("enq " + edge.from);
        }
    });
    if(adjUnvisNodes.length!=0) AppendStep("Enqueues "+node+"'s unvisited adjacent nodes: "+adjUnvisNodes.toString());

    DeactivateNode(node);

    if (nodesInCurrentLayer == 0) {
        layer++;
        nodesInCurrentLayer = nodesInNextLayer;
        nodesInNextLayer = 0;
    }
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

document.getElementById('n_nodes').addEventListener('change', CreateGraph);
document.getElementById('traversalType').addEventListener('change', Traverse);
// document.getElementById('NextBFS').addEventListener('submit', NextBFS);
let explanation = document.querySelector('.explanation')
explanation.style.display = 'none';