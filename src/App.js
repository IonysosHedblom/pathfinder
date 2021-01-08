import React, { useState } from 'react';
import Board from './components/Board';
import Tutorial from './components/Tutorial';

import './assets/styles/styles.css';

function App() {
  return (
    <div className='App'>
      <Tutorial />
      <Board />
    </div>
  );
}

export default App;
