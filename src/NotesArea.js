import React from 'react';
import ContentEditable from 'react-contenteditable';
import { startPanning, movePanning, stopPanning } from './helpers/pan.js'

export default function NotesArea({master, updateNote, selectNote, editNote, deselectNote, startSelectBox, endSelectionBox, drawSelectBox}) {
  const zoom = master.state.zoom;

  const panX = master.state.panLocation.currentX;
  const panY = master.state.panLocation.currentY;

  console.log(panX, panY);

  const containerStyle = {
    zoom,
    '-ms-zoom': zoom,
    '-webkit-zoom': zoom,
    '-moz-transform': `scale(${zoom},${zoom})`,
    '-moz-transform-origin': 'top left',
    height: 100 / zoom + '%',
    width: 100 / zoom + '%',
    // background: (process.env.NODE_ENV === 'development' ? 'gray' : ''),
    'background-position-x': panX,
    'background-position-y': panY,
  };
  return (
    <div
      className='noteContainer'
      onMouseDown={(event) => {
        startSelectBox(event)
        startPanning(master, event)
      }}
      onTouchStart={(event) => {
        startSelectBox(event);
        startPanning(master, event)
      }}
      onMouseUp={(event) => {
        deselectNote(event)
        endSelectionBox(event)
        stopPanning(master, event)
      }}
      onTouchEnd={(event) => {
        deselectNote(event)
        endSelectionBox(event)
        stopPanning(master, event)
      }}
      onTouchMove={(event) => {
        drawSelectBox(event)
        movePanning(master, event)
      }}
      onMouseMove={(event) => {
        drawSelectBox(event)
        movePanning(master, event)
      }}
      style={containerStyle}
    >
      {master.state.notes.map((note, index) =>
        <div
          className={`note${note.selected?' selected':''}`}
          data-index={index}
          key={index}
          onMouseDown={(event) => selectNote(event, index)}
          onTouchStart={(event) => selectNote(event, index)}
          onDoubleClick={(event) => editNote(event, index)}
          style={{
            ...note.style,
            left: note.style.left + master.state.panLocation.currentX,
            top: note.style.top + master.state.panLocation.currentY,
          }} >
          <ContentEditable
            className='noteText'
            html={(process.env.NODE_ENV === 'development' ? JSON.stringify(note, null, 2) : note.content)}
            disabled={!note.editable && !note.editing}
            onChange={(event) => updateNote(event, index)}
          />
        </div>
      )}
      <div className={`selection-box${master.state.selectionBox.visible?'':' invisible'}`} style={master.state.selectionBox.style}>
      </div>
    </div>
  )
}
