import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import SelectBox from './helpers/select-box';
import assert from 'assert';
import {mount, render, shallow} from 'enzyme'

it('SelectBox start sets mouse position', () => {

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

  assert.deepEqual(setState, expectedState);
});

it('SelectBox end selects notes', () => {

  let setState;

  const master = {
    setState: (input) => {setState = input},
    state: {
      selectionBox: {
        style: {
          left: 100,
          top: 100,
          width: 500,
          height: 500,
        }
      },
      notes: [{
        style: {
          left: 100,
          top:100,
          width: 100,
          height: 100
        }
      }],
    }
  }

  const event = {
    preventDefault: () => {},
  }

  SelectBox.end(master, event)

  const expectedState = {
    selectionBox: {
      visible: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      style: {},
    },
    notes: [{
      selected: true,
      movable: true,
      ...master.state.notes[0],
    }],

  }

  assert.deepEqual(setState, expectedState);
});

it('SelectBox end selects only notes inside', () => {

  let setState;

  const master = {
    setState: (input) => {setState = input},
    state: {
      selectionBox: {
        style: {
          left: 100,
          top: 100,
          width: 500,
          height: 500,
        }
      },
      notes: [{
        style: {
          left: 80, //outside
          top:110,
          width: 100,
          height: 100
        }
      },
      {
        style: {
          left: 100,
          top:80, //outside
          width: 100,
          height: 100
        }
      },
      {
        style: {
          left: 100,
          top:100,
          width: 100,
          height: 100
        }
      }],
    }
  }

  const event = {
    preventDefault: () => {},
  }

  SelectBox.end(master, event)

  const expectedState = {
    selectionBox: {
      visible: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      style: {},
    },
    notes: [{
      ...master.state.notes[0]
    },{
      ...master.state.notes[1]
    },{
      selected: true,
      movable: true,
      ...master.state.notes[2],
    }],

  }

  assert.deepEqual(setState, expectedState);
});
