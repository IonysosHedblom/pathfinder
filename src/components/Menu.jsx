import React, { useState } from 'react';

import styles from '../assets/styles/Menu.css';

const Menu = () => {
  const [showAlgos, setShowAlgos] = useState(false);
  const [showMazes, setShowMazes] = useState(false);

  const toggleAlgoDropdown = () => {
    setShowAlgos(!showAlgos);
    setShowMazes(false);
  };

  const toggleMazeDropdown = () => {
    setShowMazes(!showMazes);
    setShowAlgos(false);
  };

  return (
    <div className='menu'>
      <h1>Pathfinding Algorithm Visualizer</h1>
      <nav>
        <ul className='menu-list'>
          <li onClick={() => toggleAlgoDropdown()}>
            Algorithms<span className='dropdown-arrow'></span>
          </li>

          <li onClick={() => toggleMazeDropdown()}>
            Build Maze<span className='dropdown-arrow'></span>
          </li>
          <li>
            Speed: fast<span className='dropdown-arrow'></span>
          </li>
          <li>
            <button>Start</button>
          </li>
          <li>Clear board</li>
          <li>Clear walls</li>
          <li>Tutorial</li>
        </ul>
        <ul className={showAlgos === true ? 'algo-dropdown' : 'hidden'}>
          <li>Dijkstra's Algorithm</li>
          <li>A* Search</li>
          <li>Breadth-first Search</li>
        </ul>
        <ul className={showMazes === true ? 'maze-dropdown' : 'hidden'}>
          <li>Recursive Division</li>
          <li>Random maze pattern</li>
          <li>Stair pattern</li>
        </ul>
      </nav>
    </div>
  );
};

export default Menu;
