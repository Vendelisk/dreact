import Tone from 'tone';

function importAll(r) {
  return r.keys().map(r);
}

function switchSamples(k) {
  
}

const samplesArr = {'1' : importAll(require.context('./Audio', false, /\.wav$/i))};

function ToneSequencerLogic() {
  // Tone.Players(mappable location of audio sources, default load settings function)
  var keys = new Tone.Players({
    "hh" : "a",
    "fx1" : "b",
    "fx2" : "c",
    "mdBass" : "d",
    "snare" : "e",
    "fx3" : "f",
    "dpBass" : "g",
    "fx4" : "h",
    "fx5" : "i",
  }, {
    "volume" : -10,
    "fadeOut" : "64n",
  }).toMaster();

  //the notes
  var noteNames = ["fx5", "fx4", "dpBass", "fx3", "snare", "mdBass", "fx2", "fx1", "hh"];

  var loop = new Tone.Sequence(function(time, col){
    var column = document.querySelector("tone-sequencer-ui").currentColumn;
    column.forEach(function(val, i){
      if (val){
        //slightly randomized velocities
        var vel = Math.random() * 0.5 + 0.5;
        keys.get(noteNames[i]).start(time, 0, "32n", 0, vel);
      }
    });
    //set the column on the correct draw frame
    Tone.Draw.schedule(function(){
      document.querySelector("tone-sequencer-ui").setAttribute("highlight", col);
    }, time);
  }, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "16n").start(0);

  //bind the interface
  // document.querySelector("tone-transport").bind(Tone.Transport);
  // document.getElementById("transport-switch").bind(Tone.Transport);
  this.transport = Tone.Transport;

  Tone.Transport.on("stop", () => {
    setTimeout(() => {
      document.querySelector("tone-sequencer-ui").setAttribute("highlight", "-1");
    }, 100);
  });
}

export default ToneSequencerLogic;