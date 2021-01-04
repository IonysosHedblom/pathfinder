import React from 'react';

import styles from '../assets/styles/Menu.css';

const Menu = () => {
  return (
    <div className='menu'>
      <h1>Pathfinding Algorithm Visualizer</h1>
      <nav>
        <ul>
          <li>
            Algorithms<span className='dropdown-arrow'></span>
          </li>

          <li>
            Build Maze<span className='dropdown-arrow'></span>
          </li>
          <li>
            Speed: fast<span className='dropdown-arrow'></span>
          </li>
          <li>
            <button>
              Start<span className='start-arrow'></span>
            </button>
          </li>
          <li>Clear board</li>
          <li>Clear walls</li>
          <li>Tutorial</li>
        </ul>
      </nav>
    </div>
  );
};

export default Menu;
