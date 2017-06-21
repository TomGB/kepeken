import React from 'react';
import ReactDOM from 'react-dom';
import App from '../../App';
import NoteEvents from '../../helpers/note-events';
import assert from 'assert';
import {mount, render, shallow} from 'enzyme'

describe('NoteEvents', () => {
  describe('createNote', () => {
    it('places a note in the default location', () => {

      let setState;

      const master = {
        setState: (input) => {setState = input},
        state: {
          notes: []
        }
      }

      NoteEvents.createNote(master);
      NoteEvents.createNote(master);

      const expectedState = {
        notes: [{
          style: {
            left: 100,
            top:100,
            width: 350,
            height: 200
          }
        }, {
          style: {
            left: 100,
            top:100,
            width: 350,
            height: 200
          }
        }]
      }

      assert.deepEqual(setState, expectedState);
    });
  });

  describe('updateNote', () => {
    it('sets the content', () => {

      let setState;

      const master = {
        setState: (input) => {setState = input},
        state: {
          notes: [{}, {}]
        }
      }

      const event = {
        preventDefault: () => {},
        target: {
          value: 'banana'
        }
      }

      const index = 0;

      NoteEvents.updateNote(master, event, index)

      const expectedState = {
        notes: [
          {
            content: 'banana'
          },
          {}
        ],
      };

      assert.deepEqual(setState, expectedState);

      const eventTwo = {
        preventDefault: () => {},
        target: {
          value: 'apple'
        }
      }

      const indexTwo = 1;

      NoteEvents.updateNote(master, eventTwo, indexTwo)

      const expectedStateTwo = {
        notes: [
          {
            content: 'banana'
          },
          {
            content: 'apple'
          }
        ],
      }

      assert.deepEqual(setState, expectedStateTwo);
    });

    describe('selectNote', () => {
      it('deselects other notes and selects current note', () => {
        let setState;

        const master = {
          setState: (input) => {setState = input},
          state: {
            notes: [{
              selected:true,
              movable: true
            },
            {
              selected:true,
              movable: true
            },
            {
              selected:false
            }]
          }
        };

        const event = {
          shiftKey: false
        }

        const index = 2;

        NoteEvents.selectNote(master, event, index);

        const expectedState = {
          movingNotes: true,
          notes: [{
            selected:false,
            movable: false
          },
          {
            selected:false,
            movable: false
          },
          {
            selected:true,
            movable: true
          }]
        };

        assert.deepEqual(setState, expectedState)
      });

      it('doesn\'t deselect notes if shift is held', () => {
        let setState;

        const master = {
          setState: (input) => {setState = input},
          state: {
            notes: [{
              selected:true,
              movable: true
            },
            {
              selected:true,
              movable: true
            },
            {
              selected:false
            }]
          }
        };

        const event = {
          shiftKey: true
        }

        const index = 2;

        NoteEvents.selectNote(master, event, index);

        const expectedState = {
          movingNotes: true,
          notes: [{
            selected:true,
            movable: true
          },
          {
            selected:true,
            movable: true
          },
          {
            selected:true,
            movable: true
          }]
        };

        assert.deepEqual(setState, expectedState)
      });

      it('doesn\'t deselect notes if note is already selected', () => {
        let setState;

        const master = {
          setState: (input) => {setState = input},
          state: {
            notes: [{
              selected:true,
              movable: true
            },
            {
              selected:true,
              movable: true
            },
            {
              selected:true
            }]
          }
        };

        const event = {
          shiftKey: false
        }

        const index = 2;

        NoteEvents.selectNote(master, event, index);

        const expectedState = {
          movingNotes: true,
          notes: [{
            selected:true,
            movable: true
          },
          {
            selected:true,
            movable: true
          },
          {
            selected:true,
            movable: true
          }]
        };

        assert.deepEqual(setState, expectedState)
      });
    });

    describe('getNotesToMove', () => {
      it('returns an array of notes that are movable', () => {
        const inputNotes = [
          {
            movable: false,
            editing: false,
            id: 0
          },
          {
            movable: true,
            editing: false,
            id: 1
          },
          {
            movable: false,
            editing: false,
            id: 2
          },
          {
            movable: true,
            editing: false,
            id: 3
          },
        ]

        const notesToMove = NoteEvents.getNotesToMove(inputNotes);

        assert.deepEqual(notesToMove, [{ ...inputNotes[1] }, { ...inputNotes[3] }])
      });
    });
    describe('moveNote', () => {
      it('does nothing if notes not set to moving', () => {
        let setState;

        const master = {
          setState: (input) => {setState = input},
          movingNotes: false,
          state: {
            notes: []
          }
        };

        const event = {}

        const index = 2;

        NoteEvents.moveNote(master, event, index);

        assert.equal(setState, undefined);
      });

      it('does nothing if notes not set to moving', () => {
        let setState;

        const master = {
          setState: (input) => {setState = input},
          movingNotes: false,
          state: {
            notes: []
          }
        };

        const event = {}

        const index = 2;

        NoteEvents.moveNote(master, event, index);

        assert.equal(setState, undefined);
      });
    });
  });
});
