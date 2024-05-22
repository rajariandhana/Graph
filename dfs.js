let s = new Stack();

function InitDFS() {
    s = new Stack();
    visited = {};
    updateVis = {};
    layer = 0;
    nodeLayer = {};
    visCtr = 0;
    let start = nodeList[0];
    s.push(start);
    prevNode = start;
    nodeLayer[start] = layer;
    // visited[start] = true;
    ChangeNodeColor(start, GetColorForLayer(layer));
    UpdateDS(s);
    NewStep("Start with A, pushes A");
    document.getElementById('Next').onclick = NextDFS;
    document.getElementById('Next').disabled = false;
    document.querySelector('.dsdiv').textContent="Stack";

    // DFS_Procedure(start);
    stDFS('A');
}
function NextDFS() {
    if (visCtr == n_nodes) {
        document.getElementById('Next').disabled = true;
        NewStep("DFS is finished");
        return;
    }

    let node = s.pop();
    HighlightNode(node);
    if(node !== prevNode)
    {
        let changeEdge = FindEdge(node,prevNode);
        if(changeEdge)
        {
            ChangeEdgeColor(changeEdge.id, GetColorForLayer(layer));
        }
    }
    ChangeNodeColor(node, GetColorForLayer(layer));
    UpdateDS(s);
    NewStep("Pops " + node);
    if(visited[node]) return;
    visited[node] = true;
    visCtr++;
    updateVis[node] = true;
    UpdateVisited();

    let adjNodes = FindAdjacentNodes(node);
    AppendStep("Nodes adjacent to " + node + ": " + adjNodes.toString());
    let adjUnvisNodes = [];
    let adjEdges = FindAdjacentEdges(node);
    let allVisited=true;
    for(let edge of adjEdges)
    {
        if (edge.from == node && !visited[edge.to]) {
            s.push(edge.to);
            nodeLayer[edge.to] = nodeLayer[node] + 1;
            allVisited = false;
            UpdateDS(s);
        } else if (edge.to == node && !visited[edge.from]) {
            s.push(edge.from);
            nodeLayer[edge.from] = nodeLayer[node] + 1;
            allVisited = false;
            UpdateDS(s);
        }
    }
    if(allVisited) layer--;

    DeactivateNode(node);
    prevNode = node;
    layer++;
}

let DFS_step = [];
function DFS_Procedure(node)
{
    if(visCtr==n_nodes) return;
    visited[node] = true;
    visCtr++;
    // DFS_step.push(node);
    let adjEdges = FindAdjacentEdges(node);
    let allAdjVis = true;
    for(let edge of adjEdges)
    {
        if(edge.from === node && !visited[edge.to])
        {
            DFS_step.push([edge.from,edge.to]);
            DFS_Procedure(edge.to);
            allAdjVis = false;
        } 
        else if(edge.to === node && !visited[edge.from])
        {
            DFS_step.push([edge.to,edge.from]);
            DFS_Procedure(edge.from);
            allAdjVis = false;
        }
    }
    if(allAdjVis)
    {
        let lastEdge = DFS_step.pop();
        let lastNode = lastEdge[1];
        if(node !== 'A')
        {   
            DFS_step.push([node,lastNode]);
            DFS_Procedure(lastNode);
        }
    }
}