let q = new Queue();
let visited = {};
let layer = 0;
function InitBFS()
{
    q = new Queue();
    visited = {};
    layer = 0;
    q.enqueue(nodeList[0]);
    visited[nodeList[0]] = true;
    // ChangeNodeColor(nodeList[0],GetColorForLayer(layer));
    ChangeNodeColor(node,"red");
    UpdateQueue(q);
    console.log("init BFS");
    console.log("enq "+nodeList[0]);
}

function NextBFS()
{
    console.log("NextBFS");
    if(q.size()>0)
    {
        let node = q.dequeue();
        ChangeNodeColor(node,"yellow");
        UpdateQueue(q);
        console.log("deq "+node);
        let adjEdges = FindAdjacentEdges(node);
        layer++;
        adjEdges.forEach((edge, index)=>{
            ChangeEdgeColor(index,"red");
        });

        adjEdges.forEach((edge, index) => {
            if(edge[0]===node && !visited[edge[1]])
            {
                visited[edge[1]] = true;
                q.enqueue(edge[1]);
                UpdateQueue(q);
                ChangeEdgeColor(index,"blue");
                ChangeNodeColor(edge[1],GetColorForLayer(layer));
                console.log("enq "+edge[1]);
            }
            else if(edge[1]===node && !visited[edge[0]])
            {
                visited[edge[0]] = true;
                q.enqueue(edge[0]);
                UpdateQueue(q);
                ChangeEdgeColor(index,"blue");
                ChangeNodeColor(edge[0],GetColorForLayer(layer));
                console.log("enq "+edge[0]);
            }
            else
            {
                ChangeEdgeColor(index,"white");
            }
        });
    }
}

document.getElementById('n_nodes').addEventListener('change', CreateGraph);
document.getElementById('traversalType').addEventListener('change', Traverse);
// document.getElementById('NextBFS').addEventListener('submit', NextBFS);