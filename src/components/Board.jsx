import React, { useState } from 'react';
import Node from './Node';
import styles from '../assets/styles/Board.css';

const Board = () => {
  const height = document.documentElement.clientHeight;
  const width = document.documentElement.clientWidth;

  let calculatedRows = Math.floor(height / 30) - 6;
  let calculatedColumns = Math.floor(width / 30);

  // calculatedRows = Math.floor(calculatedRows);

  console.log(calculatedRows, calculatedColumns);

  const createNode = (row, column) => {
    return {
      column,
      row,
      isStart:
        row === Math.floor(calculatedRows / 2) &&
        column === Math.floor(calculatedColumns / 4),
      isFinish:
        row === Math.floor(calculatedRows / 2) &&
        column === Math.floor((3 * calculatedColumns) / 4),
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
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

  const [grid, setGrid] = useState(createGrid);

  return (
    <div className='container'>
      <table className={styles.grid}>
        <tbody>
          {grid.map((row, rowIdx) => {
            return (
              <tr key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, column, isWall, isFinish, isStart } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      column={column}
                      row={row}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
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
