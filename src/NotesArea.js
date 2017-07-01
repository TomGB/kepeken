import React from 'react';
import ContentEditable from 'react-contenteditable';

export default function NotesArea({setState, state, updateNote, selectNote, editNote, deselectNote, startSelectBox, endSelectionBox, drawSelectBox, selectionBox}) {
  return (
    <div
      className='noteContainer'
      onMouseDown={(event) => startSelectBox(event)}
      onTouchStart={(event) => startSelectBox(event)}
      onMouseUp={(event) => {
        deselectNote(event)
        endSelectionBox(event)
      }}
      onTouchEnd={(event) => {
        deselectNote(event)
        endSelectionBox(event)
      }}
      onTouchMove={(event) => drawSelectBox(event)}
      onMouseMove={(event) => drawSelectBox(event)}
    >
      {state.notes.map((note, index) =>
        <div
          className={`note${note.selected?' selected':''}`}
          data-index={index}
          key={index}
          onMouseDown={(event) => selectNote(event, index)}
          onTouchStart={(event) => selectNote(event, index)}
          onDoubleClick={(event) => editNote(event, index)}
          style={note.style} >
          <ContentEditable
            className='noteText'
            html={note.content}
            disabled={!note.editable && !note.editing}
            onChange={(event) => updateNote(event, index)}
          />
        </div>
      )}
      <div className={`selection-box${selectionBox.visible?'':' invisible'}`} style={selectionBox.style}>
      </div>
    </div>
  )
}
