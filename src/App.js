import React from 'react';
import Board from './components/Board';
import Menu from './components/Menu';
import './assets/styles/styles.css';

function App() {
  return (
    <div className='App'>
      <Menu />
      <Board />
    </div>
  );
}

export default App;
