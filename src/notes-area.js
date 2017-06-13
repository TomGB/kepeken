import React from 'react';

export default function NotesArea({notes, updateNote, selectNote, editNote, deselectNote, startSelectBox, endSelectionBox, drawSelectBox, selectionBox}) {
  return (
    <div
      className='noteContainer'
      onMouseDown={(event) => startSelectBox(event)}
      onMouseUp={(event) => {
        deselectNote(event)
        endSelectionBox(event)
      }}
      onMouseMove={(event) => drawSelectBox(event)}
    >
      {notes.map((note, index) =>
        <div
          className={`note${note.selected?' selected':''}`}
          data-index={index}
          key={index}
          onMouseDown={(event) => selectNote(event, index)}
          style={note.style} >
          <textarea
            className='noteText'
            onChange={(event) => updateNote(event, index)}
            readOnly={!(note.editable || note.editing)}
            onDoubleClick={(event) => editNote(event, index)} >
          </textarea>
        </div>
      )}
      <div className={`selection-box${selectionBox.visible?'':' invisible'}`} style={selectionBox.style}>
      </div>
    </div>
  )
}
