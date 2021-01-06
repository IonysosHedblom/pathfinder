import React from 'react';
import '../assets/styles/Info.css';

const Info = () => {
  return (
    <div className='info'>
      <ul>
        <li>
          <div className='info-start'></div>Start Node
        </li>
        <li>
          <div className='info-target'></div>Target Node
        </li>
        <li>
          <div className='info-unvisited'></div>Unvisited Node
        </li>
        <li>
          <div className='info-visited'></div>
          <div className='info-visited2'></div>Visited Nodes
        </li>

        <li>
          <div className='info-wall'></div>Wall Node
        </li>
        <li>
          <div className='info-shortest'></div>Shortest-path Node
        </li>
      </ul>
    </div>
  );
};

export default Info;
