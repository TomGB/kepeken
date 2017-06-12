import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

function copyToClipboard(text) {
  window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
}

function NotesArea({notes, updateNote, selectNote, editNote, deselectNote, startSelectBox, endSelectionBox, drawSelectBox, selectionBox}) {
  return (
    <div
      className='noteContainer'
      onMouseDown={(event) => startSelectBox(event)}
      onMouseUp={(event) => {
        deselectNote(event)
        endSelectionBox(event)
      }}
      onMouseMove={(event) => drawSelectBox(event)}
    >
      {notes.map((note, index) =>
        <div
          className={`note${note.selected?' selected':''}`}
          data-index={index}
          key={index}
          onMouseDown={(event) => selectNote(event, index)}
          style={note.style} >
          <textarea
            className='noteText'
            onChange={(event) => updateNote(event, index)}
            readOnly={!(note.editable || note.editing)}
            onDoubleClick={(event) => editNote(event, index)} >
          </textarea>
        </div>
      )}
      <div className={`selection-box${selectionBox.visible?'':' invisible'}`} style={selectionBox.style}>
      </div>
    </div>
  )
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      notes: [],
      stepNumber: 0,
      selectionBox: {
        visible: false,
        style: {},
      }
    };

    window.addEventListener("keydown",
      (e) => {
          if (e.key === 'Shift') {
            this.setState({
              ...this.state,
              shiftKey: true
            });
          };

          if(e.key === 'Escape') {
            this.deselectNote(e);
          }
      },
    false);

    window.addEventListener("keyup",
      (e) => {
          if (e.key === 'Shift') {
            this.setState({
              ...this.state,
              shiftKey: false
            });
          };
      },
    false);
  }

  // componentDidUpdate() {
  //   console.(this.state);
  // }

  createNote() {
    const notes = this.state.notes;

    notes.push({ style: { top: 100, left: 100 } });

    this.setState({
      notes
    });
  }

  updateNote (event, index) {
    const notes = this.state.notes;

    console.log(index);

    notes[index].content = event.target.value;

    this.setState({
      notes
    });
  }

  selectNote (event, i) {
    const notes = this.state.notes;

    if (!event.shiftKey) {
      notes.forEach(note => {
        note.selected = false;
        note.movable = false;
      });
    }

    notes[i].selected = true;
    notes[i].movable = true;

    this.setState({
      notes
    });
  }

  moveNote (event, index) {
    const notes = this.state.notes;

    if (this.state.movingNotes) {

      const notesToMove = [];
      notes.forEach(note => {
        if(note.movable && !note.editing) {
          notesToMove.push(note);
        }
      })

      console.log('notes to move:',notesToMove.length);

      if (notesToMove.length) {
        if (event.buttons) {
          notesToMove.forEach( note => {
            if (note.oldX) {
              note.X = event.clientX;
              note.Y = event.clientY;

              const diffX = note.X - note.oldX;
              const diffY = note.Y - note.oldY;

              note.style.left = note.style.left + diffX;
              note.style.top = note.style.top + diffY;

              note.oldX = note.X;
              note.oldY = note.Y;
            } else {
              note.oldX = event.clientX;
              note.oldY = event.clientY;
            }

            this.setState({
              notes
            });
          });
        } else {
          this.releaseNote();
        }
      }
    }

  }

  releaseNote () {
    const notes = this.state.notes;

    notes.forEach(note => {
      if(!note.selected){
        note.movable = false;
      }

      note.oldX = null;
      note.oldY = null;
    });

    this.setState({
      notes
    });
  }

  editNote (event, i) {
    const notes = this.state.notes;
    notes[i].editing = true;

    this.setState({
      notes
    });
  }

  deselectNote (event) {
    const notes = this.state.notes;
    let target;

    try {
      target = event.nativeEvent.path[1].dataset.index;
    } catch (e) {}

    if (!target && !this.state.shiftKey) {
      console.log('deselecting all notes');
      notes.forEach(note => {
        note.selected = false;
        note.editing = false;
        note.editable = false;
      });
    }

    this.setState({
      notes,
      movingNotes: false,
    });
  }

  giveUserSave() {
    console.log(this.state);
    copyToClipboard(JSON.stringify(this.state));
  }

  getUserSave() {
    const state = prompt("Please enter your name:", "");
    let stateObject;
    try {
      stateObject = JSON.parse(state);

      if (stateObject) {
        // console.log(stateObject);
        this.setState(stateObject);
      }
    } catch (e) {
      console.log(e);
      alert(e)
    }
  }

    // console.log(event);

    // const shiftDown = (event.keyCode === 16);
    //
    // console.log(shiftDown);
    //
    // this.setState({
    //   ...this.state,
    //   event
    // });
  // }

  startSelectBox(event) {
    console.log('selection box visible');

    if(!event.nativeEvent.path[1].dataset.index){
      this.setState({
        selectionBox: {
          visible: true,
          startX: event.clientX,
          startY: event.clientY,
          currentX: event.clientX,
          currentY: event.clientY,
          style: {},
        }
      });
    } else {
      this.setState({
        movingNotes: true,
      });
    }
  }

  drawSelectBox(event) {
    const selectionBox = this.state.selectionBox;
    if (selectionBox.visible) {

      selectionBox.currentX = event.clientX;
      selectionBox.currentY = event.clientY;

      if (selectionBox.startX < selectionBox.currentX) {
        selectionBox.style.left = selectionBox.startX;
        selectionBox.style.width = selectionBox.currentX - selectionBox.startX;
      } else {
        selectionBox.style.left = selectionBox.currentX;
        selectionBox.style.width = selectionBox.startX - selectionBox.currentX;
      }

      if (selectionBox.startY < selectionBox.currentY) {
        selectionBox.style.top = selectionBox.startY;
        selectionBox.style.height = selectionBox.currentY - selectionBox.startY;
      } else {
        selectionBox.style.top = selectionBox.currentY;
        selectionBox.style.height = selectionBox.startY - selectionBox.currentY;
      }

      this.setState({
          selectionBox
      });
    }
  }

  endSelectionBox(event) {
    console.log('selection box invisitble');

    let selectionBox = this.state.selectionBox;

    const notes = this.state.notes;

    notes.forEach(note => {
      if (
        note.style.left > selectionBox.style.left &&
        note.style.top > selectionBox.style.top &&
        note.style.left + 200 < selectionBox.style.left + selectionBox.style.width &&
        note.style.top + 200 < selectionBox.style.top + selectionBox.style.height
      ) {
        console.log('note inside');
        note.selected = true;
        note.movable = true;
      }
    });

    selectionBox = {
      visible: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      style: {},
    }

    this.setState({
      notes,
      selectionBox
    });
  }

  render() {
    return (
      <div className='main'
        onMouseMove={(event) => this.moveNote(event)}
        onMouseUp={() => this.releaseNote()} >
        <div className='menu'>
          <button onClick={() => this.createNote()} className='createNote' title='create note'>
            create note
          </button>
          <button onClick={() => this.giveUserSave()}>
            Save
          </button>
          <button onClick={() => this.getUserSave()}>
            Load
          </button>
        </div>
        <NotesArea
          notes={this.state.notes}
          className='NotesArea'
          updateNote={(event, index) => this.updateNote(event, index)}
          selectNote={(event, index) => this.selectNote(event, index)}
          editNote={(event, index) => this.editNote(event, index)}
          deselectNote={(event) => this.deselectNote(event)}
          startSelectBox = {(event) => this.startSelectBox(event)}
          drawSelectBox = {(event) => this.drawSelectBox(event)}
          endSelectionBox = {(event) => this.endSelectionBox(event)}
          selectionBox = {this.state.selectionBox}
        ></NotesArea>

      </div>
    );
  }
}

export default App;
