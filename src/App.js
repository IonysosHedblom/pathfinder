import React from 'react';
import Board from './components/Board';

import './assets/styles/styles.css';

function App() {
  return (
    <div className='App'>
      <h1 className='nomobile'>This app is only for desktop.</h1>
      <div className='onlydesktop'>
        <Board />
      </div>
    </div>
  );
}

export default App;
