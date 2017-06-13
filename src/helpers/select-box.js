function start(master, event) {
  console.log('selection box visible');

  if(!event.nativeEvent.path[1].dataset.index){
    master.setState({
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
    master.setState({
      movingNotes: true,
    });
  }
}

function draw(master, event) {
  const selectionBox = master.state.selectionBox;
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

    master.setState({
        selectionBox
    });
  }
}

function end(master, event) {
  console.log('selection box invisitble');

  let selectionBox = master.state.selectionBox;

  const notes = master.state.notes;

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

  master.setState({
    notes,
    selectionBox
  });
}

module.exports = {
  start,
  draw,
  end,
}
