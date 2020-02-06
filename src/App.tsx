import React from 'react';
import logo from './logo.svg';
import './App.css';
import DWT from './components/WebTwain';
import WebBarcode from './components/WebBarcode';

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

      <div>
        <WebBarcode title="Lector de códigos de barra" />
      </div>
    </div>
  );
}

export default App;
