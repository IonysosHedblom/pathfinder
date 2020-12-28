import React from 'react';

import styles from '../assets/styles/Node.css';

const Node = props => {
  const { row, column, start, finish } = props;
  const typeOfNode = start ? 'start-node' : finish ? 'finish-node' : '';

  return (
    <td className={`node ${typeOfNode}`} id={`node-${row}-${column}`}></td>
  );
};

export default Node;
