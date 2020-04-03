// ReactDOMServer.renderToString(thing_to_render) will greatly improve page load times.

import React from 'react';
import './App.css';

function importAll(r) {
  return r.keys().map(r);
}

// cannot wrap this in a function -- handled compile-time, not run-time
const samplesArr = {'1' : importAll(require.context('./Audio', false, /\.wav$/i))};
samplesArr['2'] = importAll(require.context('./Audio2', false, /\.wav$/i));
samplesArr['3'] = importAll(require.context('./Audio3', false, /\.wav$/i));
// samplesArr['4'] = importAll(require.context('./Audio4', false, /\.wav$/i));

let key = '1';

function playNote(note) {
  var audio = new Audio();
  audio.loop = false;
  var samples = samplesArr[key]

  switch(note) {
    case 'q': // hh
      audio.src = samples[0];
      break;
    case 'w': // misc
      audio.src = samples[1];
      break;
    case 'e': // misc
      audio.src = samples[2];
      break;
    case 'a': // md bass
      audio.src = samples[3];
      break;
    case 's': // snare
      audio.src = samples[4];
      break;
    case 'd': // misc
      audio.src = samples[5];
      break;
    case 'z': // dp bass
      audio.src = samples[6];
      break;
    case 'x': // misc
      audio.src = samples[7];
      break;
    case 'c': // misc
      audio.src = samples[8];
      break;
    default:
      audio.src = samples[9];
  }
  audio.play();
}

class DrumPad extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handlePress = this.handlePress.bind(this);
  }

  handleClick(event) {
    playNote(this.props.letter);
  }

  handlePress(event) {
    var clickedBtn = document.getElementById("drum-pad-"+event.key);
    if(clickedBtn) {
      clickedBtn.classList.add("drum-pad-active");
      window.setTimeout(function() {
        clickedBtn.classList.remove("drum-pad-active");
      }, 250);
    }
    playNote(event.key);
  }

  render() {
    return (
      <button id={"drum-pad-"+this.props.letter} className="drum-pad col-3 my-4 btn btn-secondary" onClick={this.handleClick.bind(this)} onKeyPress={this.handlePress.bind(this)}>{this.props.letter}</button>
    );
  }
};

class DrumMachine extends React.Component {
  componentDidMount() {
    document.body.addEventListener('click', this.focuser);
    this.focuser();
  }

  focuser() {
    if(document.activeElement.tagName === "BODY")
      document.getElementById('drum-pad-q').focus();
  }

  render() {
    return (
      <div id="drum-machine" className="container">
        <div className="row justify-content-around">
          <DrumPad letter="q" />
          <DrumPad letter="w" />
          <DrumPad letter="e" />
        </div>
        <div className="row justify-content-around">
          <DrumPad letter="a" />
          <DrumPad letter="s" />
          <DrumPad letter="d" />
        </div>
        <div className="row justify-content-around">
          <DrumPad letter="z" />
          <DrumPad letter="x" />
          <DrumPad letter="c" />
        </div>
      </div>
    );
  }
};

// class Test extends React.Component {
//   render() {
//     var enumeratorPromise = navigator.mediaDevices.enumerateDevices();
//     console.log(enumeratorPromise);
//     return (
//       <div />
//     );
//   }
// }

class AudioSwitch extends React.Component {
  constructor(props) {
    super(props);
    this.dropSelect = this.dropSelect.bind(this);
  }

  dropSelect(event) {
    // alert(event.target.options[event.target.selectedIndex].text);
    // alert(event.target.value);
    key = event.target.value;
    document.getElementById('drum-pad-q').focus();
  }

  render() {
    return (
      <div className="container">
        <select className="btn btn-secondary" onChange={this.dropSelect.bind(this)}>
          <option value='1'>PHAT Beats</option>
          <option value='2'>SYCK Beats</option>
          <option value='3'>DYRTY Beats</option>
          {/*<option value='4'>DEM Beats</option>*/}
        </select>
      </div>
    );
  }
};


function App() {
  return (
    <div className="App App-header">
      <div className="row container-fluid">
        <div className="col-8 offset-2">
          <header className="app-title">
            <h1>DReact</h1>
            <h6 style={{fontStyle: "italic"}}>Drum machine made with... React</h6>
          </header>
        </div>
        <div className="col-auto">
          <AudioSwitch />
        </div>
      </div>
      <DrumMachine />
      {/*<Test />*/}
    </div>
  );
}

export default App;
