import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

function NotesArea({notes, updateNote, selectNote, editNote, deselectNote}) {
  return (
    <div className='noteContainer'>
      {notes.map((note, index) =>
        <div
          className='note'
          key={index}
          onMouseDown={() => selectNote(index)}
          style={note.style} >
          <textarea
            className='noteText'
            onChange={(event) => updateNote(event, index)}
            readOnly={!(note.editable || note.editing)}
            onClick={(event) => editNote(event, index)}
            onBlur={() => deselectNote(index)}>
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
      history: [
        {
          notes: []
        }
      ],
      stepNumber: 0,
    };
  }

  createNote() {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const notes = current.notes.slice();

    notes.push({ style: { top: 10, left: 10 } });

    this.setState({
      history: history.concat([
        {
          notes: notes,
        }
      ]),
      stepNumber: history.length,
    });
  }

  updateNote (event, index) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const notes = current.notes.slice();

    console.log(index);

    notes[index].content = event.target.value;

    this.setState({
      history: history.concat([
        {
          notes: notes,
        }
      ]),
      stepNumber: history.length,
    });
  }

  selectNote (i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const notes = current.notes.slice();

    notes[i].selected = true;

    this.setState({
      history: history.concat([
        {
          notes: notes,
        }
      ]),
      stepNumber: history.length,
    });
  }

  moveNote (event, index) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const notes = current.notes.slice();

    const note = (() => {
      for (var i = 0; i < notes.length; i++) {
        if (notes[i].selected) {
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
        history: history.concat([
          {
            notes: notes,
          }
        ]),
        stepNumber: history.length,
      });
    }
  }

  releaseNote () {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const notes = current.notes.slice();

    notes.forEach(note => {
      note.selected = false;
      note.oldX = null;
      note.oldY = null;
    });
  }

  editNote (event, i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const notes = current.notes.slice();

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

  deselectNote (i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const notes = current.notes.slice();

    notes[i].editing = false;
    notes[i].editable = false;

    console.log('deselect');
  }

  render() {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];

    return (
      <div className='main' onMouseMove={(event) => this.moveNote(event)} onMouseUp={() => this.releaseNote()}>
        <div className='menu'>
          <button onClick={() => this.createNote()} className='createNote' title='create note'>
            create note
          </button>
        </div>
        <NotesArea
          notes={current.notes}
          className='NotesArea'
          updateNote={(event, index) => this.updateNote(event, index)}
          selectNote={(index) => this.selectNote(index)}
          editNote={(event, index) => this.editNote(event, index)}
          deselectNote={(index) => this.deselectNote(index)}
        />
      </div>
    );
  }
}

export default App;
