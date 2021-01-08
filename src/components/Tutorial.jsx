import React, { Fragment } from 'react';

import '../assets/styles/Tutorial.css';

const Tutorial = () => {
  const page1 = (
    <>
      <div className='rocket-img'></div>
      <h3>This is Pathfinder</h3>
      <h6>This is a tutorial for this application and it's features.</h6>
      <p>
        Press the "Skip Tutorial" button below if you want to dive right in.
        Otherwise, press "Next".
      </p>
    </>
  );
  return <div className='tutorial-container hidden'>{page1}</div>;
};

export default Tutorial;
