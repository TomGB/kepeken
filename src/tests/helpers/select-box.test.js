import React from 'react';
import ReactDOM from 'react-dom';
import App from '../../App';
import SelectBox from '../../helpers/select-box';
import assert from 'assert';

const exampleNotes = [{
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
}];

describe('SelectBox', () => {
  describe('start', () => {
    it('sets mouse position', () => {

      let setState;

      const master = {
        setState: (input) => {setState = input}
      }

      const event = {
        preventDefault: () => {},
        button: 0,
        target: {
          dataset: { index: null },
          parentNode: {
            dataset: { index: null },
            parentNode: {
              dataset: { index: null }
            },
          },
        },
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
  });

  describe('end', () => {
    it('selects notes', () => {

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
          notes: [{ ...exampleNotes[2] }],
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

    it('selects only notes inside', () => {
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
          notes: exampleNotes,
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
  });

  describe('draw', () => {
    it('draws box on mouse move', () => {
      let setState;

      const master = {
        setState: (input) => {setState = input},
        state: {
          selectionBox: {
            style: {
              left: 0,
              top: 0,
              width: 0,
              height: 0,
            },
            startX: 100,
            startY: 100,
            visible: true,
          },
          notes: exampleNotes,
        }
      }

      const event = {
        buttons: 1,
        touches: false,
        pageX: 120,
        pageY: 120,
      }

      SelectBox.draw(master, event);

      const expectedState =  {
        selectionBox: {
          style: {
            left: 100,
            top: 100,
            width: 20,
            height: 20
          },
          startX: 100,
          startY: 100,
          visible: true,
          currentX: 120,
          currentY: 120
         }
       };

      assert.deepEqual(setState, expectedState);
    });

    it('draws box on touch move', () => {
      let setState;

      const master = {
        setState: (input) => {setState = input},
        state: {
          selectionBox: {
            style: {
              left: 0,
              top: 0,
              width: 0,
              height: 0,
            },
            startX: 100,
            startY: 100,
            visible: true,
          },
          notes: exampleNotes,
        }
      }

      const event = {
        buttons: 1,
        touches: [{
          pageX: 120,
          pageY: 120,
        }]
      }

      SelectBox.draw(master, event);

      const expectedState =  {
        selectionBox: {
          style: {
            left: 100,
            top: 100,
            width: 20,
            height: 20
          },
          startX: 100,
          startY: 100,
          visible: true,
          currentX: 120,
          currentY: 120
         }
       };

      assert.deepEqual(setState, expectedState);
    });

    it('does not draw box if it was not already drawing box', () => {
      let setState;

      const master = {
        setState: (input) => {setState = input},
        state: {
          selectionBox: {
            style: {
              left: 0,
              top: 0,
              width: 0,
              height: 0,
            },
            startX: 100,
            startY: 100,
            visible: false,
          },
          notes: exampleNotes,
        }
      }

      const event = {
        buttons: 1,
        touches: [{
          pageX: 120,
          pageY: 120,
        }]
      }

      SelectBox.draw(master, event);

      assert.equal(setState, undefined);
    });

    it('stops drawing if mouse is released', () => {

      const event = {
        buttons: 0
      }

      let endCaleed = false;

      const MockSelectBox = {
        ...SelectBox,
        end: () => {
          endCaleed = true;
        }
      }

      MockSelectBox.draw({}, event);

      assert(endCaleed);
    });
  });
});
