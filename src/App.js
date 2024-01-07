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

  useEffect(() => {
    let savedProjects = JSON.parse(localStorage.getItem('projects')) || [];
    savedProjects = savedProjects.map(project => ({
      ...project,
      todos: project.todos || []
    }));
    setProjects(savedProjects);
  }, []);

  const saveProjects = (newProjects) => {
    localStorage.setItem('projects', JSON.stringify(newProjects));
  };

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      const newProject = { name: newProjectName, note: '', todos: [] };
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
                <div className="Project_Item" onClick={() => setSelectedProjectIndex(index)}>
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
                      <FaTrash onClick={() => handleDeleteProject(index)} className="Delete_Icon" />
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
            <Notes
              content={projects[selectedProjectIndex].note}
              onContentChange={handleUpdateNote}
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
