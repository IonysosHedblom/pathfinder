import React, { useState, useEffect } from 'react';
import styles from '../assets/styles/Board.css';

const Board = () => {
  const createNode = (row, column) => {
    return {
      column,
      row,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  };
  const createGrid = () => {
    const grid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let column = 0; column < 50; column++) {
        currentRow.push(createNode(row, column));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  const [grid, setGrid] = useState(createGrid);

  console.log(grid);

  return (
    <div className='container'>
      <table className={styles.grid}>
        <tbody>
          {grid.map((row, rowIdx) => {
            return (
              <tr key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  // const { row, col, isWall } = node;
                  return <td key={nodeIdx}></td>;
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
