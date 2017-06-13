function createNote(master) {
  const notes = master.state.notes;

  notes.push({ style: { top: 100, left: 100 } });

  master.setState({
    notes
  });
}

function updateNote (master, event, index) {
  const notes = master.state.notes;

  console.log(index);

  notes[index].content = event.target.value;

  master.setState({
    notes
  });
}

function selectNote (master, event, i) {
  const notes = master.state.notes;

  if (!event.shiftKey) {
    notes.forEach(note => {
      note.selected = false;
      note.movable = false;
    });
  }

  notes[i].selected = true;
  notes[i].movable = true;

  master.setState({
    notes
  });
}

function moveNote (master, event, index) {
  const notes = master.state.notes;

  if (master.state.movingNotes) {

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

          master.setState({
            notes
          });
        });
      } else {
        master.releaseNote();
      }
    }
  }

}

function releaseNote (master) {
  const notes = master.state.notes;

  notes.forEach(note => {
    if(!note.selected){
      note.movable = false;
    }

    note.oldX = null;
    note.oldY = null;
  });

  master.setState({
    notes
  });
}

function editNote (master, event, i) {
  const notes = master.state.notes;
  notes[i].editing = true;

  master.setState({
    notes
  });
}

function deselectNote (master, event) {
  const notes = master.state.notes;
  let target;

  try {
    target = event.nativeEvent.path[1].dataset.index;
  } catch (e) {}

  if (!target && !master.state.shiftKey) {
    console.log('deselecting all notes');
    notes.forEach(note => {
      note.selected = false;
      note.editing = false;
      note.editable = false;
    });
  }

  master.setState({
    notes,
    movingNotes: false,
  });
}

module.exports = {
  deselectNote,
  editNote,
  releaseNote,
  moveNote,
  selectNote,
  updateNote,
  createNote,
}
