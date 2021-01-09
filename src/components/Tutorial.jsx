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
    if (currentPage === 9) {
      setCurrentPage(1);
    } else {
      setCurrentPage(currentPage + 1);
    }
  };
  const page =
    currentPage === 1 ? (
      <div className='tutorial-page'>
        <h3>Welcome to the Trailblazer App!</h3>
        <h6>This is a tutorial for the application and it's features.</h6>
        <p className='purpose-paragraph'>
          The purpose of The Trailblazer is to visualize pathfinding algorithms.
        </p>
        <p className='skip-paragraph'>
          Press the <strong>"Skip Tutorial"</strong> button below if you want to
          dive right in.
          <br /> To learn more, press <strong>"Next"</strong>.
        </p>

        <div className='rocket-img'></div>
      </div>
    ) : currentPage === 2 ? (
      <div className='tutorial-page'>
        <h3>What is the purpose of Trailblazer?</h3>
        <h6 className='page-two-h6'>
          Essentially, the Trailblazer is a pathfinding algorithm visualizer.
        </h6>
        <p>
          A pathfinding algorithm seeks out the shortest path between a given
          starting point and ending point. This application visualizes a
          selection of pathfinding algorithms in action, and more.
        </p>
        <p>
          The algorithms available in the Trailblazer are adapted for a 2D grid,
          where 90 degree turns have a "cost" of 1 and movemenets from a node to
          another also have a "cost" of 1.
        </p>
        <div className='path-img'></div>
      </div>
    ) : (
      ''
    );

  return (
    <>
      {showTutorial ? (
        <div className='tutorial-container'>
          <div className='page-counter'>{`${currentPage}/9`}</div>
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
