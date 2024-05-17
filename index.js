// index.js
let n = 6;
let nodeList = ['A','B','C','D','E','F',];
let edgeList = [['A','B'],['A','C'],['B','D'],];


// Convert nodeList and edgeList to vis.DataSet format
let nodes = new vis.DataSet(
    nodeList.map(node => ({ id: node, label: node, color: '#97C2FC' }))
  );
  
  let edges = new vis.DataSet(
    edgeList.map(edge => ({ from: edge[0], to: edge[1], color: { color: '#848484' } }))
  );
  
  // Get the container element
  let container = document.getElementById('mynetwork');
  
  // Provide the data to the network
  let data = {
    nodes: nodes,
    edges: edges
  };
  
  // Define the options (optional)
  let options = {};
  
  // Create the network
  let network = new vis.Network(container, data, options);
  
  // Function to change the color of specific nodes
  function changeNodeColors() {
    nodes.update([
      { id: 'A', color: '#FFA500' },
      { id: 'C', color: '#FFA500' },
      { id: 'E', color: '#FFA500' }
    ]);
  }
  
  // Function to change the color of specific edges
  function changeEdgeColors() {
    edges.update([
      { id: edges.get({ filter: (edge) => edge.from === 'A' && edge.to === 'B' })[0].id, color: { color: '#FF0000' } },
      { id: edges.get({ filter: (edge) => edge.from === 'A' && edge.to === 'C' })[0].id, color: { color: '#FF0000' } },
      { id: edges.get({ filter: (edge) => edge.from === 'B' && edge.to === 'D' })[0].id, color: { color: '#FF0000' } }
    ]);
  }
  