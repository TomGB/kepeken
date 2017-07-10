function createNote(master) {
  const notes = master.state.notes;

  notes.push({
    style: { top: 100 - master.state.panLocation.currentY, left: 100 - master.state.panLocation.currentX, height: 130, width: 230 },
    content: ''
  });

  master.setState({
    notes
  });
}

function updateNote (master, event, index) {
  // event.preventDefault();
  const notes = master.state.notes;

  notes[index].content = event.target.value;

  master.setState({
    notes
  });
}

function selectNote (master, event, i) {
  // event.preventDefault();
  const notes = master.state.notes;

  if (!notes[i].selected && !event.shiftKey) {
    notes.forEach(note => {
      note.selected = false;
      note.movable = false;
    });
  }

  notes[i].selected = true;
  notes[i].movable = true;

  master.setState({
    movingNotes: true,
    notes
  });
}

function getNotesToMove(notes) {
  const notesToMove = [];
  notes.forEach(note => {
    if(note.movable && !note.editing) {
      notesToMove.push(note);
    }
  });

  return notesToMove;
}

function moveNote (master, event, index) {
  // event.preventDefault();

  if (!event.buttons && !event.touches) {
    this.releaseNote(master);
  } else {
    const notes = master.state.notes;

    if (master.state.movingNotes) {
      const notesToMove = getNotesToMove(notes);

      let x, y;

      if(event.touches && !event.touches[1]){
        x = event.touches[0].pageX * (1 / master.state.zoom);
        y = event.touches[0].pageY * (1 / master.state.zoom);
      } else {
        x = event.pageX * (1 / master.state.zoom);
        y = event.pageY * (1 / master.state.zoom);
      }

      if (notesToMove.length) {
        notesToMove.forEach( note => {
          if (note.oldX) {
            const diffX = x - note.oldX;
            const diffY = y - note.oldY;

            note.style.left = note.style.left + diffX;
            note.style.top = note.style.top + diffY;

            note.oldX = x;
            note.oldY = y;
          } else {
            note.oldX = x;
            note.oldY = y;
          }

          master.setState({
            notes
          });
        });
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
  // event.preventDefault();

  const notes = master.state.notes;

  if (i !== null) {
    notes.forEach(note => {
      note.editing = false;
    });

    notes[i].editing = true;

    event.target.closest('.note').children[0].focus();

    master.setState({
      notes,
      loading: false
    });
  }
}

function deselectNote (master, event) {
  // event.preventDefault();

  const notes = master.state.notes;
  let target = event.target.closest('.note');

  target = target && target.dataset.index;

  let currentTime;

  if (target === master.state.doubleTapTarget) {
    currentTime = new Date().getTime();
    const tapLength = currentTime - master.state.lastTap;

    if (tapLength < 500 && tapLength > 0) {
      this.editNote(master, event, target);
    }
  }

  let currentNoteSelected;

  if (target !== null) {
    currentNoteSelected  = notes[target].selected;
  }

  if (!currentNoteSelected && !master.state.shiftKey) {
    notes.forEach((note, index) => {
      if (index !== target) {
        note.selected = false;
        note.editing = false;
        note.editable = false;
      }
    });
  }

  master.setState({
    notes,
    movingNotes: false,
    lastTap: currentTime,
    doubleTapTarget: target
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
  getNotesToMove
}
