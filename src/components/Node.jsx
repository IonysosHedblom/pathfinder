import React from 'react';

import styles from '../assets/styles/Node.css';

const Node = props => {
  const { row, column, status, onMouseDown, onMouseEnter, onMouseUp } = props;
  const typeOfNode =
    status === 'start'
      ? 'start-node'
      : status === 'finish'
      ? 'finish-node'
      : status === 'wall'
      ? 'wall-node'
      : '';

  return (
    <td
      onMouseDown={() => onMouseDown(row, column)}
      onMouseEnter={() => onMouseEnter(row, column)}
      onMouseUp={() => onMouseUp()}
      className={`node ${typeOfNode}`}
      id={`node-${row}-${column}`}
    ></td>
  );
};

export default Node;
