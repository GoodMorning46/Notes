import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './css/Notes.css';


const toolbarOptions = [
  [{ 'header': [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ 'list': 'bullet' }],
  [{ 'color': [] }, { 'background': [] }],
  ['link',],
];

const Notes = ({ content, onContentChange, onDeleteNote, selectedNoteIndex }) => {
  const [editorHtml, setEditorHtml] = useState('');

  useEffect(() => {
    if (content !== editorHtml) {
      setEditorHtml(content);
    }
  }, [content, editorHtml]);

  const handleChange = (content, delta, source, editor) => {
    console.log("Editor HTML content:", editor.getHTML());
    onContentChange(content);
    setEditorHtml(content);
  };

  return (
    <div className="notes-container">
      <div className="custom-quill-font">
        <ReactQuill
          value={editorHtml}
          onChange={handleChange}
          modules={{ toolbar: toolbarOptions }}
          theme="snow"
        />
      </div>
    </div>
  );
};

export default Notes;
