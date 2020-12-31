import React, { useState } from 'react';
import Node from './Node';
import styles from '../assets/styles/Board.css';

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

  // Stores old start node coordinates in prevcoordinates state,
  // then runs the function at line 68 to render a new grid with updated start node state
  const handleMouseEnter = (row, column) => {
    if (!isStartNodePressed && !isTargetNodePressed && !pressedNode) return;

    if (isStartNodePressed) {
      setNodeTwoStepsBack([prevCoordinates[0], prevCoordinates[1]]);

      setPrevCoordinates([row, column]);

      if (grid[row][column].status !== 'target') {
        const newGrid = moveStartNode(grid, row, column);
        setGrid(newGrid);
      }
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

  return (
    <div className='container'>
      <table className={styles.grid}>
        <tbody>
          {grid.map((row, rowIdx) => {
            return (
              <tr key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, column, status } = node;

                  return (
                    <Node
                      key={nodeIdx}
                      row={row}
                      column={column}
                      status={status}
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
