import React, { useState } from 'react';
import Node from './Node';
import styles from '../assets/styles/Board.css';

// Dijkstras
import { dijkstra, getNodesInShortestPath } from '../algorithms/dijkstra';

const Board = () => {
  // Calculates number of rows and columns based on window height
  const height = document.documentElement.clientHeight;
  const width = document.documentElement.clientWidth;

  // Calculates how many rows and columns the grid should contain, x or y / 30 where 30 is the pixel size of each node
  let calculatedRows = Math.floor(height / 30) - 6;
  let calculatedColumns = Math.floor(width / 30);

  // Initial start node coordinates - sets the start row to be in the middle and the column to be on the left side
  const initialStartRow = Math.floor(calculatedRows / 2);
  const initialStartColumn = Math.floor(calculatedColumns / 4);

  // Initial target node coordinates - sets the target row to be in the middle and the column to be on the right side
  const initialTargetRow = Math.floor(calculatedRows / 2);
  const initialTargetColumn = Math.floor((3 * calculatedColumns) / 4);

  // Creates initial nodes for the grid state
  const createNode = (row, column) => {
    return {
      row,
      column,
      status:
        row === initialStartRow && column === initialStartColumn
          ? 'start'
          : row === initialTargetRow && column === initialTargetColumn
          ? 'target'
          : '',
      isVisited: false,
      distance: Infinity,
      previousNode: null,
      shortest: false,
    };
  };

  // Creates the initial grid to use in state
  const createInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < calculatedRows; row++) {
      const currentRow = [];
      for (let column = 0; column < calculatedColumns; column++) {
        currentRow.push(createNode(row, column));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  // Stores the grid in state
  const [grid, setGrid] = useState(createInitialGrid);

  // State of when the startNode is pressed
  const [isStartNodePressed, setIsStartNodePressed] = useState(false);

  // State of when the targetNode is pressed
  const [isTargetNodePressed, setIsTargetNodePressed] = useState(false);

  // State of when an empty / wall node is pressed
  const [pressedNode, setPressedNode] = useState(false);

  // Keeps track of the previous coordinates of the start node
  // so the previous start nodes can be re-rendered into normal or wall nodes - otherwise it leaves a trail with start nodes
  const [prevCoordinates, setPrevCoordinates] = useState([
    initialStartRow,
    initialStartColumn,
  ]);

  // Stores the coordinates of the start node
  const [currentStartCoordinates, setCurrentStartCoordinates] = useState([
    initialStartRow,
    initialStartColumn,
  ]);

  // Stores coordinates of target node
  const [currentTargetCoordinates, setCurrentTargetCoordinates] = useState([
    initialTargetRow,
    initialTargetColumn,
  ]);

  // Keeps track of the previous coordinates of the target node
  // so the previous target nodes can be re-rendered into normal or wall nodes - otherwise it leaves a trail with target nodes
  const [prevTargetCoordinates, setPrevTargetCoordinates] = useState([
    initialTargetRow,
    initialTargetColumn,
  ]);

  // Keeps track of the status of the node two steps back from the start node (in this case)
  // - this is made so that the start node never has the same position as the target node, instead it skips it to the next node.
  const [nodeTwoStepsBack, setNodeTwoStepsBack] = useState([
    prevCoordinates[0],
    prevCoordinates[1],
  ]);

  // Keeps track of the status of the node two steps back from the target node (in this case)
  // - this is made so that the target node never has the same position as the start node, instead it skips it to the next node.
  const [targetTwoStepsBack, setTargetTwoStepsBack] = useState([
    prevTargetCoordinates[0],
    prevTargetCoordinates[1],
  ]);

  // Checks whether the start/target node is currently on a wall node - if it is, the wall node is temporarily replaces with the
  // start/target node. Once the start/target node leaves the wall node, it is re-rendered into a wall node again.
  const [isOnWallNode, setIsOnWallNode] = useState(false);

  const [isInitialStart, setIsInitialStart] = useState(true);

  const [algoDone, setAlgoDone] = useState(false);

  // Function to move the start node on mouse enter.
  // Replaces old start node with a normal node,
  // then adds the new start node to the current position in the grid
  // Returns a new grid with updated start node
  const moveStartNode = (grid, row, column) => {
    const newGrid = grid.slice();
    const currentNode = grid[row][column];
    const previousNode = grid[prevCoordinates[0]][prevCoordinates[1]];
    const twoStepsBack = grid[nodeTwoStepsBack[0]][nodeTwoStepsBack[1]];

    if (twoStepsBack.status === 'start' && previousNode.status === 'target') {
      let newNode = {
        ...twoStepsBack,
        status: '',
      };
      newGrid[nodeTwoStepsBack[0]][nodeTwoStepsBack[1]] = newNode;
    }

    if (currentNode.status === '') {
      setIsOnWallNode(false);
      let newNode = {
        ...currentNode,
        status: 'start',
      };

      newGrid[row][column] = newNode;
    } else if (currentNode.status === 'wall') {
      setIsOnWallNode(true);
      let newNode = {
        ...currentNode,
        status: 'start',
      };

      newGrid[row][column] = newNode;
    }

    if (previousNode.status === 'start' && !isOnWallNode) {
      let newPreviousNode = {
        ...previousNode,
        status: '',
      };
      newGrid[prevCoordinates[0]][prevCoordinates[1]] = newPreviousNode;
    } else if (isOnWallNode && previousNode.status === 'start') {
      let newPreviousNode = {
        ...previousNode,
        status: 'wall',
      };

      newGrid[prevCoordinates[0]][prevCoordinates[1]] = newPreviousNode;
    }

    return newGrid;
  };

  // Checks whether the node at (row, column) is the current start node
  const getStartNode = (grid, row, column) => {
    const node = grid[row][column];
    if (node.status === 'start') {
      return node;
    } else {
      return false;
    }
  };

  // Function to move the target node on mouse enter. (same as moveStartNode)
  // Replaces old target node with a normal node,
  // then adds the new target node to the current position in the grid
  // Returns a new grid with updated target node
  const moveTargetNode = (grid, row, column) => {
    const newGrid = grid.slice();
    const currentNode = grid[row][column];
    const previousNode =
      grid[prevTargetCoordinates[0]][prevTargetCoordinates[1]];
    const twoStepsBack = grid[targetTwoStepsBack[0]][targetTwoStepsBack[1]];

    if (twoStepsBack.status === 'target' && previousNode.status === 'start') {
      let newNode = {
        ...twoStepsBack,
        status: '',
      };
      newGrid[targetTwoStepsBack[0]][targetTwoStepsBack[1]] = newNode;
    }

    if (currentNode.status === '') {
      setIsOnWallNode(false);
      let newNode = {
        ...currentNode,
        status: 'target',
      };

      newGrid[row][column] = newNode;
    } else if (currentNode.status === 'wall') {
      setIsOnWallNode(true);
      let newNode = {
        ...currentNode,
        status: 'target',
      };

      newGrid[row][column] = newNode;
    }

    if (previousNode.status === 'target' && !isOnWallNode) {
      let newPreviousNode = {
        ...previousNode,
        status: '',
      };

      newGrid[prevTargetCoordinates[0]][
        prevTargetCoordinates[1]
      ] = newPreviousNode;
    } else if (isOnWallNode && previousNode.status === 'target') {
      let newPreviousNode = {
        ...previousNode,
        status: 'wall',
      };
      newGrid[prevTargetCoordinates[0]][
        prevTargetCoordinates[1]
      ] = newPreviousNode;
    }

    return newGrid;
  };

  // Checks whether the node at (row, column) is the current target node
  const getTargetNode = (grid, row, column) => {
    const node = grid[row][column];
    if (node.status === 'target') {
      return node;
    } else {
      return false;
    }
  };

  // Allows to build walls when mouse is held over the nodes
  const buildWalls = (grid, row, column) => {
    const newGrid = grid.slice();
    const node = grid[row][column];
    if (node.status === '') {
      const newNode = {
        ...node,
        status: 'wall',
      };
      newGrid[row][column] = newNode;
    }
    if (node.status === 'wall') {
      const newNode = {
        ...node,
        status: '',
      };
      newGrid[row][column] = newNode;
    }
    return newGrid;
  };

  // Runs a function based on which node is pressed
  const handleMouseDown = (row, column) => {
    if (getStartNode(grid, row, column)) {
      setIsStartNodePressed(true);
    } else if (getTargetNode(grid, row, column)) {
      setIsTargetNodePressed(true);
    } else {
      setPressedNode(true);
      buildWalls(grid, row, column);
    }
  };

  // Checks which node is pressed, and runs a function accordingly. Stops running when the node is released (onmouseup).
  const handleMouseEnter = (row, column) => {
    if (!isStartNodePressed && !isTargetNodePressed && !pressedNode) return;

    if (isStartNodePressed) {
      setNodeTwoStepsBack([prevCoordinates[0], prevCoordinates[1]]);

      setPrevCoordinates([row, column]);

      if (grid[row][column].status !== 'target') {
        const newGrid = moveStartNode(grid, row, column);
        setGrid(newGrid);
      }
      setCurrentStartCoordinates([row, column]);
    } else if (isTargetNodePressed) {
      setTargetTwoStepsBack([
        prevTargetCoordinates[0],
        prevTargetCoordinates[1],
      ]);
      setPrevTargetCoordinates([row, column]);

      if (grid[row][column].status !== 'start') {
        const newGrid = moveTargetNode(grid, row, column);
        setGrid(newGrid);
      }
      setCurrentTargetCoordinates([row, column]);
    } else if (pressedNode) {
      const newGrid = buildWalls(grid, row, column);
      setGrid(newGrid);
    }
  };

  // No longer clicking, stop moving start/target node or stop building walls
  const handleMouseUp = () => {
    setPressedNode(false);
    setIsStartNodePressed(false);
    setIsTargetNodePressed(false);
  };

  // Animates Dijkstras algorithm
  const animateDijkstras = (visitedNodesInOrder, nodesInShortestPath) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      // if (i === visitedNodesInOrder.length) {
      //   // setTimeout(() => {
      //   //   animateShortestPath(nodesInShortestPath);
      //   // }, 10 * i);

      //   const newGrid = animateShortestPath2(grid, nodesInShortestPath);

      //   setGrid(newGrid);

      //   return;
      // }
      if (i === visitedNodesInOrder.length) {
        setAlgoDone(true);
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];

        if (node) {
          if (node.status === 'start') {
            document.getElementById(`${node.row}-${node.column}`).className =
              'node start visited';
          } else {
            document.getElementById(`${node.row}-${node.column}`).className =
              'node visited';
          }
        }
      }, 8 * i);
    }
  };

  // Visualizes Dijkstras algorithm
  const visualizeDijkstras = () => {
    const startNode =
      grid[currentStartCoordinates[0]][currentStartCoordinates[1]];
    const targetNode =
      grid[currentTargetCoordinates[0]][currentTargetCoordinates[1]];
    const visitedNodesInOrder = dijkstra(grid, startNode, targetNode);
    const nodesInShortestPath = getNodesInShortestPath(targetNode);
    animateDijkstras(visitedNodesInOrder, nodesInShortestPath);
    console.log(algoDone);
    // if (algoDone) {
    //   animateShortestPath2(grid, nodesInShortestPath);
    // }
  };

  // const animateShortestPath = nodesInShortestPath => {
  //   for (let i = 0; i < nodesInShortestPath.length; i++) {
  //     setTimeout(() => {
  //       const node = nodesInShortestPath[i];
  //       const previousNode = nodesInShortestPath[i - 1];
  //       console.log(node);

  //       if (previousNode && previousNode.status !== 'start') {
  //         document
  //           .getElementById(`${previousNode.row}-${previousNode.column}`)
  //           .classList.remove('start');
  //       }

  //       document.getElementById(`${node.row}-${node.column}`).className =
  //         'node node-shortest-path start';
  //     }, 50 * i);
  //   }
  // };

  // Draw nodes in shortest path in new grid test
  const animateShortestPath2 = (grid, nodesInShortestPath) => {
    const newGrid = grid.slice();
    for (let i = 0; i < nodesInShortestPath.length; i++) {
      const currentNode = nodesInShortestPath[i];
      const previousNode = nodesInShortestPath[i - 1];

      if (nodesInShortestPath[i] === nodesInShortestPath[1]) {
        setIsInitialStart(false);
      }
      let newNode = {
        ...currentNode,
        status: 'start',
        shortest: true,
      };

      if (
        previousNode &&
        previousNode.status === 'start' &&
        isInitialStart === false
      ) {
        let newPreviousNode = {
          ...previousNode,
          status: '',
          shortest: true,
        };
        newGrid[previousNode.row][previousNode.column] = newPreviousNode;
      }

      newGrid[currentNode.row][currentNode.column] = newNode;
      setGrid(newGrid);
    }
  };

  return (
    <div className='container'>
      <button onClick={() => visualizeDijkstras(grid)}>
        Visualize Dijkstra
      </button>
      <table className={styles.grid}>
        <tbody>
          {grid.map((row, rowIdx) => {
            return (
              <tr key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, column, status, isVisited, shortest } = node;

                  return (
                    <Node
                      key={nodeIdx}
                      shortest={shortest}
                      row={row}
                      column={column}
                      status={status}
                      isVisited={isVisited}
                      isStartNodePressed={isStartNodePressed}
                      isTargetNodePressed={isTargetNodePressed}
                      pressedNode={pressedNode}
                      onMouseDown={(row, column) =>
                        handleMouseDown(row, column)
                      }
                      onMouseEnter={(row, column) =>
                        handleMouseEnter(row, column)
                      }
                      onMouseUp={() => handleMouseUp()}
                    ></Node>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Board;
