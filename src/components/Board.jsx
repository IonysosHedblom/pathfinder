import React, { useState } from 'react';
import Node from './Node';
import styles from '../assets/styles/Board.css';

const Board = () => {
  // Calculates number of rows and columns based on window height
  const height = document.documentElement.clientHeight;
  const width = document.documentElement.clientWidth;

  let calculatedRows = Math.floor(height / 30) - 6;
  let calculatedColumns = Math.floor(width / 30);

  // Initial start node coordinates
  const initialStartRow = Math.floor(calculatedRows / 2);
  const initialStartColumn = Math.floor(calculatedColumns / 4);

  // Initial finish node coordinates
  const initialTargetRow = Math.floor(calculatedRows / 2);
  const initialTargetColumn = Math.floor((3 * calculatedColumns) / 4);

  // Creates initial nodes for the grid once the component mounts
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
      isWall: false,
      distance: Infinity,
      previousNode: null,
    };
  };

  // Creates the grid
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

  // Grid is in the state
  const [grid, setGrid] = useState(createInitialGrid);

  // State of when the startNode is pressed
  const [pressed, setPressed] = useState(false);

  // State of when the targetNode is pressed
  const [isTargetNodePressed, setIsTargetNodePressed] = useState(false);

  // State of when an empty / wall node is pressed
  const [pressedNode, setPressedNode] = useState(false);

  // Keeps track of the previous coordinates of the start node
  // so the previous start nodes can be re-rendered into normal or wall nodes
  const [prevCoordinates, setPrevCoordinates] = useState([
    initialStartRow,
    initialStartColumn,
  ]);

  const [prevTargetCoordinates, setPrevTargetCoordinates] = useState([
    initialTargetRow,
    initialTargetColumn,
  ]);

  const [nodeTwoStepsBack, setNodeTwoStepsBack] = useState([
    prevCoordinates[0],
    prevCoordinates[1],
  ]);

  const [isEaten, setIsEaten] = useState(false);

  // Replaces old start node with a normal node,
  // then adds the new start node
  // Returns a new grid with updated start node
  const setNewStartNode = (grid, row, column) => {
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
      setIsEaten(false);
      let newNode = {
        ...currentNode,
        status: 'start',
      };

      newGrid[row][column] = newNode;
    } else if (currentNode.status === 'wall') {
      setIsEaten(true);
      let newNode = {
        ...currentNode,
        status: 'start',
      };

      newGrid[row][column] = newNode;
    }

    if (previousNode.status === 'start' && !isEaten) {
      let newPreviousNode = {
        ...previousNode,
        status: '',
      };
      newGrid[prevCoordinates[0]][prevCoordinates[1]] = newPreviousNode;
    } else if (isEaten && previousNode.status === 'start') {
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

  const setNewTargetNode = (grid, row, column) => {
    const newGrid = grid.slice();
    const currentNode = grid[row][column];
    let newNode;
    let newPreviousNode;
    let previousNode = grid[prevTargetCoordinates[0]][prevTargetCoordinates[1]];

    if (previousNode.status !== 'start' && previousNode.status !== 'wall') {
      newPreviousNode = {
        ...previousNode,
        status: '',
      };
      newGrid[prevTargetCoordinates[0]][
        prevTargetCoordinates[1]
      ] = newPreviousNode;
    }

    if (currentNode.status !== 'start' && currentNode.status !== 'wall') {
      newNode = {
        ...currentNode,
        status: 'target',
      };
      newGrid[row][column] = newNode;
    }

    return newGrid;
  };

  const getTargetNode = (grid, row, column) => {
    const node = grid[row][column];
    if (node.status === 'target') {
      return node;
    } else {
      return false;
    }
  };

  // Build a new grid with walls
  const buildWalls = (grid, row, column) => {
    const newGrid = grid.slice();
    const node = grid[row][column];
    if (node.status !== 'start' && node.status !== 'target') {
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

  const removeWallNode = (grid, row, column) => {
    const newGrid = grid.slice();
    const node = grid[row][column];

    if (node.status === 'wall') {
      const newNode = {
        ...node,
        status: '',
      };
      newGrid[row][column] = newNode;
    }
    return newGrid;
  };

  // Runs function above to see if the startnode has been pressed
  const handleMouseDown = (row, column) => {
    if (getStartNode(grid, row, column)) {
      setPressed(true);
    } else if (getTargetNode(grid, row, column)) {
      setIsTargetNodePressed(true);
    } else {
      setPressedNode(true);
      if (grid[row][column].status === 'wall') {
        removeWallNode(grid, row, column);
      } else if (grid[row][column].status === '') {
        buildWalls(grid, row, column);
      }
    }
  };

  // Stores old start node coordinates in prevcoordinates state,
  // then runs the function at line 68 to render a new grid with updated start node state
  const handleMouseEnter = (row, column) => {
    if (!pressed && !isTargetNodePressed && !pressedNode) return;

    if (pressed) {
      setNodeTwoStepsBack([prevCoordinates[0], prevCoordinates[1]]);

      setPrevCoordinates([row, column]);

      if (grid[row][column].status !== 'target') {
        const newGrid = setNewStartNode(grid, row, column);
        setGrid(newGrid);
      }
    } else if (isTargetNodePressed) {
      setPrevTargetCoordinates([row, column]);
      const newGrid = setNewTargetNode(grid, row, column);
      setGrid(newGrid);
    } else if (pressedNode) {
      const newGrid = buildWalls(grid, row, column);
      setGrid(newGrid);
    }
  };

  // No longer clicking, stop moving start node
  const handleMouseUp = () => {
    setPressedNode(false);
    setPressed(false);
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
                  const { row, column, status, isWall } = node;

                  return (
                    <Node
                      key={nodeIdx}
                      row={row}
                      column={column}
                      status={status}
                      pressed={pressed}
                      isWall={isWall}
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
