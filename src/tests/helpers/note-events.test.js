import React from 'react';
import ReactDOM from 'react-dom';
import App from '../../App';
import * as NoteEvents from '../../helpers/note-events';
import assert from 'assert';
import {mount, render, shallow} from 'enzyme'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

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
          content: '',
          style: {
            left: 100,
            top:100,
            width: 350,
            height: 200
          }
        }, {
          content: '',
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

        const event = {
          buttons: 1
        }

        const index = 2;

        NoteEvents.moveNote(master, event, index);

        assert.equal(setState, undefined);
      });

      it('moves a single selected note', () => {
        let setState;

        const master = {
          setState: (input) => {setState = input},
          state: {
            movingNotes: true,
            notes: [{
              movable: true,
              editing: false,
              oldX: 150,
              oldY: 200,
              style: {
                left: 100,
                top: 150
              }
            },
            {
              movable: false,
              editing: false,
              oldX: 100,
              oldY: 150,
              style: {
                left: 100,
                top: 150
              }
            }]
          }
        };

        const event = {
          buttons: 1,
          pageX: 200,
          pageY: 300
        }

        const index = 2;

        NoteEvents.moveNote(master, event, index);

        assert.equal(setState.notes[0].style.left, 150);
        assert.equal(setState.notes[0].style.top, 250);
        assert.equal(setState.notes[0].oldX, 200);
        assert.equal(setState.notes[0].oldY, 300);

        assert.equal(setState.notes[1].style.left, 100);
        assert.equal(setState.notes[1].style.top, 150);
        assert.equal(setState.notes[1].oldX, 100);
        assert.equal(setState.notes[1].oldY, 150);
      });

      it('moves a multiple selected notes', () => {
        let setState;

        const master = {
          setState: (input) => {setState = input},
          state: {
            movingNotes: true,
            notes: [{
              movable: true,
              editing: false,
              oldX: 150,
              oldY: 200,
              style: {
                left: 100,
                top: 150
              }
            },
            {
              movable: true,
              editing: false,
              oldX: 100,
              oldY: 150,
              style: {
                left: 100,
                top: 150
              }
            }]
          }
        };

        const event = {
          buttons: 1,
          pageX: 200,
          pageY: 300
        }

        const index = 2;

        NoteEvents.moveNote(master, event, index);

        assert.equal(setState.notes[0].style.left, 150);
        assert.equal(setState.notes[0].style.top, 250);
        assert.equal(setState.notes[0].oldX, 200);
        assert.equal(setState.notes[0].oldY, 300);

        assert.equal(setState.notes[1].style.left, 200);
        assert.equal(setState.notes[1].style.top, 300);
        assert.equal(setState.notes[1].oldX, 200);
        assert.equal(setState.notes[1].oldY, 300);
      });

      it('releases note if mouse button released', () => {
        let releaseCalled = false;

        const MockNoteEvents = {
          ...NoteEvents,
          releaseNote: () => {
            releaseCalled = true;
          }
        }

        const event = {
          buttons: 0
        }

        MockNoteEvents.moveNote({}, event);

        assert(releaseCalled)
      });
    });

    describe('releaseNote', () =>{
      it('sets movable to false when notes are not selected', () => {
        let setState;

        const master = {
          setState: (input) => {setState = input},
          state: {
            movingNotes: true,
            notes: [{
              selected: false,
              movable: true,
              editing: false,
              oldX: 150,
              oldY: 200,
              style: {
                left: 100,
                top: 150
              }
            },
            {
              selected: true,
              movable: true,
              editing: false,
              oldX: 100,
              oldY: 150,
              style: {
                left: 100,
                top: 150
              }
            }]
          }
        };

        NoteEvents.releaseNote(master);

        assert.equal(setState.notes[0].movable, false);
        assert.equal(setState.notes[1].movable, true);
      });

      it('sets X and Y to null', () => {
        let setState;

        const master = {
          setState: (input) => {setState = input},
          state: {
            movingNotes: true,
            notes: [{
              selected: false,
              movable: true,
              editing: false,
              oldX: 150,
              oldY: 200,
              style: {
                left: 100,
                top: 150
              }
            },
            {
              selected: true,
              movable: true,
              editing: false,
              oldX: 100,
              oldY: 150,
              style: {
                left: 100,
                top: 150
              }
            }]
          }
        };

        NoteEvents.releaseNote(master);

        assert.equal(setState.notes[0].oldX, null);
        assert.equal(setState.notes[0].oldY, null);
        assert.equal(setState.notes[1].oldX, null);
        assert.equal(setState.notes[1].oldY, null);
      });
    });

    describe('editNote', () => {
      let setState;

      const master = {
        setState: (input) => {setState = input},
        state: {
          movingNotes: true,
          notes: [{
            editing: false,
          },
          {
            editing: true,
          },
          {
            editing: false,
          }]
        }
      };

      let focus = null;

      const event = {
        target: {
          closest: () => {
            return {
              children: [{
                focus: () => {
                  focus = true;
                }
              }]
            };
          }
        }
      }

      it ('sets note to editing', () => {
        const index = 0;

        NoteEvents.editNote(master, event, index);

        assert(setState.notes[0].editing);
      });

      it ('sets other notes to not editing', () => {
        const index = 0;

        NoteEvents.editNote(master, event, index);

        assert(setState.notes[0].editing);
        assert(!setState.notes[1].editing);
        assert(!setState.notes[2].editing);
      });

      it ('sets focus on note', () => {
        focus = null;

        const index = 0;

        NoteEvents.editNote(master, event, index);

        assert(focus);
      });
    });

    describe('deselectNote', () => {
      it('deselects all notes', () => {
        let setState;

        const master = {
          setState: (input) => {setState = input},
          state: {
            notes: [{
              selected: true,
              editing: true,
              editable: true,
            }, {
              selected: true,
              editing: false,
              editable: true,
            }, {
              selected: true,
              editing: false,
              editable: true,
            }]
          }
        };

        const event = {
          target: {
            closest: () => {
              return null;
            }
          }
        }

        NoteEvents.deselectNote(master, event);

        setState.notes.forEach(note => {
          assert(!note.selected)
          assert(!note.editing)
          assert(!note.editable)
        });
      });

      it('doesn\'t deselects notes if shift is held', () => {
        let setState;

        const master = {
          setState: (input) => {setState = input},
          state: {
            notes: [{
              selected: true,
              editing: true,
              editable: true,
            }, {
              selected: true,
              editing: false,
              editable: true,
            }, {
              selected: true,
              editing: false,
              editable: true,
            }],
            shiftKey: true,
          }
        };

        const event = {
          target: {
            closest: () => {
              return null;
            }
          }
        }

        NoteEvents.deselectNote(master, event);

        setState.notes.forEach((note, index) => {
          assert(note.selected);
        });
      });

      it('doesn\'t deselects notes if mouseup was on a selected note', () => {
        let setState;

        const master = {
          setState: (input) => {setState = input},
          state: {
            notes: [{
              selected: true,
              editing: true,
              editable: true,
            }, {
              selected: true,
              editing: false,
              editable: true,
            }, {
              selected: true,
              editing: false,
              editable: true,
            }]
          }
        };

        const event = {
          target: {
            closest: () => {
              return {
                dataset: {
                  index: 0
                }
              };
            }
          }
        }

        NoteEvents.deselectNote(master, event);

        setState.notes.forEach((note, index) => {
          assert(note.selected);
        });
      });

      it('sets not editing and not selected on all notes but the target note', () => {
        let setState;

        const master = {
          setState: (input) => {setState = input},
          state: {
            notes: [{
              selected: false,
              editing: true,
              editable: true,
            }, {
              selected: true,
              editing: false,
              editable: true,
            }, {
              selected: true,
              editing: false,
              editable: true,
            }]
          }
        };

        const event = {
          target: {
            closest: () => {
              return {
                dataset: {
                  index: 0
                }
              };
            }
          }
        }

        NoteEvents.deselectNote(master, event);

        assert(!setState.notes[0].selected);
        assert(setState.notes[0].editing);
        assert(setState.notes[0].editable);
        assert(!setState.notes[1].selected);
        assert(!setState.notes[1].editing);
        assert(!setState.notes[1].editable);
        assert(!setState.notes[2].selected);
        assert(!setState.notes[2].editing);
        assert(!setState.notes[2].editable);
      });

      it('sets doubleTapTarget', () => {
        let setState;

        const master = {
          setState: (input) => {setState = input},
          state: {
            notes: [{
              selected: false,
              editing: true,
              editable: true,
            }]
          }
        };

        const event = {
          target: {
            closest: () => {
              return {
                dataset: {
                  index: 0
                }
              };
            }
          }
        }

        NoteEvents.deselectNote(master, event);

        assert(!setState.movingNotes);
        assert(!setState.lastTap);
        assert.equal(setState.doubleTapTarget, 0);
      });

      it('if click on double tap target set lastTap time', () => {
        let setState;

        const master = {
          setState: (input) => {setState = input},
          state: {
            notes: [{
              selected: false,
              editing: true,
              editable: true,
            }],
            doubleTapTarget: 0
          }
        };

        const event = {
          target: {
            closest: () => {
              return {
                dataset: {
                  index: 0
                }
              };
            }
          }
        }

        var clock = sinon.useFakeTimers();

        NoteEvents.deselectNote(master, event);

        const currentTime = new Date().getTime();

        assert.equal(setState.lastTap, currentTime);
      });

      it('if tap was less than 500ms long then call edit note', () => {
        let setState;

        const currentTime = new Date().getTime();

        const master = {
          setState: (input) => {setState = input},
          state: {
            notes: [{
              selected: false,
              editing: true,
              editable: true,
            }],
            doubleTapTarget: 0,
            lastTap: currentTime - 400
          }
        };

        const event = {
          target: {
            closest: () => {
              return {
                dataset: {
                  index: 0
                }
              };
            }
          }
        }

        let editNoteCalled = false;

        const MockNoteEvents = {
          deselectNote: NoteEvents.deselectNote,
          editNote: () => {
            editNoteCalled = true;
          }
        }

        MockNoteEvents.deselectNote(master, event);

        assert(editNoteCalled)
      });
    });
  });
});
