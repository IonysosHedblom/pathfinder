// Performs Dijkstras algorithm, returns all nodes in the order which they were visited.
export const dijkstra = (grid, start, target) => {
  const visitedNodesInOrder = [];
  start.distance = 0;
  const unvisitedNodes = getAllNodes(grid);

  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();

    // If wall is encountered. Skip it.
    if (closestNode.status === 'wall') continue;

    // If the closest node is at a distance of infinity, we are trapped.
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === target) return visitedNodesInOrder;
    updateUnvisitedNeighbors(closestNode, grid);
  }
};

const sortNodesByDistance = nodes => {
  nodes.sort((node, nodeTwo) => node.distance - nodeTwo.distance);
};

const getAllNodes = grid => {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
};

const getUnvisitedNeighbors = (node, grid) => {
  const neighbors = [];
  const { row, column } = node;
  if (row > 0) neighbors.push(grid[row - 1][column]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][column]);
  if (column > 0) neighbors.push(grid[row][column - 1]);
  if (column < grid[0].length - 1) neighbors.push(grid[row][column + 1]);

  return neighbors.filter(neighbor => !neighbor.isVisited);
};

const updateUnvisitedNeighbors = (node, grid) => {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
};

export const getNodesInShortestPath = target => {
  const nodesInShortesPath = [];
  let currentNode = target;
  while (currentNode !== null) {
    nodesInShortesPath.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortesPath;
};
