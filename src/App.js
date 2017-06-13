import React, { Component } from 'react';
import NotesArea from './notes-area';
import './App.css';
import addKeyEventListeners from './helpers/key-listeners'
import { saveState, loadState } from './helpers/save-and-load'
import SelectBox from './helpers/select-box'
import NoteEvents from './helpers/note-events.js'

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

    addKeyEventListeners(this);
  }

  render() {
    return (
      <div className='main'
        onMouseMove={(event) => NoteEvents.moveNote(this, event)}
        onMouseUp={() => NoteEvents.releaseNote(this)} >
        <div className='menu'>
          <button onClick={() => NoteEvents.createNote(this)} className='createNote' title='create note'>
            create note
          </button>
          <button onClick={() => saveState(this)}>
            Save
          </button>
          <button onClick={() => loadState(this)}>
            Load
          </button>
        </div>
        <NotesArea
          notes={this.state.notes}
          className='NotesArea'
          updateNote={(event, index) => NoteEvents.updateNote(this, event, index)}
          selectNote={(event, index) => NoteEvents.selectNote(this, event, index)}
          editNote={(event, index) => NoteEvents.editNote(this, event, index)}
          deselectNote={(event) => NoteEvents.deselectNote(this, event)}
          startSelectBox = {(event) => SelectBox.start(this, event)}
          drawSelectBox = {(event) => SelectBox.draw(this, event)}
          endSelectionBox = {(event) => SelectBox.end(this, event)}
          selectionBox = {this.state.selectionBox}
        ></NotesArea>

      </div>
    );
  }
}

export default App;
