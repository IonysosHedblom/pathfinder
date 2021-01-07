export const astar = (grid, start, target) => {
  // if (!start || !target) {
  //   return;
  // }
  const unvisitedNodes = [];
  const visitedNodesInOrder = [];

  start.distance = 0;
  unvisitedNodes.push(start);

  while (unvisitedNodes.length !== 0) {
    unvisitedNodes.sort((a, b) => a.totalDistance - b.totalDistance);

    let closestNode = unvisitedNodes.shift();
    if (closestNode === target) return visitedNodesInOrder;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    let neighbours = getNeighbours(closestNode, grid);

    for (let neighbour of neighbours) {
      let distance = closestNode.distance + 1;
      console.log(neighbourNotInUnvisitedNodes(neighbour, unvisitedNodes));
      if (neighbourNotInUnvisitedNodes(neighbour, unvisitedNodes)) {
        unvisitedNodes.unshift(neighbour);
        neighbour.distance = distance;
        neighbour.totalDistance =
          distance + calculatedManhattanDistance(neighbour, target);
        neighbour.previousNode = closestNode;
      } else if (distance < neighbour.distance) {
        neighbour.distance = distance;
        neighbour.totalDistance =
          distance + calculatedManhattanDistance(neighbour, target);
        neighbour.previousNode = closestNode;
      }
    }
  }
  return visitedNodesInOrder;
};

const getNeighbours = (node, grid) => {
  let neighbours = [];
  let { row, column } = node;
  if (column !== grid[0].length - 1) neighbours.push(grid[row][column + 1]);
  if (row !== grid.length - 1) neighbours.push(grid[row + 1][column]);
  if (column !== 0) neighbours.push(grid[row][column - 1]);
  if (row !== 0) neighbours.push(grid[row - 1][column]);
  return neighbours.filter(
    neighbour => neighbour.status !== 'wall' && !neighbour.isVisited
  );
};

const neighbourNotInUnvisitedNodes = (neighbour, unvisitedNodes) => {
  for (let node of unvisitedNodes) {
    if (node.row === neighbour.row && node.column === neighbour.column) {
      return false;
    }
  }
  return true;
};

const calculatedManhattanDistance = (node, target) => {
  const x = Math.abs(node.row - target.row);
  const y = Math.abs(node.column - target.column);
  return x + y;
};

export const nodesInShortestPathAstar = target => {
  const nodesInShortestPath = [];
  let currentNode = target;
  while (currentNode !== null) {
    nodesInShortestPath.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }

  return nodesInShortestPath;
};
