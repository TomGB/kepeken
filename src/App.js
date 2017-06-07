import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

function NotesArea({notes, updateNote}) {
  return (
    <div className='noteContainer'>
      {notes.map((note, index) =>
        <div className='note' key={index}>
          <textarea className='noteText' onChange={(event) => updateNote(event, index)} autoFocus></textarea>
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

    notes.push({});

    this.setState({
      history: history.concat([
        {
          notes: notes,
        }
      ]),
      stepNumber: history.length,
    });
  }

  updateNote(event, index) {
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

  render() {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];

    return (
      <div className='main'>
        <div className='menu'>
          <button onClick={() => this.createNote()} className='createNote' title='create note'>
            create note
          </button>
        </div>
        <NotesArea notes={current.notes} className='NotesArea' updateNote={(event, index) => this.updateNote(event, index)}/>
      </div>
    );
  }
}

export default App;
