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
  const initialFinishRow = Math.floor(calculatedRows / 2);
  const initialFinishColumn = Math.floor((3 * calculatedColumns) / 4);

  // Creates initial nodes for the grid once the component mounts
  const createNode = (row, column) => {
    return {
      row,
      column,
      status:
        row === initialStartRow && column === initialStartColumn
          ? 'start'
          : row === initialFinishRow && column === initialFinishColumn
          ? 'finish'
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

  // State of when the finishNode is pressed
  const [isFinishNodePressed, setIsFinishNodePressed] = useState(false);

  // Keeps track of the previous coordinates of the start node
  // so the previous start nodes can be re-rendered into normal nodes
  const [prevCoordinates, setPrevCoordinates] = useState([
    initialStartRow,
    initialStartColumn,
  ]);

  const [prevFinishCoordinates, setPrevFinishCoordinates] = useState([
    initialFinishRow,
    initialFinishColumn,
  ]);

  // Replaces old start node with a normal node,
  // then adds the new start node
  // Returns a new grid with updated start node
  const setNewStartNode = (grid, row, column) => {
    const newGrid = grid.slice();
    const currentNode = grid[row][column];
    let newNode;
    let newPreviousNode;
    let previousNode = grid[prevCoordinates[0]][prevCoordinates[1]];

    if (previousNode.status !== 'finish') {
      newPreviousNode = {
        ...previousNode,
        status: '',
      };
    } else if (previousNode.status === 'finish') {
      newPreviousNode = {
        ...previousNode,
      };
    }

    if (currentNode.status !== 'finish') {
      newNode = {
        ...currentNode,
        status: 'start',
      };
    } else if (currentNode.status === 'finish') {
      newNode = {
        ...currentNode,
      };
    }

    newGrid[prevCoordinates[0]][prevCoordinates[1]] = newPreviousNode;
    newGrid[row][column] = newNode;

    return newGrid;
  };

  // Checks whether the node at (row, column) is the current start node
  const getStartNode = (row, column) => {
    const newGrid = grid.slice();
    const node = newGrid[row][column];
    if (node.status === 'start') {
      return node;
    } else {
      return false;
    }
  };

  const setNewFinishNode = (grid, row, column) => {
    const newGrid = grid.slice();
    const currentNode = grid[row][column];
    let newNode;
    let newPreviousNode;
    let previousNode = grid[prevFinishCoordinates[0]][prevFinishCoordinates[1]];

    if (previousNode.status !== 'start') {
      newPreviousNode = {
        ...previousNode,
        status: '',
      };
    } else if (previousNode.status === 'start') {
      newPreviousNode = {
        ...previousNode,
      };
    }

    if (currentNode.status !== 'start') {
      newNode = {
        ...currentNode,
        status: 'finish',
      };
    } else if (currentNode.status === 'start') {
      newNode = {
        ...currentNode,
      };
    }

    newGrid[prevFinishCoordinates[0]][
      prevFinishCoordinates[1]
    ] = newPreviousNode;
    newGrid[row][column] = newNode;

    return newGrid;
  };

  const getFinishNode = (row, column) => {
    const newGrid = grid.slice();
    const node = newGrid[row][column];
    if (node.status === 'finish') {
      return node;
    } else {
      return false;
    }
  };

  // Runs function above to see if the startnode has been pressed
  const handleMouseDown = (row, column) => {
    if (getStartNode(row, column)) {
      setPressed(true);
    } else if (getFinishNode(row, column)) {
      setIsFinishNodePressed(true);
    }
  };

  // Stores old start node coordinates in prevcoordinates state,
  // then runs the function at line 68 to render a new grid with updated start node state
  const handleMouseEnter = (row, column) => {
    if (!pressed && !isFinishNodePressed) return;

    if (pressed) {
      setPrevCoordinates([row, column]);
      const newGrid = setNewStartNode(grid, row, column);
      setGrid(newGrid);
    } else if (isFinishNodePressed) {
      setPrevFinishCoordinates([row, column]);
      const newGrid = setNewFinishNode(grid, row, column);
      setGrid(newGrid);
    }
  };

  // No longer clicking, stop moving start node
  const handleMouseUp = () => {
    setPressed(false);
    setIsFinishNodePressed(false);
  };

  return (
    <div className='container'>
      {/* <button onClick={() => testHandleClick()}>Click here</button> */}
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
                      pressed={pressed}
                      isFinishNodePressed={isFinishNodePressed}
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
