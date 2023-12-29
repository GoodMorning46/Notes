import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './css/Notes.css';

const toolbarOptions = [
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'color': [] }, { 'background': [] }],
  ['link', 'image'],
];

const Notes = () => {
  const [editorHtml, setEditorHtml] = useState('');

  useEffect(() => {
    // Chargement du contenu depuis le localStorage
    const localNotes = localStorage.getItem('notes');
    if (localNotes) {
      setEditorHtml(localNotes);
    }
  }, []);

  const handleChange = (content, delta, source, editor) => {
    // Mise à jour de l'état de l'éditeur et sauvegarde dans le localStorage
    setEditorHtml(content);
    localStorage.setItem('notes', content);
  };

  return (
    <div className="notes-container">
      <ReactQuill 
        value={editorHtml}
        onChange={handleChange}
        modules={{ toolbar: toolbarOptions }}
        theme="snow"
      />
    </div>
  );
};

export default Notes;
