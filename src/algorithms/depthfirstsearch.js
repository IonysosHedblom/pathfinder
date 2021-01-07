export const depthFirstSearch = (grid, start, target) => {
  const unvisitedNodes = [];
  const visitedNodesInOrder = [];
  unvisitedNodes.push(start);
  while (!!unvisitedNodes.length) {
    const closestNode = unvisitedNodes.shift();
    if (closestNode.status === 'wall') continue;
    if (closestNode === target) return visitedNodesInOrder;
    visitedNodesInOrder.push(closestNode);
    closestNode.isVisited = true;
    const unvisitedNeighbours = getUnvisitedNeighbours(closestNode, grid);
    for (let unvisitedNeighbour of unvisitedNeighbours) {
      unvisitedNeighbour.previousNode = closestNode;
      unvisitedNodes.unshift(unvisitedNeighbour);
    }
  }
  return visitedNodesInOrder;
};

const getUnvisitedNeighbours = (node, grid) => {
  let neighbours = [];
  let { row, column } = node;
  if (column !== 0) neighbours.push(grid[row][column - 1]);
  if (row !== 0) neighbours.push(grid[row - 1][column]);
  if (column !== grid[0].length - 1) neighbours.push(grid[row][column + 1]);
  if (row !== grid.length - 1) neighbours.push(grid[row + 1][column]);
  return neighbours.filter(neighbour => !neighbour.isVisited);
};

export const nodesInShortestPathDfs = target => {
  const nodesInShortestPath = [];
  let currentNode = target;
  while (currentNode !== null) {
    nodesInShortestPath.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPath;
};
