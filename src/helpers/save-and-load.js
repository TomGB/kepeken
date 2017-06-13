const copyToClipboard = require ('./clipboard.js')

function saveState(master) {
  console.log(master.state);
  copyToClipboard(JSON.stringify(master.state));
}

function loadState(master) {
  const state = prompt("Please enter the json:", "");

  let stateObject;
  try {
    stateObject = JSON.parse(state);

    if (stateObject) {
      master.setState(stateObject);
    }
  } catch (e) {
    console.log(e);
    alert(e)
  }
}

module.exports = {
  saveState,
  loadState
}
