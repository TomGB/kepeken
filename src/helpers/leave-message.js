export default function addWindowLeaveMessage(master, window = global.window) {
  window.onbeforeunload = function() {
    if(master.state.notes.length){
      return "Are syou sure you want to leave?";
    }
  }
}
