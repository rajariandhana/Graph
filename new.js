// let disc = {};
// let parent = {};
// let path=[];
function stDFS(start)
{
    // disc={};
    // parent={};
    let myDFS = newDFS(start,null);
    let layerDFS = createLayers(myDFS);
    console.log(myDFS);
    console.log(layerDFS);
    let myBFS = newBFS(start,null);
    let layerBFS = createLayers(myBFS);
    console.log(myBFS);
    console.log(layerBFS);
    // path = reconstructPath(start);
    // console.log(path);
}

function newDFS(node, par)
{
    let disc = {};
    let parent = {};
    let path = [];
    s = new Stack();
    s.push(node);
    parent[node] = par;
    while(!s.isEmpty())
    {
        let cur = s.pop();
        if(!disc[cur])
        {
            disc[cur]=true;
            for(let neigh of FindAdjacentNodes(cur))
            {
                if(!disc[neigh])
                {
                    parent[neigh]=cur;
                    path.push(parent[parent[cur]]);
                    s.push(neigh);
                }
            }
        }
    }
    console.log(path);
    return parent;
}
function newBFS(node, par)
{
    let disc={};
    let parent={};
    let path = [];
    q = new Queue();
    q.enqueue(node);
    disc[node]=true;
    parent[node] = par;
    path.push(par);
    while(!q.isEmpty())
    {
        let cur = q.dequeue();
        for(let neigh of FindAdjacentNodes(cur))
        {
            if(!disc[neigh])
            {
                disc[neigh]=true;
                parent[neigh]=cur;
                path.push(parent[parent[cur]]);
                q.enqueue(neigh);
            }
        }
    }
    console.log(path);
    return parent;
}

function createLayers(parent) {
    let layers = new Map();
    layers.set(0, ['A']);
    let queue = ['A'];
    let currentLevel = 0;
    
    while (queue.length > 0) {
      // Initialize the next level
      let nextLevelNodes = [];
      // Process all nodes in the current level
      for (let node of queue) {
        for (let child in parent) {
          if (parent[child] === node) {
            nextLevelNodes.push(child);
          }
        }
      }
      // Move to the next level if there are nodes to process
      if (nextLevelNodes.length > 0) {
        currentLevel++;
        layers.set(currentLevel, nextLevelNodes);
        queue = nextLevelNodes;
      } else {
        // End the loop if no more nodes to process
        queue = [];
      }
    }
    
    // Convert layers map to list of lists
    let result = [];
    for (let [level, nodes] of layers) {
      result.push(nodes);
    }
    
    return result;
  }