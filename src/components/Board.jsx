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

  const [nodeState, setNodeState] = useState({
    column: null,
    row: null,
    start: row === null && column === null,
    finish: row === null && column === null,
    distance: Infinity,
    isVisited: false,
    previousNode: null,
  });

  const createNode = (row, column) => {
    setNodeState({
      row: row,
      column: column,
    });
    return nodeState;
  };

  const createGrid = () => {
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

  const [grid, setGrid] = useState(createGrid);
  const [pressed, setPressed] = useState(false);

  // const onMouseDown = (row, column) => {
  //   if (getNode(`${row}-${column}`).isStart) {
  //     setPressed = true;
  //   }
  // };

  // const onMouseEnter = () => {
  //   if (pressed) {
  //   }
  // };

  // const onMouseUp = () => {
  //   setPressed = false;
  // };

  return (
    <div className='container'>
      {/* <button onClick={() => testHandleClick()}>Click here</button> */}
      <table className={styles.grid}>
        <tbody>
          {grid.map((row, rowIdx) => {
            return (
              <tr key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, column, start, finish } = node;

                  return (
                    <Node
                      pressed={pressed}
                      setPressed={setPressed}
                      getNode={getNode}
                      key={nodeIdx}
                      row={row}
                      column={column}
                      start={start}
                      finish={finish}
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
