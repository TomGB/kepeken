import React from 'react';

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
      {state.notes.map((note, index) => {
        let content;
        if (state.loading) {
          setState({ loading: false });
          console.log(note.content);
          content = note.content
        }
        // https://stackoverflow.com/questions/22677931/react-js-onchange-event-for-contenteditable
        return (
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
            onKeyUp={(event) => updateNote(event, index)}
            style={{ 'max-height': note.style.height }} >
            {content}
          </div>
        </div>
      )
      })}
      <div className={`selection-box${selectionBox.visible?'':' invisible'}`} style={selectionBox.style}>
      </div>
    </div>
  )
}
