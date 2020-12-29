import React, { useState } from 'react';
import Node from './Node';
import styles from '../assets/styles/Board.css';

const Board = () => {
  const height = document.documentElement.clientHeight;
  const width = document.documentElement.clientWidth;

  let calculatedRows = Math.floor(height / 30) - 6;
  let calculatedColumns = Math.floor(width / 30);

  // START VALUES
  // row === Math.floor(calculatedRows / 2) &&
  // column === Math.floor(calculatedColumns / 4),
  // FINISH VALUES
  // row === Math.floor(calculatedRows / 2) &&
  // column === Math.floor((3 * calculatedColumns) / 4),
  const initialStartRow = Math.floor(calculatedRows / 2);
  const initialStartColumn = Math.floor(calculatedColumns / 4);

  const createNode = (row, column) => {
    return {
      row,
      column,
      status:
        row === initialStartRow && column === initialStartColumn ? 'start' : '',
      isVisited: false,
      isWall: false,
      distance: Infinity,
      previousNode: null,
    };
  };

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

  const getNode = id => {
    let coordinates = id.split('-');
    let row = coordinates[0];
    let column = coordinates[1];
    let currentNode = grid[row][column];
    return currentNode;
  };

  const [grid, setGrid] = useState(createInitialGrid);
  const [pressed, setPressed] = useState(false);

  // Keeps track of the previous coordinates of the start node so the previous start nodes can be re-rendered into normal ones
  const [prevCoordinates, setPrevCoordinates] = useState([
    initialStartRow,
    initialStartColumn,
  ]);

  const setNewStartNode = (grid, row, column) => {
    const newGrid = grid.slice();
    const currentNode = grid[row][column];
    let previousNode = grid[prevCoordinates[0]][prevCoordinates[1]];

    let newPreviousNode = {
      ...previousNode,
      status: '',
    };
    let newNode = {
      ...currentNode,
      status: 'start',
    };

    newGrid[prevCoordinates[0]][prevCoordinates[1]] = newPreviousNode;
    newGrid[row][column] = newNode;

    return newGrid;
  };

  // const removeStartNodes = () => {
  //   const startNode = document.querySelector('.start-node');
  //   startNode.classList.remove('start-node');
  // };

  const getStartNode = (row, column) => {
    const newGrid = grid.slice();
    const node = newGrid[row][column];
    if (node.status === 'start') {
      return node;
    } else {
      return false;
    }
  };

  const handleMouseDown = (row, column) => {
    if (getStartNode(row, column)) {
      setPressed(true);
    }
  };

  const handleMouseEnter = (row, column) => {
    if (!pressed) return;
    setPrevCoordinates([row, column]);

    const newGrid = setNewStartNode(grid, row, column);
    setGrid(newGrid);
  };

  const handleMouseUp = () => {
    setPressed(false);
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
                      getNode={getNode}
                      key={nodeIdx}
                      row={row}
                      column={column}
                      status={status}
                      pressed={pressed}
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
