// ReactDOMServer.renderToString(thing_to_render) will greatly improve page load times.

import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Tone from 'tone';
import Nexus from 'nexusui';
import { Button, Toggle, Dial, Number, Position, Slider, Envelope, Multislider, Piano, RadioButton, Select, Sequencer, TextButton, Tilt, Pan, Pan2D } from 'react-nexusui';

function importAll(r) {
  return r.keys().map(r);
}

const letterButtons = ['q','w','e','a','s','d','z','x','c'];
const soundProfiles = ['hh', 'fx', 'fx', 'mdBass', 'snare', 'fx', 'dpBass', 'fx', 'fx']
Nexus.colors.accent = "blue";
Nexus.colors.fill = "black";

// cannot wrap this in a function -- handled compile-time, not run-time
const samplesArr = {'1' : importAll(require.context('./Audio', false, /\.wav$/i))};
samplesArr['2'] = importAll(require.context('./Audio2', false, /\.wav$/i));
samplesArr['3'] = importAll(require.context('./Audio3', false, /\.wav$/i));
// samplesArr['4'] = importAll(require.context('./Audio4', false, /\.wav$/i));

let key = '1';
// var samples = samplesArr[key];
// var player = new Tone.Player(samples[0]).toMaster();
// Tone.Transport.loop = true;
// var e = new Tone.Event(playNote(''), ["q","a","q","q","a"]);
// //loop it every measure for 8 measures
// e.start();
// e.loop = 8;
// e.loopEnd = "1m";

