import React, { useState, useRef, useEffect, useCallback } from 'react';

import '../assets/styles/Menu.css';

const Menu = ({ algorithm, setAlgorithm, disable, setDisable }) => {
  const [showAlgos, setShowAlgos] = useState(false);
  const [showMazes, setShowMazes] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const algoDropdown = useRef(null);
  const mazeDropdown = useRef(null);
  const speedDropdown = useRef(null);

  const toggleAlgoDropdown = () => {
    setShowAlgos(!showAlgos);
    setShowMazes(false);
    setShowSpeedMenu(false);
  };

  const toggleMazeDropdown = () => {
    setShowMazes(!showMazes);
    setShowAlgos(false);
    setShowSpeedMenu(false);
  };

  const toggleSpeedDropdown = () => {
    setShowSpeedMenu(!showSpeedMenu);
    setShowMazes(false);
    setShowAlgos(false);
  };
  const closeDropdowns = useCallback(
    e => {
      if (!algoDropdown.current.contains(e.target)) {
        setShowAlgos(false);
      }
      if (!mazeDropdown.current.contains(e.target)) {
        setShowMazes(false);
      }
      if (!speedDropdown.current.contains(e.target)) {
        setShowSpeedMenu(false);
      }
    },
    [algoDropdown.current, mazeDropdown.current, speedDropdown.current]
  );

  useEffect(() => {
    document.addEventListener('click', closeDropdowns);

    return () => {
      document.removeEventListener('click', closeDropdowns);
    };
  }, []);

  const changeAlgorithm = e => {
    if (e.target.innerText === "Dijkstra's Algorithm") {
      setAlgorithm('dijkstra');
    } else if (e.target.innerText === 'A* Search') {
      setAlgorithm('astar');
    } else if (e.target.innerText === 'Breadth-first Search') {
      setAlgorithm('bfs');
    }
  };

  console.log(disable);

  return (
    <div className='menu'>
      <h1>Pathfinding Algorithm Visualizer</h1>
      <nav>
        <ul className='menu-list'>
          <li ref={algoDropdown} onClick={() => toggleAlgoDropdown()}>
            Algorithms<span className='dropdown-arrow'></span>
            <ul className={showAlgos === true ? 'algo-dropdown' : 'hidden'}>
              <li onClick={e => changeAlgorithm(e)}>Dijkstra's Algorithm</li>
              <li onClick={e => changeAlgorithm(e)}>A* Search</li>
              <li onClick={e => changeAlgorithm(e)}>Breadth-first Search</li>
            </ul>
          </li>

          <li ref={mazeDropdown} onClick={() => toggleMazeDropdown()}>
            Build Maze<span className='dropdown-arrow'></span>
            <ul className={showMazes === true ? 'maze-dropdown' : 'hidden'}>
              <li>Recursive Division</li>
              <li>Random maze pattern</li>
              <li>Stair pattern</li>
            </ul>
          </li>
          <li ref={speedDropdown} onClick={() => toggleSpeedDropdown()}>
            Speed: fast<span className='dropdown-arrow'></span>
            <ul
              className={showSpeedMenu === true ? 'speed-dropdown' : 'hidden'}
            >
              <li>Slow</li>
              <li>Normal</li>
              <li>Fast (default)</li>
            </ul>
          </li>
          <li>
            <button className={disable ? 'disabled' : ''}>
              Start{' '}
              {algorithm === 'dijkstra'
                ? "Dijkstra's"
                : algorithm === 'astar'
                ? 'A*'
                : algorithm === 'bfs'
                ? 'BFS'
                : ''}
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
