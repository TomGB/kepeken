function start(master, event) {
  event.preventDefault();

  let x, y;

  if(event.touches){
    x = event.touches[0].pageX;
    y = event.touches[0].pageY;
  } else {
    x = event.pageX;
    y = event.pageY;
  }

  if (event.button === 0 || event.button === undefined) {
    if(!event.target.parentNode.dataset.index){
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

function draw(master, event) {
  event.preventDefault();
  let x, y;

  if(event.touches){
    x = event.touches[0].pageX;
    y = event.touches[0].pageY;
  } else {
    x = event.pageX;
    y = event.pageY;
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

function end(master, event) {
  event.preventDefault();

  let selectionBox = master.state.selectionBox;

  const notes = master.state.notes;

  notes.forEach(note => {
    if (
      note.style.left > selectionBox.style.left &&
      note.style.top > selectionBox.style.top &&
      note.style.left + 200 < selectionBox.style.left + selectionBox.style.width &&
      note.style.top + 200 < selectionBox.style.top + selectionBox.style.height
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
