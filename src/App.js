import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import './App.css';
import Notes from './components/Notes';
import TodoList from './components/TodoList';

function App() {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(-1);
  const [editingProjectIndex, setEditingProjectIndex] = useState(-1);
  const [editingProjectName, setEditingProjectName] = useState('');
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(0); // Ajout pour gérer l'index de la note sélectionnée

  useEffect(() => {
    let savedProjects = JSON.parse(localStorage.getItem('projects')) || [];
    savedProjects = savedProjects.map(project => ({
      ...project,
      notes: project.notes || [''], // Assurez-vous que chaque projet a une liste de notes
      todos: project.todos || []
    }));
    setProjects(savedProjects);
  }, []);

  const saveProjects = (newProjects) => {
    localStorage.setItem('projects', JSON.stringify(newProjects));
  };

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      const newProject = { name: newProjectName, notes: [''], todos: [] };
      const updatedProjects = [...projects, newProject];
      setProjects(updatedProjects);
      saveProjects(updatedProjects);
      setNewProjectName('');
    }
  };

  const handleEditProject = (index) => {
    setEditingProjectIndex(index);
    setEditingProjectName(projects[index].name);
  };

  const handleEditProjectNameChange = (e) => {
    setEditingProjectName(e.target.value);
  };

  const handleEditProjectNameSubmit = (index) => {
    const updatedProjects = projects.map((project, projIndex) =>
      projIndex === index ? { ...project, name: editingProjectName } : project
    );
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
    setEditingProjectIndex(-1);
  };

  const handleDeleteProject = (index) => {
    const updatedProjects = projects.filter((_, projIndex) => projIndex !== index);
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
    if (index === selectedProjectIndex) {
      setSelectedProjectIndex(-1);
    }
  };

  const handleAddNote = () => {
    if (selectedProjectIndex !== -1) {
      const updatedProjects = projects.map((project, index) => 
        index === selectedProjectIndex ? { ...project, notes: [...project.notes, ''] } : project
      );
      setProjects(updatedProjects);
      saveProjects(updatedProjects);
    }
  };

  const handleUpdateNote = (newNoteContent, noteIndex) => {
    const updatedProjects = projects.map((project, index) => {
      if (index === selectedProjectIndex) {
        const updatedNotes = project.notes.map((note, ni) => ni === noteIndex ? newNoteContent : note);
        return { ...project, notes: updatedNotes };
      }
      return project;
    });
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
  };

  const handleDeleteNote = (projectIndex, noteIndex) => {
    const updatedProjects = projects.map((project, index) => {
      if (index === projectIndex) {
        const updatedNotes = project.notes.filter((_, ni) => ni !== noteIndex);
        return { ...project, notes: updatedNotes };
      }
      return project;
    });
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
  };

  const handleAddTodo = (newTodo) => {
    const updatedProjects = projects.map((project, index) => 
      index === selectedProjectIndex ? { ...project, todos: [...project.todos, newTodo] } : project
    );
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
  };

  const handleDeleteTodo = (todoId) => {
    const updatedProjects = projects.map((project, index) => 
      index === selectedProjectIndex ? { ...project, todos: project.todos.filter(todo => todo.id !== todoId) } : project
    );
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
  };

  return (
    <div className="App">
      <div className="bord1"></div>
      <div className="Bloc_parent">
        <div className="Menu_gauche">
          <h1 className="Board">Board</h1>
          <div className="Project_Creation">
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddProject()}
                placeholder="Nom du projet"
              />
              <button onClick={handleAddProject}>Projet +</button>
          </div>
          <div className="Projects_List">
  {projects.map((project, index) => (
    <div key={index} className="Project_Container">
      <div 
        className={`Project_Item ${selectedProjectIndex === index ? 'Project_Item_Selected' : ''}`}
        onClick={() => setSelectedProjectIndex(index)}
      >
        {editingProjectIndex === index ? (
          <input
            type="text"
            value={editingProjectName}
            onChange={handleEditProjectNameChange}
            onBlur={() => handleEditProjectNameSubmit(index)}
            onKeyPress={(e) => e.key === 'Enter' && handleEditProjectNameSubmit(index)}
            autoFocus
          />
        ) : (
          <>
            <span onDoubleClick={() => handleEditProject(index)}>{project.name}</span>
            <FaTrash onClick={(e) => { e.stopPropagation(); handleDeleteProject(index); }} className="Delete_Icon" />
          </>
        )}
      </div>
      <span className="Task_Counter">{project.todos.length}</span>
    </div>
  ))}
</div>
        </div>
        <div className="Notes">
        {selectedProjectIndex !== -1 && projects[selectedProjectIndex] &&
  <div className="notes-tabs">
  {projects[selectedProjectIndex].notes.map((note, index) => (
    <div
      key={index}
      className={`notes-tab ${index === selectedNoteIndex ? 'notes-tab-active' : ''}`}
      onClick={() => setSelectedNoteIndex(index)}
    >
      Note {index + 1}
      <FaTrash onClick={(e) => { e.stopPropagation(); handleDeleteNote(selectedProjectIndex, index); }} className="Delete_Icon" />
    </div>
  ))}
  <button onClick={handleAddNote} className="notes-tab">Ajouter Note</button>
</div>
}
        {selectedProjectIndex !== -1 && projects[selectedProjectIndex] &&
          <Notes
          content={projects[selectedProjectIndex].notes[selectedNoteIndex]}
          onContentChange={(content) => handleUpdateNote(content, selectedNoteIndex)}
          onDeleteNote={() => handleDeleteNote(selectedProjectIndex, selectedNoteIndex)}
        />
        }
      </div>
        <div className="Todo">
          {selectedProjectIndex !== -1 && projects[selectedProjectIndex] &&
            <TodoList
              todos={projects[selectedProjectIndex].todos}
              onAddTodo={handleAddTodo}
              onDeleteTodo={handleDeleteTodo}
            />
          }
        </div>
      </div>
      <div className="bord1"></div>
    </div>
  );
}

export default App;