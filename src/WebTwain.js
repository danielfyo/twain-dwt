import React, { Component } from 'react';
import './WebTwain.css';
import Dynamsoft from 'dwt';

export class WebTwain extends Component {
  componentDidMount() {

    Dynamsoft.WebTwainEnv.AutoLoad = false;
    /**
     * In order to use the full version, do the following
     * 1. Change Dynamsoft.WebTwainEnv.Trial to false
     * 2. Replace A-Valid-Product-Key with a full version key
     * 3. Change Dynamsoft.WebTwainEnv.ResourcesPath to point to the full version 
     *    resource files that you obtain after purchasing a key
     */
    Dynamsoft.WebTwainEnv.Trial = true;
    Dynamsoft.WebTwainEnv.ProductKey = "t0141cQMAAJxnh4Yp1hYz6iW67PSArOVbdY/p5u2Vmw8F73QqYY1s84+ZUw30+OUWFnwz5ukkpI5e7UxA2Gg0ctzT/bL3IZEco29mOYT0ZMJk6khg1HtrPoz9MYv8zCVOnWnEhWKjCWOxYdiPwpu9Iu75NpowFhuG/SR6PpOukYTRhLHYEO/G2p+CFe5+AKpw";
    Dynamsoft.WebTwainEnv.ResourcesPath = "https://tst.dynamsoft.com/libs/dwt/15.0";
    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  constructor(props) {
    super(props);
  }

  loadDWT() {
    Dynamsoft.WebTwainEnv.Load();
  }

  handleClick() {
    var dwObject = Dynamsoft.WebTwainEnv.GetWebTwain('dwtcontrolContainer');
    if (dwObject) {
      var bSelected = dwObject.SelectSource();
      if (bSelected) {
        var onAcquireImageSuccess = function () { dwObject.CloseSource(); };
        var onAcquireImageFailure = onAcquireImageSuccess;
        dwObject.OpenSource();
        dwObject.AcquireImage({}, onAcquireImageSuccess, onAcquireImageFailure);
      }
    } else {
      alert("Please press 'Load DWT' first!");
    }
  }

  render() {
    return (
      <div>
        <button onClick={this.loadDWT}>Load DWT</button><span>   </span>
        <button onClick={this.handleClick}>Scan Document</button>
        <div id="dwtcontrolContainer"></div>
      </div>
    );
  }
}

