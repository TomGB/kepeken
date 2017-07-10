function isClickOnNote(event) {
  return (
    event.target.dataset.index ||
    event.target.parentNode.dataset.index ||
    event.target.parentNode.parentNode.dataset.index
  );
}

function start(master, event) {
  // event.preventDefault();

  if (master.state.shiftKey) {
    let x, y;

    if(event.touches && !event.touches[1]){
      x = event.touches[0].pageX * (1 / master.state.zoom);
      y = event.touches[0].pageY * (1 / master.state.zoom);
    } else {
      x = event.pageX * (1 / master.state.zoom);
      y = event.pageY * (1 / master.state.zoom);
    }

    if (event.button === 0 || event.button === undefined) {
      if(!isClickOnNote(event)){
        master.setState({
          selectionBox: {
            visible: true,
            startX: x,
            startY: y,
            currentX: x,
            currentY: y,
            style: {},
          }
        });
      }
    }
  }
}

function draw(master, event) {
  // event.preventDefault()

  if (master.state.shiftKey) {
    if (!event.buttons && !event.touches) {
      this.end(master, event);
    } else {
      let x, y;

      if (event.touches && !event.touches[1]) {
        x = event.touches[0].pageX * (1 / master.state.zoom);
        y = event.touches[0].pageY * (1 / master.state.zoom);
      } else {
        x = event.pageX * (1 / master.state.zoom);
        y = event.pageY * (1 / master.state.zoom);
      }

      const selectionBox = master.state.selectionBox;
      if (selectionBox.visible) {

        selectionBox.currentX = x;
        selectionBox.currentY = y;

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
  }
}

function end(master, event) {
  // event.preventDefault();

  let selectionBox = master.state.selectionBox;

  const notes = master.state.notes;

  notes.forEach(note => {
    if (
      note.style.left + master.state.panLocation.currentX >= selectionBox.style.left &&
      note.style.top + master.state.panLocation.currentY >= selectionBox.style.top &&
      note.style.left + master.state.panLocation.currentX + note.style.width < selectionBox.style.left + selectionBox.style.width &&
      note.style.top + master.state.panLocation.currentY + note.style.height < selectionBox.style.top + selectionBox.style.height
    ) {
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
