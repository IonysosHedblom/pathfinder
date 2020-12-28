import React from 'react';

import styles from '../assets/styles/Node.css';

const Node = props => {
  const { row, column, isWall, isStart, isFinish } = props;
  const typeOfNode = isStart
    ? 'start-node'
    : isFinish
    ? 'finish-node'
    : isWall
    ? 'wall-node'
    : '';

  return (
    <td className={`node ${typeOfNode}`} id={`node-${row}-${column}`}></td>
  );
};

export default Node;