function playNote(note) {
  var audio = new Audio();
  audio.loop = false;
  var samples = samplesArr[key]

  switch(note) {
    case 'q': // hh
      audio.src = samples[0];
      // player.start();
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

class AudioSwitch extends React.Component {
  constructor(props) {
    super(props);
    this.newKey = this.newKey.bind(this);
  }

  newKey(event) {
    // alert(event.target.options[event.target.selectedIndex].text);
    // alert(event.target.value);
    key = event.target.value;
  }

  render() {
    return (
      <div className="container">
        <select className="btn btn-secondary" onChange={this.newKey.bind(this)}>
          <option value='1'>PHAT Beats</option>
          <option value='2'>SYCK Beats</option>
          <option value='3'>DYRTY Beats</option>
          {/*<option value='4'>DEM Beats</option>*/}
        </select>
      </div>
    );
  }
};

function PlayMeasure(notes) {
  let LBlen = letterButtons.length - 1;
  for(let i = 0; i < notes.length; i++) {
    let inverse = LBlen - i;
    if(notes[i] === 1) 
      playNote(letterButtons[inverse]);
  }
}

// returns tempo in milliseconds
function TempoToMs(newTempo) {
  return(60000 / newTempo)
}

function GetNote(e) {
  if(e.state)
    playNote(letterButtons[e.row]);
}

// SequencerRef.current.start => smaller number is faster tempo
function Recording() {
  // state but in function instead of class
  const [ms, setMs] = useState(500);
  const [tempo, setTempo] = useState(120);

  // componentDidMount but in function instead of class
  // used here to append letters to the sequencer
  useEffect(() => {
    let boxes = document.querySelector('[id^="nexus-ui-sequencer-"]').firstElementChild.children;
    let letterBoxes = [];
    for(let i = 0; i < boxes.length; i++) {
      if(boxes[i].style.left === "0px") {
        letterBoxes.push(boxes[i].cloneNode(false));
      }
    }

    let labels = document.querySelector('[id^="nexus-ui-sequencer-"]').firstElementChild.cloneNode(false);
    labels.style.height = "auto";
    labels.style.cursor = "auto";

    for(let i = 0; i < letterBoxes.length; i++) {
      letterBoxes[i].appendChild(document.createTextNode(letterButtons[i] + ' (' + soundProfiles[i] + ')')); // add letters
      letterBoxes[i].style.left = "-120px";
      letterBoxes[i].style.overflow = "visible";
      letterBoxes[i].style.textAlign = "right";
      letterBoxes[i].style.whiteSpace = "nowrap";
      letterBoxes[i].style.width = "120px";
      labels.appendChild(letterBoxes[i]); // build element
    }

    let insertPos = document.querySelector('[id^="nexus-ui-sequencer-"]');
    insertPos.insertBefore(labels, insertPos.childNodes[0]);
  });

  // Sequencer Playback interactions
  const sequencerRef = React.useRef(Nexus.Sequencer);
  let seqRows = 9;
  let seqCols = 12;
  return (
    <React.Fragment>
      <Sequencer 
        rows={seqRows}
        columns={seqCols}
        size={[seqCols*40, seqRows*40]}
        onStep={PlayMeasure}
        onChange={GetNote}
        onReady={sequencer => (sequencerRef.current = sequencer)} 
      />

      <div className="container">
        <div className="row">
          <button type="button" className="btn btn-success col-1 seq-btn" 
            onClick={() => {
              if(!sequencerRef.current.interval.on)
                sequencerRef.current.start(ms);
            }}><span className="fa fa-play" /></button>

          <button type="button" className="btn btn-danger col-1 seq-btn" 
            onClick={() => {
              if(sequencerRef.current.interval.on)
                sequencerRef.current.stop();
            }}><span className="fa fa-stop" /></button>

          <button type="button" className="btn btn-secondary col-1 offset-1 seq-btn" 
            onClick={() => {
              if(seqCols > 8) {
                sequencerRef.current.matrix.populate.all(0);
                seqCols -= 1;
                sequencerRef.current.columns = seqCols;
                sequencerRef.current.resize(seqCols*40, seqRows*40);
              }
            }}><span className="fa fa-minus-circle" /></button>

          <button type="button" className="btn btn-primary col-1 seq-btn" 
            onClick={() => {
              if(seqCols < 20) {
                sequencerRef.current.matrix.populate.all(0);
                seqCols += 1;
                sequencerRef.current.columns = seqCols;
                sequencerRef.current.resize(seqCols*40, seqRows*40);
              }
            }}><span className="fa fa-plus-circle" /></button>

          <button type="button" className="btn btn-danger col-1 offset-1 seq-btn" 
            onClick={() => {
              sequencerRef.current.matrix.populate.all(0);
            }}><span className="fa fa-window-close" /></button>

          <button type="button" className="btn btn-light col-1 offset-1 seq-btn" 
            onClick={() => {
              if(ms < 1000) {
                setTempo(tempo-5)
                setMs(TempoToMs(tempo));
                sequencerRef.current.interval.ms(ms);
              }
            }}><span className="fa fa-fast-backward" /></button>

          <button type="button" className="btn btn-light col-1 seq-btn" 
            onClick={() => {
              if(ms > 200) {
                setTempo(tempo+5)
                setMs(TempoToMs(tempo));
                sequencerRef.current.interval.ms(ms);
              }
            }}><span className="fa fa-fast-forward" /></button>
          </div>
      </div>
      <span>Tempo: {tempo}BPM</span>
    </React.Fragment>
  );
}

class RecWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibility: false
    };

    this.toggleVisibility = this.toggleVisibility.bind(this);
  }

  toggleVisibility() {
    this.setState(state => ({
      visibility: !state.visibility
    }));
  }

  render() {
    if(this.state.visibility) {
      return(
        <div id="sequencer">
          <button 
          onClick={this.toggleVisibility.bind(this)} 
          type="button" 
          className="btn btn-success" 
          style={{margin: "5%", transform: "rotate(270deg)"}}>
            <span className="fa fa-play" />
          </button>
          <Recording />
        </div>
      );
    }
    else {
      return(
        <button 
        onClick={this.toggleVisibility.bind(this)} 
        type="button" 
        className="btn btn-success" >
          <span className="fa fa-play" style={{margin: "5%", transform: "rotate(90deg)"}} />Sequencer
        </button>
      );
    }
  }
}

function App() {
  return (
    <div className="App App-header">
      <div className="row container-fluid">
        <div className="col-8 offset-2">
          <header className="app-title">
            <h1>DReact</h1>
            <h6 style={{fontStyle: "italic"}}>React, Nexus & Tone in action</h6>
          </header>
        </div>
        <div className="col-auto">
          <AudioSwitch />
        </div>
      </div>
      <DrumMachine />
      <RecWrapper />
    </div>
  );
}

export default App;
