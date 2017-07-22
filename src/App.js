import React, { Component } from 'react';
import NotesArea from './NotesArea';
import './App.css';
import addKeyEventListeners from './helpers/key-listeners'
import addWindowLeaveMessage from './helpers/leave-message'
import { addZoomEventListener, resetZoom } from './helpers/zoom'
import { saveState, loadState } from './helpers/save-and-load'
import SelectBox from './helpers/select-box'
import NoteEvents from './helpers/note-events'
import { resetPan } from './helpers/pan'

require('dotenv').config();

class App extends Component {
  constructor() {
    super();
    this.state = {
      notes: [],
      stepNumber: 0,
      selectionBox: {
        visible: false,
        style: {},
      },
      zoom: 1,
      shiftKey: false,
      panLocation: {
        active: false,
        currentX: 0,
        currentY: 0,
      }
    };

    addWindowLeaveMessage(this);
    addZoomEventListener(this);
    addKeyEventListeners(this);
  }

  render() {
    return (
      <div className='main'
        onMouseMove={(event) => NoteEvents.moveNote(this, event)}
        onTouchMove={(event) => NoteEvents.moveNote(this, event)}
        onMouseUp={() => NoteEvents.releaseNote(this)}
        onTouchEnd={() => NoteEvents.releaseNote(this)} >
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
          <button onClick={() => {
            resetPan(this)
            resetZoom(this)
          }}>
            Reset pan and zoom
          </button>
        </div>
        <NotesArea
          master={this}
          updateNote={(event, index) => NoteEvents.updateNote(this, event, index)}
          selectNote={(event, index) => NoteEvents.selectNote(this, event, index)}
          editNote={(event, index) => NoteEvents.editNote(this, event, index)}
          deselectNote={(event) => NoteEvents.deselectNote(this, event)}
          startSelectBox = {(event) => SelectBox.start(this, event)}
          drawSelectBox = {(event) => SelectBox.draw(this, event)}
          endSelectionBox = {(event) => SelectBox.end(this, event)}
        ></NotesArea>
      </div>
    );
  }
}

export default App;
