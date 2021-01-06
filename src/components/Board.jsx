import React, { useState } from 'react';
import Node from './Node';
import Menu from './Menu';
import styles from '../assets/styles/Board.css';

// Dijkstras
import { dijkstra, getNodesInShortestPath } from '../algorithms/dijkstra';
import { recursiveDivision } from '../algorithms/recursiveDivison';

const Board = () => {
  // State for which algorithm is chosen
  const [algorithm, setAlgorithm] = useState('');
  // State for algorithm speed
  const [algorithmSpeed, setAlgorithmSpeed] = useState('Fast');
  const [speedValue, setSpeedValue] = useState(10);

  // Calculates number of rows and columns based on window height
  const height = document.documentElement.clientHeight;
  const width = document.documentElement.clientWidth;

  // Calculates how many rows and columns the grid should contain, x or y / 30 where 30 is the pixel size of each node
  let calculatedRows = Math.floor(height / 30) - 7;
  let calculatedColumns = Math.floor(width / 30);

  // Initial start node coordinates - sets the start row to be in the middle and the column to be on the left side
  const initialStartRow = Math.floor(calculatedRows / 2);
  const initialStartColumn = Math.floor(calculatedColumns / 4);

  // Initial target node coordinates - sets the target row to be in the middle and the column to be on the right side
  const initialTargetRow = Math.floor(calculatedRows / 2);
  const initialTargetColumn = Math.floor((3 * calculatedColumns) / 4);

  // Creates initial nodes for the grid state
  const createNode = (row, column) => {
    return {
      row,
      column,
      status:
        row === initialStartRow && column === initialStartColumn
          ? 'start'
          : row === initialTargetRow && column === initialTargetColumn
          ? 'target'
          : '',
      isVisited: false,
      distance: Infinity,
      previousNode: null,
      shortest: false,
    };
  };

  // Creates the initial grid to use in state
  const createInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < calculatedRows; row++) {
      const currentRow = [];
      for (let column = 0; column < calculatedColumns; column++) {
        currentRow.push(createNode(row, column));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  // Stores the grid in state
  const [grid, setGrid] = useState(createInitialGrid);

  // State of when the startNode is pressed
  const [isStartNodePressed, setIsStartNodePressed] = useState(false);

  // State of when the targetNode is pressed
  const [isTargetNodePressed, setIsTargetNodePressed] = useState(false);

  // State of when an empty / wall node is pressed
  const [pressedNode, setPressedNode] = useState(false);

  // Keeps track of the previous coordinates of the start node
  // so the previous start nodes can be re-rendered into normal or wall nodes - otherwise it leaves a trail with start nodes
  const [prevCoordinates, setPrevCoordinates] = useState([
    initialStartRow,
    initialStartColumn,
  ]);

  // Stores the coordinates of the start node
  const [currentStartCoordinates, setCurrentStartCoordinates] = useState([
    initialStartRow,
    initialStartColumn,
  ]);

  // Stores coordinates of target node
  const [currentTargetCoordinates, setCurrentTargetCoordinates] = useState([
    initialTargetRow,
    initialTargetColumn,
  ]);

  // Keeps track of the previous coordinates of the target node
  // so the previous target nodes can be re-rendered into normal or wall nodes - otherwise it leaves a trail with target nodes
  const [prevTargetCoordinates, setPrevTargetCoordinates] = useState([
    initialTargetRow,
    initialTargetColumn,
  ]);

  // Keeps track of the status of the node two steps back from the start node (in this case)
  // - this is made so that the start node never has the same position as the target node, instead it skips it to the next node.
  const [nodeTwoStepsBack, setNodeTwoStepsBack] = useState([
    prevCoordinates[0],
    prevCoordinates[1],
  ]);

  // Keeps track of the status of the node two steps back from the target node (in this case)
  // - this is made so that the target node never has the same position as the start node, instead it skips it to the next node.
  const [targetTwoStepsBack, setTargetTwoStepsBack] = useState([
    prevTargetCoordinates[0],
    prevTargetCoordinates[1],
  ]);

  // Checks whether the start/target node is currently on a wall node - if it is, the wall node is temporarily replaces with the
  // start/target node. Once the start/target node leaves the wall node, it is re-rendered into a wall node again.
  const [isOnWallNode, setIsOnWallNode] = useState(false);

  // Checks if the algorithm animation is done
  const [algoDone, setAlgoDone] = useState(false);
  // Disables functionality while algo is running
  const [disable, setDisable] = useState(false);

  // COMMENT ABOUT LINE 119 - 179 -> these functions make it possible to see the dijkstras algorithm
  // for the new position of the start / target node when moving it. Seemed a bit overkill to do this functionality
  // So I decided to run with a version which clears the grid when moving the start/target node instead.

  // const removeStatic = grid => {
  //   grid.forEach(row => {
  //     row.forEach(node => {
  //       const nodeById = document.getElementById(`${node.row}-${node.column}`);
  //       nodeById.classList.remove('visited-reset');
  //       nodeById.classList.remove('shortest-reset');
  //       if (node.status === 'target') {
  //         nodeById.classList.remove('start');
  //       }
  //     });
  //   });
  //   setAlgoDone(false);
  // };

  // const shortestPath = nodesInShortestPath => {
  //   for (let i = 0; i < nodesInShortestPath.length; i++) {
  //     const node = nodesInShortestPath[i];
  //     const previousNode = nodesInShortestPath[i - 1];
  //     if (node.status === 'target') {
  //       document.getElementById(`${node.row}-${node.column}`).className =
  //         'node shortest-reset target start';
  //     } else {
  //       document.getElementById(`${node.row}-${node.column}`).className =
  //         'node shortest-reset start';
  //     }

  //     if (previousNode && previousNode.status !== 'start') {
  //       document
  //         .getElementById(`${previousNode.row}-${previousNode.column}`)
  //         .classList.remove('start');
  //     }
  //   }
  // };

  // const runStaticDijkstra = () => {
  //   resetGrid();
  //   // removePattern(grid);
  //   const visitedNodesInOrder = dijkstra(
  //     grid,
  //     grid[currentStartCoordinates[0]][currentStartCoordinates[1]],
  //     grid[currentTargetCoordinates[0]][currentTargetCoordinates[1]]
  //   );
  //   const nodesInShortestPath = getNodesInShortestPath(
  //     grid[currentTargetCoordinates[0]][currentTargetCoordinates[1]]
  //   );
  //   for (let i = 0; i <= visitedNodesInOrder.length; i++) {
  //     if (i === visitedNodesInOrder.length) {
  //       shortestPath(nodesInShortestPath);
  //     }
  //     const node = visitedNodesInOrder[i];
  //     if (node) {
  //       if (node.status === 'start') {
  //         document.getElementById(`${node.row}-${node.column}`).className =
  //           'node start visited-reset';
  //       } else {
  //         document.getElementById(`${node.row}-${node.column}`).className =
  //           'node visited-reset';
  //       }
  //     }
  //   }
  // };

  // Function to move the start node on mouse enter.
  // Replaces old start node with a normal node,
  // then adds the new start node to the current position in the grid
  // Returns a new grid with updated start node
  const moveStartNode = (grid, row, column) => {
    const newGrid = grid.slice();
    const currentNode = grid[row][column];
    const previousNode = grid[prevCoordinates[0]][prevCoordinates[1]];
    const twoStepsBack = grid[nodeTwoStepsBack[0]][nodeTwoStepsBack[1]];

    // Simply removes the old dijkstras pattern if moving start node when algorithm is done running
    if (algoDone) {
      removePattern(grid);
      // removeStatic(grid);
      resetGrid();
      // runStaticDijkstra();
    }

    if (twoStepsBack.status === 'start' && previousNode.status === 'target') {
      let newNode = {
        ...twoStepsBack,
        status: '',
      };
      newGrid[nodeTwoStepsBack[0]][nodeTwoStepsBack[1]] = newNode;
    }

    if (currentNode.status === '') {
      setIsOnWallNode(false);
      let newNode = {
        ...currentNode,
        status: 'start',
        distance: Infinity,
        isVisited: false,
        shortest: false,
      };

      newGrid[row][column] = newNode;
    } else if (currentNode.status === 'wall') {
      setIsOnWallNode(true);
      let newNode = {
        ...currentNode,
        status: 'start',
      };

      newGrid[row][column] = newNode;
    }

    if (previousNode.status === 'start' && !isOnWallNode) {
      let newPreviousNode = {
        ...previousNode,
        isVisited: false,
        status: '',
      };
      newGrid[prevCoordinates[0]][prevCoordinates[1]] = newPreviousNode;
    } else if (isOnWallNode && previousNode.status === 'start') {
      let newPreviousNode = {
        ...previousNode,
        status: 'wall',
      };

      newGrid[prevCoordinates[0]][prevCoordinates[1]] = newPreviousNode;
    }

    return newGrid;
  };

  // Checks whether the node at (row, column) is the current start node
  const getStartNode = (grid, row, column) => {
    const node = grid[row][column];
    if (node.status === 'start') {
      return node;
    } else {
      return false;
    }
  };

  // Function to move the target node on mouse enter. (same as moveStartNode)
  // Replaces old target node with a normal node,
  // then adds the new target node to the current position in the grid
  // Returns a new grid with updated target node
  const moveTargetNode = (grid, row, column) => {
    const newGrid = grid.slice();
    const currentNode = grid[row][column];
    const previousNode =
      grid[prevTargetCoordinates[0]][prevTargetCoordinates[1]];
    const twoStepsBack = grid[targetTwoStepsBack[0]][targetTwoStepsBack[1]];

    // Simply removes the old dijkstras pattern if moving start node when algorithm is done running
    if (algoDone) {
      removePattern(grid);
      resetGrid();
    }

    if (twoStepsBack.status === 'target' && previousNode.status === 'start') {
      let newNode = {
        ...twoStepsBack,
        status: '',
      };
      newGrid[targetTwoStepsBack[0]][targetTwoStepsBack[1]] = newNode;
    }

    if (currentNode.status === '') {
      setIsOnWallNode(false);
      let newNode = {
        ...currentNode,
        status: 'target',
      };

      newGrid[row][column] = newNode;
    } else if (currentNode.status === 'wall') {
      setIsOnWallNode(true);
      let newNode = {
        ...currentNode,
        status: 'target',
      };

      newGrid[row][column] = newNode;
    }

    if (previousNode.status === 'target' && !isOnWallNode) {
      let newPreviousNode = {
        ...previousNode,
        status: '',
      };

      newGrid[prevTargetCoordinates[0]][
        prevTargetCoordinates[1]
      ] = newPreviousNode;
    } else if (isOnWallNode && previousNode.status === 'target') {
      let newPreviousNode = {
        ...previousNode,
        status: 'wall',
      };
      newGrid[prevTargetCoordinates[0]][
        prevTargetCoordinates[1]
      ] = newPreviousNode;
    }

    return newGrid;
  };

  // Checks whether the node at (row, column) is the current target node
  const getTargetNode = (grid, row, column) => {
    const node = grid[row][column];
    if (node.status === 'target') {
      return node;
    } else {
      return false;
    }
  };

  // Allows to build walls when mouse is held over the nodes
  const buildWalls = (grid, row, column) => {
    const newGrid = grid.slice();
    const node = grid[row][column];
    if (node.status === '') {
      const newNode = {
        ...node,
        status: 'wall',
      };
      newGrid[row][column] = newNode;
    }
    if (node.status === 'wall') {
      const newNode = {
        ...node,
        status: '',
      };
      newGrid[row][column] = newNode;
    }
    return newGrid;
  };

  // Runs a function based on which node is pressed
  const handleMouseDown = (row, column) => {
    // removePattern(grid);
    // resetGrid();
    if (getStartNode(grid, row, column) && !disable) {
      setIsStartNodePressed(true);
    } else if (getTargetNode(grid, row, column) && !disable) {
      setIsTargetNodePressed(true);
    } else if (!disable) {
      setPressedNode(true);
      buildWalls(grid, row, column);
    }
  };

  // Checks which node is pressed, and runs a function accordingly. Stops running when the node is released (onmouseup).
  const handleMouseEnter = (row, column) => {
    if (!isStartNodePressed && !isTargetNodePressed && !pressedNode) return;

    if (isStartNodePressed) {
      setNodeTwoStepsBack([prevCoordinates[0], prevCoordinates[1]]);

      setPrevCoordinates([row, column]);
      setCurrentStartCoordinates([row, column]);
      if (grid[row][column].status !== 'target') {
        const newGrid = moveStartNode(grid, row, column);
        setGrid(newGrid);
      }
    } else if (isTargetNodePressed) {
      setTargetTwoStepsBack([
        prevTargetCoordinates[0],
        prevTargetCoordinates[1],
      ]);
      setPrevTargetCoordinates([row, column]);
      setCurrentTargetCoordinates([row, column]);
      if (grid[row][column].status !== 'start') {
        const newGrid = moveTargetNode(grid, row, column);
        setGrid(newGrid);
      }
    } else if (pressedNode) {
      const newGrid = buildWalls(grid, row, column);
      setGrid(newGrid);
    }
  };

  // No longer clicking, stop moving start/target node or stop building walls
  const handleMouseUp = () => {
    setPressedNode(false);
    setIsStartNodePressed(false);
    setIsTargetNodePressed(false);
    // setAlgoDone(false);
  };

  // Visualizes Dijkstras algorithm
  const visualizeDijkstras = () => {
    if (!disable) {
      // removeStatic(grid);
      removePattern(grid);
      resetGrid();
      const start =
        grid[currentStartCoordinates[0]][currentStartCoordinates[1]];
      const target =
        grid[currentTargetCoordinates[0]][currentTargetCoordinates[1]];

      const visitedNodesInOrder = dijkstra(grid, start, target);

      const nodesInShortestPath = getNodesInShortestPath(target);

      animateDijkstras(visitedNodesInOrder, nodesInShortestPath);
    }
  };
  // Animates Dijkstras algorithm
  const animateDijkstras = (visitedNodesInOrder, nodesInShortestPath) => {
    setDisable(true);
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPath);
        }, speedValue * i);
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (node) {
          if (node.status === 'target') {
            setAlgoDone(true);
          }
          if (node.status === 'start') {
            document.getElementById(`${node.row}-${node.column}`).className =
              'node start visited';
          } else {
            document.getElementById(`${node.row}-${node.column}`).className =
              'node visited';
          }
        }
      }, speedValue * i);
    }
  };

  const animateShortestPath = nodesInShortestPath => {
    for (let i = 0; i < nodesInShortestPath.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPath[i];
        const previousNode = nodesInShortestPath[i - 1];

        if (node.status === 'target') {
          setDisable(false);
          document.getElementById(`${node.row}-${node.column}`).className =
            'node node-shortest-path target start';
        } else {
          document.getElementById(`${node.row}-${node.column}`).className =
            'node node-shortest-path start';
        }

        if (previousNode && previousNode.status !== 'start') {
          document
            .getElementById(`${previousNode.row}-${previousNode.column}`)
            .classList.remove('start');
        }
      }, 50 * i);
    }
  };

  const clearWalls = grid => {
    if (!disable) {
      const newGrid = grid.slice();
      newGrid.forEach(row => {
        row.forEach(node => {
          if (node.status === 'wall') {
            let newNode = {
              ...node,
              status: '',
            };
            newGrid[node.row][node.column] = newNode;
          }
          if (node.isVisited) {
            let newNode = {
              ...node,
              isVisited: false,
            };
            newGrid[node.row][node.column] = newNode;
          }
        });
      });
      setGrid(newGrid);
    }
  };

  const removePattern = grid => {
    grid.forEach(row => {
      row.forEach(node => {
        const nodeById = document.getElementById(`${node.row}-${node.column}`);
        nodeById.classList.remove('visited');
        nodeById.classList.remove('node-shortest-path');
        if (node.status === 'target') {
          nodeById.classList.remove('start');
        }
      });
    });
    setAlgoDone(false);
  };

  const resetGrid = () => {
    const newGrid = grid.slice();

    grid.forEach(row => {
      row.forEach(node => {
        let newNode = {
          ...node,
          isVisited: false,
          shortest: false,
          distance: Infinity,
          previousNode: null,
        };
        newGrid[node.row][node.column] = newNode;
      });
    });

    setGrid(newGrid);
  };

  const startVisualize = () => {
    if (algorithm === 'dijkstra') {
      visualizeDijkstras();
    }
  };

  const getGridWithMaze = (grid, walls) => {
    const newGrid = grid.slice();
    for (let wall of walls) {
      let node = grid[wall[0]][wall[1]];
      let newNode = {
        ...node,
        status: 'wall',
      };
      newGrid[wall[0]][wall[1]] = newNode;
    }
    return newGrid;
  };

  const animateMaze = walls => {
    for (let i = 0; i <= walls.length; i++) {
      if (i === walls.length) {
        setTimeout(() => {
          resetGrid();
          removePattern(grid);
          const newGrid = getGridWithMaze(grid, walls);
          setGrid(newGrid);
        }, 20 * i);
        return;
      }
      let wall = walls[i];
      let node = grid[wall[0]][wall[1]];
      setTimeout(() => {
        document.getElementById(`${node.row}-${node.column}`).className =
          'node wall';
      }, 20 * i);
    }
  };

  const recursiveDivisonMaze = () => {
    if (!disable) {
      const start =
        grid[currentStartCoordinates[0]][currentStartCoordinates[1]];
      const target =
        grid[currentTargetCoordinates[0]][currentTargetCoordinates[1]];

      const walls = recursiveDivision(grid, start, target);
      animateMaze(walls);
    }
  };

  return (
    <div>
      <Menu
        // grid={grid}
        // setGrid={setGrid}
        startVisualize={() => startVisualize()}
        disable={disable}
        setDisable={setDisable}
        algorithm={algorithm}
        setAlgorithm={e => setAlgorithm(e)}
        algorithmSpeed={algorithmSpeed}
        setAlgorithmSpeed={e => setAlgorithmSpeed(e)}
        speedValue={speedValue}
        setSpeedValue={e => setSpeedValue(e)}
        clearWalls={() => clearWalls(grid)}
      />

      <button onClick={() => recursiveDivisonMaze()}>Test</button>
      <div className='container'>
        <table className={styles.grid}>
          <tbody>
            {grid.map((row, rowIdx) => {
              return (
                <tr key={rowIdx}>
                  {row.map((node, nodeIdx) => {
                    const { row, column, status, isVisited, shortest } = node;

                    return (
                      <Node
                        key={nodeIdx}
                        shortest={shortest}
                        row={row}
                        column={column}
                        status={status}
                        isVisited={isVisited}
                        isStartNodePressed={isStartNodePressed}
                        isTargetNodePressed={isTargetNodePressed}
                        pressedNode={pressedNode}
                        onMouseDown={(row, column) =>
                          handleMouseDown(row, column)
                        }
                        onMouseEnter={(row, column) =>
                          handleMouseEnter(row, column)
                        }
                        onMouseUp={(row, column) => handleMouseUp(row, column)}
                      ></Node>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Board;
