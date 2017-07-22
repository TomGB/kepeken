function isClickOnNote(event) {
  return (
    event.target.dataset.index ||
    event.target.parentNode.dataset.index ||
    event.target.parentNode.parentNode.dataset.index
  );
}

function startPanning(master, event) {
  if (!master.state.shiftKey) {
    console.log('in start pan');

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
        console.log('xy',x,y);
        master.setState({
          panLocation: {
            ...master.state.panLocation,
            active: true,
            lastX: x,
            lastY: y,
          }
        });

        console.log(x, y);
        console.log(master.state.panLocation.lastX, master.state.panLocation.lastY);
      }
    }
  }
}

function movePanning(master, event) {
  if (master.state.panLocation.active && !master.state.shiftKey) {
    console.log('in move pan');

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
        console.log('xy',x, y);
        console.log('start',master.state.panLocation.lastX, master.state.panLocation.lastY);
        console.log('current',master.state.panLocation.currentX, master.state.panLocation.currentY);
        master.setState({
          panLocation: {
            ...master.state.panLocation,
            lastX: x,
            lastY: y,
            currentX: master.state.panLocation.currentX + x - master.state.panLocation.lastX,
            currentY: master.state.panLocation.currentY + y - master.state.panLocation.lastY,
          }
        });

        console.log(master.state.panLocation);

        console.log('now set to:',master.state.panLocation.currentX, master.state.panLocation.currentY);
      }
    }
  }
}

function stopPanning(master, event) {
  console.log('in stop pan');

  master.setState({
    panLocation: {
      ...master.state.panLocation,
      active: false,
    }
  });
}

function resetPan(master) {
  master.setState({
    panLocation: {
      active: false,
      currentX: 0,
      currentY: 0,
    }
  });
}

export {
  startPanning,
  stopPanning,
  movePanning,
  resetPan
}
