import React from 'react';
import logo from './logo.svg';
import './App.css';
import { WebTwain } from './WebTwain';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Prueba dwt IoIp</h2>
        <WebTwain />
      </header>
    </div>
  );
}

export default App;
