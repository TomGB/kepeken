import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

function copyToClipboard(text) {
  window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
}

function NotesArea({notes, updateNote, selectNote, editNote, deselectNote}) {
  return (
    <div className='noteContainer' onClick={(event) => deselectNote(event)}>
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
            onClick={(event) => editNote(event, index)} >
          </textarea>
        </div>
      )}
    </div>
  )
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      notes: [],
      stepNumber: 0,
    };

    window.addEventListener("keydown",
      (e) => {
          if (e.key === 'Shift') {
            this.setState({
              ...this.state,
              shiftKey: true
            });
          };
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
  //   console.log(this.state);
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

    const note = (() => {
      for (var i = 0; i < notes.length; i++) {
        if (notes[i].movable) {
          return notes[i];
        }
      }

      return false;
    })();

    if(note && !note.editing) {
      if(event.buttons){
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
      } else {
        this.releaseNote();
      }

      this.setState({
        notes
      });
    }
  }

  releaseNote () {
    const notes = this.state.notes;

    notes.forEach(note => {
      note.movable = false;
      note.oldX = null;
      note.oldY = null;
    });

    this.setState({
      notes
    });
  }

  editNote (event, i) {
    const notes = this.state.notes;

    if (!notes[i].editing && notes[i].editable) {
      notes[i].editing = true;

      console.log('editing');
    }

    if (!notes[i].editing && !notes[i].editable) {
      notes[i].editable = true;

      console.log('editable');

      setTimeout(() => {
        notes[i].editable = false;
        console.log('not editable');
      }, 500);
    }
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
      notes
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
        />
      </div>
    );
  }
}

export default App;
