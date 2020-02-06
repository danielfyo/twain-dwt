import React from 'react';
import logo from './logo.svg';
import './App.css';
import DWT from './WebTwain';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Prueba dwt IoIp</h2>
      </header>
      <div>
        <DWT />
      </div>
    </div>
  );
}

export default App;
