import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './css/Notes.css';
import { Tldraw } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css'


const toolbarOptions = [
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'color': [] }, { 'background': [] }],
  ['link', 'image'],
];

const Notes = ({ content, onContentChange, onDeleteNote, selectedNoteIndex }) => {
  const [editorHtml, setEditorHtml] = useState('');
  const [isDrawingMode, setIsDrawingMode] = useState(false);

  const handleToggleDrawingMode = () => {
    setIsDrawingMode(!isDrawingMode);
  };

  useEffect(() => {
    setEditorHtml(content);
  }, [content]);

  const handleChange = (content, delta, source, editor) => {
    onContentChange(content);
    setEditorHtml(content);
  };

  return (
    <div className="notes-container">
    {/* Positionnez le bouton "Dessiner" en haut à droite */}
    <button onClick={handleToggleDrawingMode} className="button-draw">
      {isDrawingMode ? 'Retour à l\'édition' : 'Dessiner'}
    </button>
      {isDrawingMode ? (
        <Tldraw />
      ) : (
        <ReactQuill
          value={editorHtml}
          onChange={handleChange}
          modules={{ toolbar: toolbarOptions }}
          theme="snow"
        />
      )}
    </div>  // Ajout de la balise de fermeture </div>
  );
};

export default Notes;
