import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import SelectBox from './helpers/select-box';
import assert from 'assert';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

it('SelectBox start runs', () => {

  let setState;

  const master = {
    setState: (input) => {setState = input}
  }

  const event = {
    preventDefault: () => {},
    button: 0,
    target: { parentNode: { dataset: { index: null } } },
    pageX: 10,
    pageY: 20
  }

  SelectBox.start(master, event)

  const expectedState = {
    selectionBox: {
      currentX: 10,
      currentY: 20,
      startX: 10,
      startY: 20,
      style: {},
      visible: true
    }
  }

  assert.deepEqual(setState, expectedState)
});
