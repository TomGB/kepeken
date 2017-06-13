export default function addKeyEventListeners(master) {
  window.addEventListener("keydown", (e) => {
    if (e.key === 'Shift') {
      master.setState({
        ...master.state,
        shiftKey: true
      });
    };

    if(e.key === 'Escape') {
      master.deselectNote(e);
    }
  }, false);

  window.addEventListener("keyup", (e) => {
    if (e.key === 'Shift') {
      master.setState({
        ...master.state,
        shiftKey: false
      });
    };
  }, false);
}
