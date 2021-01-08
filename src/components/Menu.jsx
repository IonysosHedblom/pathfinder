import React, { useState, useRef, useEffect, useCallback } from 'react';

import '../assets/styles/Menu.css';

const Menu = ({
  algorithm,
  setAlgorithm,
  disable,
  setDisable,
  startVisualize,
  algorithmSpeed,
  setAlgorithmSpeed,
  speedValue,
  setSpeedValue,
  clearWalls,
  resetAll,
  recursiveDivisionMaze,
  buildRandomMaze,
  buildRandomWeightMaze,
  showTutorial,
  setShowTutorial,
}) => {
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
  const toggleTutorial = e => {
    setShowTutorial(!showTutorial);
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
    } else if (e.target.innerText === 'Depth-first Search') {
      setAlgorithm('dfs');
    }
  };

  const setSpeed = e => {
    if (e.target.innerText === 'Normal') {
      setAlgorithmSpeed('Normal');
      setSpeedValue(25);
    } else if (e.target.innerText === 'Fast (default)') {
      setAlgorithmSpeed('Fast');
      setSpeedValue(10);
    } else if (e.target.innerText === 'Slow') {
      setAlgorithmSpeed('Slow');
      setSpeedValue(100);
    } else if (e.target.innerText === 'Ultra Slow') {
      setAlgorithmSpeed('Ultra Slow');
      setSpeedValue(500);
    }
  };

  console.log(showTutorial);

  return (
    <div className='menu'>
      <h1>The Trailblazer</h1>
      <nav>
        <ul className='menu-list'>
          <li ref={algoDropdown} onClick={() => toggleAlgoDropdown()}>
            Algorithms<span className='dropdown-arrow'></span>
            <ul className={showAlgos === true ? 'algo-dropdown' : 'hidden'}>
              <li onClick={e => changeAlgorithm(e)}>Dijkstra's Algorithm</li>
              <li onClick={e => changeAlgorithm(e)}>A* Search</li>
              <li onClick={e => changeAlgorithm(e)}>Depth-first Search</li>
            </ul>
          </li>

          <li ref={mazeDropdown} onClick={() => toggleMazeDropdown()}>
            Build Maze<span className='dropdown-arrow'></span>
            <ul className={showMazes === true ? 'maze-dropdown' : 'hidden'}>
              <li onClick={() => recursiveDivisionMaze()}>
                Recursive Division
              </li>
              <li onClick={() => buildRandomMaze()}>Random maze pattern</li>
              <li onClick={() => buildRandomWeightMaze()}>
                Random Weight Maze
              </li>
            </ul>
          </li>
          <li ref={speedDropdown} onClick={() => toggleSpeedDropdown()}>
            Speed: {algorithmSpeed}
            <span className='dropdown-arrow'></span>
            <ul
              className={showSpeedMenu === true ? 'speed-dropdown' : 'hidden'}
            >
              <li onClick={e => setSpeed(e)}>Ultra Slow</li>

              <li onClick={e => setSpeed(e)}>Slow</li>
              <li onClick={e => setSpeed(e)}>Normal</li>
              <li onClick={e => setSpeed(e)}>Fast (default)</li>
            </ul>
          </li>
          <li>
            <button
              onClick={() => startVisualize()}
              className={disable ? 'disabled' : ''}
            >
              Start{' '}
              {algorithm === 'dijkstra'
                ? "Dijkstra's"
                : algorithm === 'astar'
                ? 'A*'
                : algorithm === 'dfs'
                ? 'DFS'
                : ''}
            </button>
          </li>
          <li onClick={() => clearWalls()}>Clear walls</li>
          <li onClick={() => resetAll()}>Reset board</li>

          <li onClick={e => toggleTutorial(e)}>Tutorial</li>
        </ul>
      </nav>
    </div>
  );
};

export default Menu;
