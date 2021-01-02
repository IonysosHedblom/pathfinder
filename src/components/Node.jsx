import React from 'react';

import styles from '../assets/styles/Node.css';

const Node = props => {
  const {
    row,
    column,
    status,
    onMouseDown,
    onMouseEnter,
    onMouseUp,
    shortest,
  } = props;

  const typeOfNode =
    status === 'start'
      ? 'start'
      : status === 'target'
      ? 'target'
      : status === 'wall'
      ? 'wall'
      : '';

  const shortestClass = shortest ? 'node-shortest-path' : '';

  return (
    <td
      onMouseDown={() => onMouseDown(row, column)}
      onMouseEnter={() => onMouseEnter(row, column)}
      onMouseUp={() => onMouseUp(row, column)}
      className={`node ${typeOfNode} ${shortestClass}`}
      id={`${row}-${column}`}
    ></td>
  );
};

export default Node;
