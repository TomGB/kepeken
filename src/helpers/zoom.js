function addZoomEventListener(master) {
  console.log('adding zoom handler');
  window.onwheel = (e) => {
    e.preventDefault();
    let newZoom = master.state.zoom + master.state.zoom * 0.005 * -e.deltaY;

    newZoom = newZoom < 0.2 ? 0.2 : newZoom;
    newZoom = newZoom > 2 ? 2 : newZoom;

    master.setState({
      zoom: newZoom,
    });
  };
  // window.addEventListener('onwheel', (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   e.cancelBubble = true;
  //   console.log('scroll',e);
    // master.setState({
    //   zoom: 0.5
    // });

  //   return false;
  // });
}

function resetZoom(master) {
  master.setState({
    zoom: 1,
  })
}

export {
  addZoomEventListener,
  resetZoom
}
