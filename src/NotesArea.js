import React from 'react';

export default function NotesArea({notes, updateNote, selectNote, editNote, deselectNote, startSelectBox, endSelectionBox, drawSelectBox, selectionBox}) {
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
      {notes.map((note, index) =>
        <div
          className={`note${note.selected?' selected':''}`}
          data-index={index}
          key={index}
          onMouseDown={(event) => selectNote(event, index)}
          onTouchStart={(event) => selectNote(event, index)}
          onDoubleClick={(event) => editNote(event, index)}
          style={note.style} >
          <div
            contentEditable={note.editable || note.editing}
            className='noteText'
            onChange={(event) => updateNote(event, index)}
            style={{ 'max-height': note.style.height }} >
          </div>
        </div>
      )}
      <div className={`selection-box${selectionBox.visible?'':' invisible'}`} style={selectionBox.style}>
      </div>
    </div>
  )
}
