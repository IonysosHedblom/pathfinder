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
    isVisited,
  } = props;

  const typeOfNode =
    status === 'start'
      ? 'start'
      : status === 'target'
      ? 'target'
      : status === 'wall'
      ? 'wall'
      : '';

  return (
    <td
      onMouseDown={() => onMouseDown(row, column)}
      onMouseEnter={() => onMouseEnter(row, column)}
      onMouseUp={() => onMouseUp()}
      className={`node ${typeOfNode}`}
      id={`${row}-${column}`}
    ></td>
  );
};

export default Node;
