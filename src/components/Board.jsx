import React, { useState, Fragment, useEffect } from "react";
import Node from "./Node";
import Menu from "./Menu";
import Info from "./Info";
import Tutorial from "./Tutorial";
import styles from "../assets/styles/Board.css";

import { dijkstra, getNodesInShortestPath } from "../algorithms/dijkstra";
import { astar, nodesInShortestPathAstar } from "../algorithms/astar";
import {
  depthFirstSearch,
  nodesInShortestPathDfs,
} from "../algorithms/depthfirstsearch";
import { recursiveDivision } from "../algorithms/recursiveDivison";
import { randomMaze } from "../algorithms/randomMaze";

const Board = () => {
  const [algorithm, setAlgorithm] = useState("");
  const [algorithmSpeed, setAlgorithmSpeed] = useState("Fast");
  const [speedValue, setSpeedValue] = useState(10);

  const [showTutorial, setShowTutorial] = useState(true);

  const height = document.documentElement.clientHeight;
  const width = document.documentElement.clientWidth;

  let calculatedRows = Math.floor(height / 30) - 7;
  let calculatedColumns = Math.floor(width / 30);

  const initialStartRow = Math.floor(calculatedRows / 2);
  const initialStartColumn = Math.floor(calculatedColumns / 4);

  const initialTargetRow = Math.floor(calculatedRows / 2);
  const initialTargetColumn = Math.floor((3 * calculatedColumns) / 4);

  const createNode = (row, column) => {
    return {
      row,
      column,
      status:
        row === initialStartRow && column === initialStartColumn
          ? "start"
          : row === initialTargetRow && column === initialTargetColumn
          ? "target"
          : "",
      isVisited: false,
      distance: Infinity,
      totalDistance: Infinity,
      previousNode: null,
      shortest: false,
    };
  };

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

  const [grid, setGrid] = useState(createInitialGrid);

  const [isStartNodePressed, setIsStartNodePressed] = useState(false);

  const [isTargetNodePressed, setIsTargetNodePressed] = useState(false);

  const [pressedNode, setPressedNode] = useState(false);

  const [prevCoordinates, setPrevCoordinates] = useState([
    initialStartRow,
    initialStartColumn,
  ]);

  const [currentStartCoordinates, setCurrentStartCoordinates] = useState([
    initialStartRow,
    initialStartColumn,
  ]);

  const [currentTargetCoordinates, setCurrentTargetCoordinates] = useState([
    initialTargetRow,
    initialTargetColumn,
  ]);

  const [prevTargetCoordinates, setPrevTargetCoordinates] = useState([
    initialTargetRow,
    initialTargetColumn,
  ]);

  const [nodeTwoStepsBack, setNodeTwoStepsBack] = useState([
    prevCoordinates[0],
    prevCoordinates[1],
  ]);

  const [targetTwoStepsBack, setTargetTwoStepsBack] = useState([
    prevTargetCoordinates[0],
    prevTargetCoordinates[1],
  ]);

  const [isOnWallNode, setIsOnWallNode] = useState(false);
  const [isOnWeightNode, setIsOnWeightNode] = useState(false);

  const [algoDone, setAlgoDone] = useState(false);
  const [disable, setDisable] = useState(false);

  const weightKeyPressed = useKeyPress("w");

  const moveStartNode = (grid, row, column) => {
    const newGrid = grid.slice();
    const currentNode = grid[row][column];
    const previousNode = grid[prevCoordinates[0]][prevCoordinates[1]];
    const twoStepsBack = grid[nodeTwoStepsBack[0]][nodeTwoStepsBack[1]];

    if (algoDone) {
      removePattern(grid);

      resetGrid(grid);
    }

    if (twoStepsBack.status === "start" && previousNode.status === "target") {
      let newNode = {
        ...twoStepsBack,
        status: "",
      };
      newGrid[nodeTwoStepsBack[0]][nodeTwoStepsBack[1]] = newNode;
    }

    if (currentNode.status === "") {
      setIsOnWallNode(false);
      setIsOnWeightNode(false);
      let newNode = {
        ...currentNode,
        status: "start",
        distance: Infinity,
        isVisited: false,
        shortest: false,
      };

      newGrid[row][column] = newNode;
    } else if (currentNode.status === "wall") {
      setIsOnWallNode(true);

      let newNode = {
        ...currentNode,
        status: "start",
      };

      newGrid[row][column] = newNode;
    }

    if (currentNode.status === "weight") {
      setIsOnWeightNode(true);

      let newNode = {
        ...currentNode,
        status: "start",
      };

      newGrid[row][column] = newNode;
    }

    if (previousNode.status === "start" && !isOnWallNode) {
      let newPreviousNode = {
        ...previousNode,
        isVisited: false,
        status: "",
      };
      newGrid[prevCoordinates[0]][prevCoordinates[1]] = newPreviousNode;
    } else if (isOnWallNode && previousNode.status === "start") {
      let newPreviousNode = {
        ...previousNode,
        status: "wall",
      };

      newGrid[prevCoordinates[0]][prevCoordinates[1]] = newPreviousNode;
    }

    return newGrid;
  };

  const getStartNode = (grid, row, column) => {
    const node = grid[row][column];
    if (node.status === "start") {
      return node;
    } else {
      return false;
    }
  };

  const moveTargetNode = (grid, row, column) => {
    const newGrid = grid.slice();
    const currentNode = grid[row][column];
    const previousNode =
      grid[prevTargetCoordinates[0]][prevTargetCoordinates[1]];
    const twoStepsBack = grid[targetTwoStepsBack[0]][targetTwoStepsBack[1]];

    if (algoDone) {
      removePattern(grid);
      resetGrid(grid);
    }

    if (twoStepsBack.status === "target" && previousNode.status === "start") {
      let newNode = {
        ...twoStepsBack,
        status: "",
      };
      newGrid[targetTwoStepsBack[0]][targetTwoStepsBack[1]] = newNode;
    }

    if (currentNode.status === "") {
      setIsOnWallNode(false);
      setIsOnWeightNode(false);
      let newNode = {
        ...currentNode,
        status: "target",
      };

      newGrid[row][column] = newNode;
    } else if (currentNode.status === "wall") {
      setIsOnWallNode(true);
      let newNode = {
        ...currentNode,
        status: "target",
      };

      newGrid[row][column] = newNode;
    }

    if (previousNode.status === "target" && !isOnWallNode) {
      let newPreviousNode = {
        ...previousNode,
        status: "",
      };

      newGrid[prevTargetCoordinates[0]][prevTargetCoordinates[1]] =
        newPreviousNode;
    } else if (isOnWallNode && previousNode.status === "target") {
      let newPreviousNode = {
        ...previousNode,
        status: "wall",
      };
      newGrid[prevTargetCoordinates[0]][prevTargetCoordinates[1]] =
        newPreviousNode;
    }

    return newGrid;
  };

  const getTargetNode = (grid, row, column) => {
    const node = grid[row][column];
    if (node.status === "target") {
      return node;
    } else {
      return false;
    }
  };

  const buildWalls = (grid, row, column) => {
    const node = grid[row][column];
    if (weightKeyPressed && algorithm !== "dfs") {
      if (node.status === "") {
        document
          .getElementById(`${node.row}-${node.column}`)
          .classList.add("weight");
      } else if (node.status === "weight") {
        document
          .getElementById(`${node.row}-${node.column}`)
          .classList.remove("weight");
      }
    } else {
      if (node.status === "wall") {
        document
          .getElementById(`${node.row}-${node.column}`)
          .classList.remove("wall");
      } else if (node.status === "") {
        document
          .getElementById(`${node.row}-${node.column}`)
          .classList.add("wall");
      }
    }
  };

  const updateWalls = (grid) => {
    const newGrid = grid.slice();
    grid.forEach((row) => {
      row.forEach((node) => {
        const nodeById = document.getElementById(`${node.row}-${node.column}`);
        if (nodeById.classList.contains("weight")) {
          let newNode = {
            ...node,
            status: "weight",
          };
          newGrid[node.row][node.column] = newNode;
        }
        if (nodeById.classList.contains("wall")) {
          let newNode = {
            ...node,
            status: "wall",
          };
          newGrid[node.row][node.column] = newNode;
        } else if (nodeById.className === "node") {
          let newNode = {
            ...node,
            status: "",
          };
          newGrid[node.row][node.column] = newNode;
        }
      });
    });
    setGrid(newGrid);
  };

  const handleMouseDown = (row, column) => {
    if (getStartNode(grid, row, column) && !disable) {
      setIsStartNodePressed(true);
    } else if (getTargetNode(grid, row, column) && !disable) {
      setIsTargetNodePressed(true);
    } else if (!disable) {
      setPressedNode(true);
      buildWalls(grid, row, column);
    }
  };

  const handleMouseEnter = (row, column) => {
    if (!isStartNodePressed && !isTargetNodePressed && !pressedNode) return;

    if (isStartNodePressed) {
      setNodeTwoStepsBack([prevCoordinates[0], prevCoordinates[1]]);

      setPrevCoordinates([row, column]);
      setCurrentStartCoordinates([row, column]);
      if (grid[row][column].status !== "target") {
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
      if (grid[row][column].status !== "start") {
        const newGrid = moveTargetNode(grid, row, column);
        setGrid(newGrid);
      }
    } else if (pressedNode) {
      buildWalls(grid, row, column);
    }
  };

  const handleMouseUp = () => {
    setPressedNode(false);
    setIsStartNodePressed(false);
    setIsTargetNodePressed(false);
    updateWalls(grid);
  };

  const visualizeDijkstras = () => {
    if (!disable) {
      removePattern(grid);
      resetGrid(grid);
      const start =
        grid[currentStartCoordinates[0]][currentStartCoordinates[1]];
      const target =
        grid[currentTargetCoordinates[0]][currentTargetCoordinates[1]];

      const visitedNodesInOrder = dijkstra(grid, start, target);

      const nodesInShortestPath = getNodesInShortestPath(target);

      animateAlgorithm(visitedNodesInOrder, nodesInShortestPath);
    }
  };

  const visualizeAstar = () => {
    if (!disable) {
      removePattern(grid);
      resetGrid(grid);
      const start =
        grid[currentStartCoordinates[0]][currentStartCoordinates[1]];
      const target =
        grid[currentTargetCoordinates[0]][currentTargetCoordinates[1]];

      const visitedNodesInOrder = astar(grid, start, target);

      const nodesInShortestPath = nodesInShortestPathAstar(target);

      animateAlgorithm(visitedNodesInOrder, nodesInShortestPath);
    }
  };

  const visualizeDfs = () => {
    if (!disable) {
      removePattern(grid);
      resetGrid(grid);
      const start =
        grid[currentStartCoordinates[0]][currentStartCoordinates[1]];
      const target =
        grid[currentTargetCoordinates[0]][currentTargetCoordinates[1]];
      const visitedNodesInOrder = depthFirstSearch(grid, start, target);
      const nodesInShortestPath = nodesInShortestPathDfs(target);
      animateAlgorithm(visitedNodesInOrder, nodesInShortestPath);
    }
  };

  const animateAlgorithm = (visitedNodesInOrder, nodesInShortestPath) => {
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
          if (node.status === "target") {
            setAlgoDone(true);
          }

          if (node.status === "start") {
            document.getElementById(`${node.row}-${node.column}`).className =
              "node start visited";
          } else if (node.status === "weight") {
            document.getElementById(`${node.row}-${node.column}`).className =
              "node visited weight";
          } else {
            document.getElementById(`${node.row}-${node.column}`).className =
              "node visited";
          }
        }
      }, speedValue * i);
    }
  };

  const animateShortestPath = (nodesInShortestPath) => {
    for (let i = 0; i < nodesInShortestPath.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPath[i];
        const previousNode = nodesInShortestPath[i - 1];

        if (node.status === "target") {
          setDisable(false);
          document.getElementById(`${node.row}-${node.column}`).className =
            "node node-shortest-path target start";
        } else {
          document.getElementById(`${node.row}-${node.column}`).className =
            "node node-shortest-path start";
        }

        if (previousNode && previousNode.status !== "start") {
          document
            .getElementById(`${previousNode.row}-${previousNode.column}`)
            .classList.remove("start");
        }
      }, 50 * i);
    }
  };

  const clearWalls = (grid) => {
    if (!disable) {
      removePattern(grid);
      const newGrid = grid.slice();
      grid.forEach((row) => {
        row.forEach((node) => {
          if (node.status === "wall") {
            let newNode = {
              ...node,
              status: "",
            };
            newGrid[node.row][node.column] = newNode;
          }
          if (node.status === "weight") {
            document
              .getElementById(`${node.row}-${node.column}`)
              .classList.remove("weight");
            let newNode = {
              ...node,
              status: "",
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

  const removePattern = (grid) => {
    grid.forEach((row) => {
      row.forEach((node) => {
        const nodeById = document.getElementById(`${node.row}-${node.column}`);
        nodeById.classList.remove("visited");
        nodeById.classList.remove("node-shortest-path");
        if (node.status === "target") {
          nodeById.classList.remove("start");
        }
      });
    });
    setAlgoDone(false);
  };

  const resetGrid = (grid) => {
    const newGrid = grid.slice();

    grid.forEach((row) => {
      row.forEach((node) => {
        let newNode = {
          ...node,
          isVisited: false,
          shortest: false,
          distance: Infinity,
          totalDistance: Infinity,
          previousNode: null,
        };
        newGrid[node.row][node.column] = newNode;
      });
    });

    setGrid(newGrid);
  };

  const resetAll = () => {
    if (!disable) {
      removePattern(grid);
      clearWalls(grid);
      const newGrid = createInitialGrid();
      setCurrentStartCoordinates([initialStartRow, initialStartColumn]);
      setCurrentTargetCoordinates([initialTargetRow, initialTargetColumn]);
      setPrevCoordinates([initialStartRow, initialStartColumn]);
      setPrevTargetCoordinates([initialTargetRow, initialTargetColumn]);

      newGrid.forEach((row) => {
        row.forEach((node) => {
          let newNode = {
            ...node,
            status:
              node.row === initialStartRow && node.column === initialStartColumn
                ? "start"
                : node.row === initialTargetRow &&
                  node.column === initialTargetColumn
                ? "target"
                : "",
            isVisited: false,
            shortest: false,
            distance: Infinity,
            previousNode: null,
          };
          newGrid[node.row][node.column] = newNode;
        });
      });

      setGrid(newGrid);
    }
  };

  const startVisualize = () => {
    if (algorithm === "dijkstra") {
      visualizeDijkstras();
    } else if (algorithm === "astar") {
      visualizeAstar();
    } else if (algorithm === "dfs") {
      visualizeDfs();
    }
  };

  const getGridWithMaze = (grid, walls) => {
    const newGrid = grid.slice();
    for (let wall of walls) {
      let node = grid[wall[0]][wall[1]];

      let newNode = {
        ...node,
        status: "wall",
      };
      newGrid[wall[0]][wall[1]] = newNode;
    }

    setGrid(newGrid);
  };

  const getGridWithWeightMaze = (grid, weights) => {
    const newGrid = grid.slice();
    for (let weight of weights) {
      let node = grid[weight[0]][weight[1]];

      let newNode = {
        ...node,
        status: "weight",
      };
      newGrid[weight[0]][weight[1]] = newNode;
    }

    setGrid(newGrid);
  };

  const animateMaze = (grid, walls) => {
    for (let i = 0; i <= walls.length; i++) {
      if (i === walls.length) {
        resetGrid(grid);
        clearWalls(grid);
        setTimeout(() => {
          getGridWithMaze(grid, walls);
          setDisable(false);
        }, 20 * i);

        return;
      }
      const wall = walls[i];
      const node = grid[wall[0]][wall[1]];
      setTimeout(() => {
        document.getElementById(`${node.row}-${node.column}`).className =
          "node wall";
      }, 20 * i);
    }
  };

  const animateWeightMaze = (grid, weights) => {
    for (let i = 0; i <= weights.length; i++) {
      if (i === weights.length) {
        resetGrid(grid);
        clearWalls(grid);
        setTimeout(() => {
          getGridWithWeightMaze(grid, weights);
          setDisable(false);
        }, 20 * i);

        return;
      }
      const weight = weights[i];
      const node = grid[weight[0]][weight[1]];
      setTimeout(() => {
        document.getElementById(`${node.row}-${node.column}`).className =
          "node weight";
      }, 20 * i);
    }
  };

  const recursiveDivisionMaze = () => {
    if (!disable) {
      removePattern(grid);

      resetGrid(grid);
      setTimeout(() => {
        const start =
          grid[currentStartCoordinates[0]][currentStartCoordinates[1]];
        const target =
          grid[currentTargetCoordinates[0]][currentTargetCoordinates[1]];

        setDisable(true);

        const walls = recursiveDivision(grid, start, target);

        animateMaze(grid, walls);
      }, 20);
    }
  };

  const buildRandomMaze = () => {
    if (!disable) {
      removePattern(grid);
      resetGrid(grid);
      setTimeout(() => {
        const start =
          grid[currentStartCoordinates[0]][currentStartCoordinates[1]];
        const target =
          grid[currentTargetCoordinates[0]][currentTargetCoordinates[1]];
        setDisable(true);
        const walls = randomMaze(grid, start, target);

        animateMaze(grid, walls);
      }, 20);
    }
  };

  const buildRandomWeightMaze = () => {
    if (!disable) {
      removePattern(grid);
      resetGrid(grid);
      setTimeout(() => {
        setDisable(true);
        const start =
          grid[currentStartCoordinates[0]][currentStartCoordinates[1]];
        const target =
          grid[currentTargetCoordinates[0]][currentTargetCoordinates[1]];
        setDisable(true);
        const weights = randomMaze(grid, start, target);

        animateWeightMaze(grid, weights);
      }, 20);
    }
  };

  return (
    <Fragment>
      <Menu
        resetAll={() => resetAll()}
        startVisualize={() => startVisualize()}
        disable={disable}
        setDisable={setDisable}
        algorithm={algorithm}
        setAlgorithm={(e) => setAlgorithm(e)}
        algorithmSpeed={algorithmSpeed}
        setAlgorithmSpeed={(e) => setAlgorithmSpeed(e)}
        speedValue={speedValue}
        setSpeedValue={(e) => setSpeedValue(e)}
        clearWalls={() => clearWalls(grid)}
        recursiveDivisionMaze={() => recursiveDivisionMaze()}
        buildRandomMaze={() => buildRandomMaze()}
        buildRandomWeightMaze={() => buildRandomWeightMaze()}
        showTutorial={showTutorial}
        setShowTutorial={(e) => setShowTutorial(e)}
      />

      <Tutorial
        showTutorial={showTutorial}
        setShowTutorial={() => setShowTutorial()}
      />
      <div className="container">
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
      <Info algorithm={algorithm} setAlgorithm={setAlgorithm} />
    </Fragment>
  );
};

function useKeyPress(targetKey) {
  const [keyPressed, setKeyPressed] = useState(false);

  function downHandler({ key }) {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }

  const upHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []);

  return keyPressed;
}

export default Board;
