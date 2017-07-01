const { copyToClipboard } = require ('./clipboard.js');

function saveState(master) {
  console.log('saving', master.state);
  copyToClipboard(JSON.stringify(master.state));
}

function loadState(master, userPrompt = prompt) {
  const state = userPrompt("Please enter the json:", "");

  let stateObject;
  try {
    stateObject = {
      ...JSON.parse(state),
      loading: true
    };

    if (stateObject) {
      console.log('loaded', stateObject);
      master.setState(stateObject);
    }
  } catch (e) {
    alert(JSON.stringify(e));
  }
}

module.exports = {
  saveState,
  loadState
}
