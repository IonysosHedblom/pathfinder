import React, { useState } from 'react';

import '../assets/styles/Tutorial.css';

const Tutorial = ({ showTutorial, setShowTutorial }) => {
  const closeTutorial = e => {
    setShowTutorial(false);
  };
  const [currentPage, setCurrentPage] = useState(1);

  const handlePreviousClick = e => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = e => {
    if (currentPage === 8) {
      setCurrentPage(1);
    } else {
      setCurrentPage(currentPage + 1);
    }
  };
  const page =
    currentPage === 1 ? (
      <div className='tutorial-page'>
        <h3>
          Welcome to the Trailblazer App!
          <hr />
        </h3>

        <h6>
          Press{' '}
          <span className='next-span'>
            <button disabled>Next</button>
          </span>{' '}
          to see how it works.
        </h6>
        {/* <p className='purpose-paragraph'>
          The purpose of The Trailblazer is to visualize pathfinding algorithms.
        </p>
        <p className='skip-paragraph'>
          Press the <strong>"Skip Tutorial"</strong> button below if you want to
          dive right in.
          <br /> To learn more, press <strong>"Next"</strong>.
        </p> */}

        <div className='rocket-img'></div>
      </div>
    ) : currentPage === 2 ? (
      <div className='tutorial-page'>
        <h3>
          Choose an algorithm
          <hr className='hr-page-two' />
        </h3>
        <h6 className='page-three-h6'>
          Choose an algorithm from the "Algorithms" drop-down menu at the
          top-left of your screen.
        </h6>

        <div className='algo-img'></div>
      </div>
    ) : currentPage === 3 ? (
      <div className='tutorial-page-four'>
        <h3>
          Meet the available algorithms
          <hr />
        </h3>

        <ul>
          <li>
            <span>Dijkstra's Algorithm</span> (weighted): the father of
            pathfinding algorithms; guarantees the shortest path
          </li>
          <li>
            <span>A* Search</span> (weighted): arguably the best pathfinding
            algorithm; uses heuristics to guarantee the shortest path much
            faster than Dijkstra's algorithm
          </li>
          <li>
            <span>Depth-first Search</span> (unweighted): a very bad algorithm
            for pathfinding; does not guarantee the shortest path. I chose to
            include this algorithm so that the user can see the differences
            between a good pathfinding algorithm and a bad one.
          </li>
        </ul>
      </div>
    ) : currentPage === 4 ? (
      <div className='tutorial-page'>
        <h3>
          Dragging nodes
          <hr />
        </h3>
        <h6>Click and drag the start and target nodes to move them.</h6>

        <div className='move-gif'></div>
      </div>
    ) : currentPage === 5 ? (
      <div className='tutorial-page-five'>
        <h3>
          Adding walls
          <hr />
        </h3>
        <h6>
          <span>Walls: </span>Click and drag - Can not pass through.
        </h6>
        <h6>
          <span>Weights: </span>Click and drag while holding "W"-key - Can pass
          through.
        </h6>

        <div className='walls-gif'></div>
      </div>
    ) : currentPage === 6 ? (
      <div className='tutorial-page'>
        <h3>
          Visualize and more
          <hr />
        </h3>
        <h6 className='page-seven-h6'>
          Use the navbar buttons to visualize algorithms and to do other stuff.
        </h6>
        <p className='navbar-info'>
          You can clear the walls, weight or even the entire board. And also try
          visualizing the algorithm on different speeds, all from the navbar.
          You can access this tutorial again by clicking the tutorial button in
          the navbar (top-right of your screen).
        </p>

        <div className='navbar-img'></div>
      </div>
    ) : currentPage === 7 ? (
      <div className='tutorial-page'>
        <h3>
          What is the purpose of Trailblazer?
          <hr />
        </h3>
        <h6 className='page-two-h6'>
          Essentially, the Trailblazer is a pathfinding algorithm visualizer.
        </h6>
        <div className='page-two-paragraphs'>
          <p className='page-two-explanation'>
            A pathfinding algorithm seeks out the shortest path between a given
            starting point and ending point. This application visualizes a
            selection of pathfinding algorithms in action, and more.
          </p>
          <p className='page-two-explanation'>
            The algorithms available in the Trailblazer are adapted for a 2D
            grid, where 90 degree turns have a "cost" of 1 and movements from a
            node to another also have a "cost" of 1.
          </p>
        </div>

        <div className='path-img'></div>
      </div>
    ) : currentPage === 8 ? (
      <div className='tutorial-page-eight'>
        <h3>
          Hope you enjoy my application!
          <hr />
        </h3>
        <h6>
          If you are interested in the source code for this application, visit
          my{' '}
          <a
            className='github-link'
            href='https://github.com/IonysosHedblom'
            target='_blank'
            rel='noreferrer'
          >
            Github
          </a>
        </h6>
      </div>
    ) : (
      ''
    );

  return (
    <>
      {showTutorial ? (
        <div className='tutorial-container'>
          {page}
          <div className='tutorial-button-group'>
            <button
              onClick={e => closeTutorial(e)}
              className='tutorial-button skip'
            >
              Skip Tutorial
            </button>
            <button
              onClick={e => handlePreviousClick(e)}
              className='tutorial-button previous'
            >
              Previous
            </button>
            <button
              onClick={e => handleNextClick(e)}
              className='tutorial-button next'
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default Tutorial;
