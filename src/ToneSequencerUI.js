function getCurCol(cols) {
  let col = document.querySelector("tone-sequencer-ui");
  console.log(col);
  if(col) 
    col = col.getAttribute("higlight");
  else 
    return Array(9).fill(false);

  if(col === "-1")
    col = "0";
  console.log(cols[col]);
  return Array(9).fill(false);
}

class ToneSequencerUI extends HTMLElement {
  constructor() {
    super();

    // Create a shadow root
    const shadow = this.attachShadow({mode: 'open'});

    const container = document.createElement('div');
    container.setAttribute('id', 'container');
    container.setAttribute('data-mode', 'unset');

    // move/click handlers cover click/drag instrument toggles
    container.ondragstart = function(event) {return false} // don't try to drag my div!!
    container.ondrop = function(event) {return false}

    container.onmouseenter = function(event) {
      if(!(event.which === 1)) 
        container.setAttribute('data-mode', 'unset');
    }

    container.onmousemove = function(event) {
      if(event.which === 1 && event.target.classList.contains('row')) {
        if(container.getAttribute('data-mode') === "unset") {
          if(event.target.classList.contains('filled'))
            container.setAttribute('data-mode', 'unfill');
          else
            container.setAttribute('data-mode', 'fill');
        }

        if(container.getAttribute('data-mode') === 'fill' && !event.target.classList.contains('filled'))
          event.target.classList.toggle('filled');
        else if(container.getAttribute('data-mode') === 'unfill' && event.target.classList.contains('filled'))
          event.target.classList.toggle('filled');
      }
    };

    container.onmouseup = function(event) {
      container.setAttribute('data-mode', 'unset');
    }

    container.onclick = function(event) {
      if(event.target.classList.contains('row')) {
        event.target.classList.toggle('filled');
      }
    };

    // Get value from data-cols="here"
    // const numCols = this.getAttribute('data-cols');
    let numCols = 8;
    const numRows = 9;
  
    // This will contain the rows
    let columns = [];

    // populate columns array
    for(let i = 0; i < numCols; i++) {
      let column = document.createElement('div');
      column.setAttribute('class', 'column');
      columns.push(column);
    }

    // TODO
    // this returns list, need to collect those to return
    console.log(columns[0].children);
    // for each child, if .classList.contains('filled') then true

    // One row for each instrument
    let rows = [];

    // populate rows array
    for(let i = 0; i < numRows; i++) {
      let row = document.createElement('div');
      row.setAttribute('class', 'row');
      rows.push(row);
    }

    this.currentColumn = getCurCol(columns);


    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: inline-block;
        width: 70%;
        height: 120px;
      }

      #container {
        margin-top: 5%;
        margin-bottom: 25%;
        width: 100%;
        height: 100%;
        display: flex;
      }

      .column {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .column.highlight {
        background-color: gray;
      }

      .column.highlight .row {
        transition-duration: 0.4s;
      }

      .column.highlight .row.filled {
        transition: background-color 0.1s;
      }

      .column.highlight .row.filled {
        background-color: white;
      }

      .row {
        min-height: 25px;
        flex: 1;
        margin: 1px;
        background-color: lightgray;
        transition: background-color 0s;
      }

      .row.filled {
        background-color: teal;
      }
    `;

    // Attach the created elements to the shadow dom
    shadow.appendChild(style);
    shadow.appendChild(container);
    for(let column of columns) {
      container.appendChild(column);
      for(let row of rows)
        column.appendChild(row.cloneNode(true));
    }
  }
}

// Define the new element
customElements.define('tone-sequencer-ui', ToneSequencerUI);

// class ToneTransport extends HTMLElement {
//   constructor() {
//     super();

//     // Create a shadow root
//     const shadow = this.attachShadow({mode: 'open'});

//     const container = document.createElement('div');
//     container.setAttribute('id', 'container');

//     const top = document.createElement('div');
//     top.setAttribute('id', 'top');

//     const btn = document.createElement('button');
//     btn.setAttribute('class', 'btn btn-secondary');
//     const btnCnt = document.createElement('span');
//     btnCnt.setAttribute('class', 'fa fa-play');
//     btnCnt.style.margin = "5%";

//     const style = document.createElement('style');
//     style.textContent = `
//       :host {
//         display: block;
//       }

//       #container {
//         background-color: lightgray;
//         padding: 5px;
//       }

//       tone-play-toggle {
//         width: 50%;
//       }

//       #top {
//         position: relative;
//       }

//       #top tone-play-toggle {
//         width: 60%;
//       }

//       #top #position {
//         background-color: white;
//         padding: 5px;
//         position: absolute;
//         width: 30%;
//         right: 8px;
//         transform: translate(0%, -50%);
//         text-align: center;
//         top: 50%;
//         font-family: monospace;
//       }

//       tone-rack {
//         margin-top: 10px;
//       }

//       tone-slider, tone-toggle {
//         display: block;
//         margin-top: 10px;
//       }

//       tone-slider {
//         width: 80%;
//         margin: 10px auto 0;
//       }

//       #tempo {
//         width: calc(100% - 10px);
//       }
//     `;

//     // Attach the created elements to the shadow dom
//     shadow.appendChild(style);
//     shadow.appendChild(container);
//     container.appendChild(top);
//     top.appendChild(btn);
//     btn.appendChild(btnCnt);
//   }
// }

// // Define the new element
// customElements.define('tone-transport', ToneTransport);