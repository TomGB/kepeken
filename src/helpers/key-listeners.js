import {deselectNote} from './note-events'

export default function addKeyEventListeners(master, window = global.window) {
  window.addEventListener("keydown", (e) => {
    if (e.key === 'Shift') {
      master.setState({
        ...master.state,
        shiftKey: true
      });
    };

    if(e.key === 'Escape') {
      deselectNote(master, e);
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
