import React from 'react';
import '../assets/styles/Info.css';

const Info = ({ algorithm, setAlgorithm }) => {
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
      <p className='algo-info'>
        {algorithm === 'dijkstra'
          ? "Dijkstra's Algorithm is weighted and guarantees the shortest path. It's a classic pathfinding algorithm."
          : algorithm === 'astar'
          ? 'A* Search is the best pathfinding algorithm; uses heuristics to guarantee the shortest path.'
          : algorithm === 'dfs'
          ? 'Depth-First Search is unweighted and a very bad algorithm for pathfinding. Does not guarantee the shortest path.'
          : ''}
      </p>
    </div>
  );
};

export default Info;
