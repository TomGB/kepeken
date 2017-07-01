import addKeyEventListeners from '../../helpers/key-listeners';
import assert from 'assert';
import {deselectNote} from '../../helpers/note-events'
jest.mock('../../helpers/note-events', () => ({
  deselectNote: jest.fn()
}))

describe('keyDown', () => {
  it('is added to window', () => {
    let eventListeners = [];

    let mockWindow = {
      addEventListener: (keyEvent) => {
        eventListeners.push(keyEvent);
      }
    }

    addKeyEventListeners({}, mockWindow);

    assert(eventListeners.includes('keydown'));
  });

  it('sets shift on state', () => {
    const testEvent = {
      key: 'Shift'
    }

    let mockWindow = {
      addEventListener: (keyEvent, callback) => {
        if (keyEvent === 'keydown') {
          callback(testEvent);
        }
      }
    }

    let setState;

    const master = {
      setState: (input) => {setState = input},
      state: {
        foo: 'bar'
      }
    };

    addKeyEventListeners(master, mockWindow);

    assert(setState.shiftKey)
  });

  it('deselects notes on Escape', () => {
    const testEvent = {
      key: 'Escape'
    }

    let mockWindow = {
      addEventListener: (keyEvent, callback) => {
        if (keyEvent === 'keydown') {
          callback(testEvent);
        }
      }
    }

    let setState;

    const master = {
      setState: (input) => {setState = input},
      state: {
        foo: 'bar'
      }
    };

    addKeyEventListeners(master, mockWindow);

    expect(deselectNote).toBeCalled();
  });
});

describe('keyup', () => {
  it('is added to window', () => {
    let eventListeners = [];

    let mockWindow = {
      addEventListener: (keyEvent) => {
        eventListeners.push(keyEvent);
      }
    }

    addKeyEventListeners({}, mockWindow);

    assert(eventListeners.includes('keyup'));
  });

  it('sets shiftkey to false on shift up', () => {
    const testEvent = {
      key: 'Shift'
    }

    let mockWindow = {
      addEventListener: (keyEvent, callback) => {
        if (keyEvent === 'keyup') {
          callback(testEvent);
        }
      }
    }

    let setState;

    const master = {
      setState: (input) => {setState = input},
      state: {
        foo: 'bar',
        shiftKey: true
      }
    };

    addKeyEventListeners(master, mockWindow);

    assert(!setState.shiftKey)
  });
})
