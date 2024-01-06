import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import './App.css';
import Notes from './components/Notes';
import TodoList from './components/TodoList';

function App() {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(-1);

  useEffect(() => {
    const savedProjects = JSON.parse(localStorage.getItem('projects')) || [];
    setProjects(savedProjects);
  }, []);

  const saveProjects = (newProjects) => {
    localStorage.setItem('projects', JSON.stringify(newProjects));
  };

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      const newProject = { name: newProjectName, note: '' };
      const updatedProjects = [...projects, newProject];
      setProjects(updatedProjects);
      saveProjects(updatedProjects);
      setNewProjectName('');
    }
  };

  const handleSelectProject = (index) => {
    setSelectedProjectIndex(index);
  };

  const handleDeleteProject = (index) => {
    const updatedProjects = projects.filter((_, projIndex) => projIndex !== index);
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
    if (index === selectedProjectIndex) {
      setSelectedProjectIndex(-1);
    }
  };

  const handleUpdateNote = (newNoteContent) => {
    const updatedProjects = projects.map((project, index) => {
      if (index === selectedProjectIndex) {
        return { ...project, note: newNoteContent };
      }
      return project;
    });
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
              <div key={index} className="Project_Item" onClick={() => handleSelectProject(index)}>
                {project.name}
                <FaTrash onClick={() => handleDeleteProject(index)} className="Delete_Icon" />
              </div>
            ))}
          </div>
        </div>
        <div className="Notes">
          {selectedProjectIndex !== -1 &&
            <Notes
              content={projects[selectedProjectIndex].note}
              onContentChange={handleUpdateNote}
            />
          }
        </div>
        <div className="Todo">
          <TodoList />
        </div>
      </div>
      <div className="bord1"></div>
    </div>
  );
}

export default App;
