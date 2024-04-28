import React, { useState, useEffect, useRef } from 'react';
import { FaTrash  } from 'react-icons/fa';
import { BsPlusSquareDotted } from "react-icons/bs";
import B28Image from './B28.png';
import './App.css';
import Notes from './components/Notes';
import TodoList from './components/TodoList';



function App() {
  const [projects, setProjects] = useState([]);
  const [todos, setTodos] = useState([]);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(-1);
  const [editingProjectIndex, setEditingProjectIndex] = useState(-1);
  const [editingProjectName, setEditingProjectName] = useState('');
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(0); // Ajout pour gérer l'index de la note sélectionnée
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const projectNameInputRef = useRef(null);
  


  // Récupère les données du localStorage
  useEffect(() => {
    let savedProjects = JSON.parse(localStorage.getItem('projects')) || [];
    savedProjects = savedProjects.map(project => ({
      ...project,
      notes: project.notes || [],
      todos: project.todos || []
    }));
    setProjects(savedProjects);
  
    const savedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    setTodos(savedTodos);
  
    // Récupérer l'index du projet sélectionné
    const savedSelectedProjectIndex = parseInt(localStorage.getItem('selectedProjectIndex'), 10);
    if (!isNaN(savedSelectedProjectIndex) && savedProjects[savedSelectedProjectIndex]) {
      setSelectedProjectIndex(savedSelectedProjectIndex);
    }
  }, []);
  
  // Sauvegarde les projets et la todo
  const saveProjects = () => {
    localStorage.setItem('projects', JSON.stringify(projects));
    localStorage.setItem('todos', JSON.stringify(todos));
  };

  // Double clic pour sélectionner le nom du projet à modifier
  const handleEditProject = (id, newName) => {
    const updatedProjects = projects.map(project =>
      project.id === id ? { ...project, name: newName } : project
    );
    setProjects(updatedProjects);
  };

  const handleFinishEdit = (id) => {
    const updatedProjects = projects.map(project =>
      project.id === id ? { ...project, isEditing: false } : project
    );
    setProjects(updatedProjects);
    
    // Trouver l'index du projet qui vient d'être modifié
    const projectIndex = updatedProjects.findIndex(project => project.id === id);
    if (projectIndex !== -1) {
      setSelectedProjectIndex(projectIndex);
      setSelectedNoteIndex(0); // Sélectionner la première note du projet
    }
  };  

  // Modifier le nom d'un projet  
  const handleEditProjectNameChange = (e) => { 
    setEditingProjectName(e.target.value);
  };

  // Enregistrer le nom du projet modifié
  const handleEditProjectNameSubmit = (index) => { 
    const updatedProjects = projects.map((project, projIndex) =>
      projIndex === index ? { ...project, name: editingProjectName } : project
    );
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
    setEditingProjectIndex(-1);
  };

  // Supprimer un projet
  const handleDeleteProject = (index) => {
    const updatedProjects = projects.filter((_, projIndex) => projIndex !== index);
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
    if (index === selectedProjectIndex) {
      setSelectedProjectIndex(-1);
    }
  };

  // Ajoute une note vide au projet sélectionné
  const handleAddNote = () => {
    if (selectedProjectIndex !== -1) {
      const updatedProjects = projects.map((project, index) => {
        if (index === selectedProjectIndex) {
          const newNote = { content: '' }; // Création de la nouvelle note avec couleur
          return { ...project, notes: [...project.notes, newNote] }; // Ajout de la nouvelle note
        } else {
          return project;
        }
      });
      setProjects(updatedProjects);
      saveProjects(updatedProjects);
    }
  };
  

  // Met à jour le contenu d'une note
  const handleUpdateNote = (newNoteContent, noteIndex) => {
    const updatedProjects = projects.map((project, index) => {
      if (index === selectedProjectIndex) {
        const updatedNotes = project.notes.map((note, ni) => {
          if (ni === noteIndex) {
            return { ...note, content: newNoteContent }; // Met à jour uniquement la propriété content
          }
          return note;
        });
        return { ...project, notes: updatedNotes };
      }
      return project;
    });
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
  };
  

  // Supprimer une note
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

  // Vue de la dernière note quand on sélectionne un projet
  const handleSelectNote = (noteIndex) => {
    setSelectedNoteIndex(noteIndex);
    const updatedProjects = projects.map((project, index) => {
      if (index === selectedProjectIndex) {
        return { ...project, lastSelectedNoteIndex: noteIndex };
      }
      return project;
    });
    setProjects(updatedProjects);
  };
  

  const handleSelectProject = (projectIndex) => {
    setSelectedProjectIndex(projectIndex);
    // Réinitialiser la sélection de la note indépendante
    const lastSelectedNoteIndex = projects[projectIndex].lastSelectedNoteIndex || 0;
    setSelectedNoteIndex(lastSelectedNoteIndex);
  
    // Sauvegarder l'index du projet sélectionné dans le localStorage
    localStorage.setItem('selectedProjectIndex', projectIndex);
  };
  

  const addProject = () => {
    const newProject = { id: Date.now(), name: '', isEditing: true, notes: [''] };
    setProjects([...projects, newProject]);
    setIsCreatingProject(true);
  };

  useEffect(() => {
    if (isCreatingProject && projectNameInputRef.current) {
      projectNameInputRef.current.focus();
      setIsCreatingProject(false);
    }
  }, [isCreatingProject]);

  
  return (
    <div className="App">
      <div className="Bloc_parent">

        <div className="Menu_gauche">
          <div className="Texte_Welcome">
            <img src={B28Image} alt="logo" className="logo" />
            <div className="BienvenueVersion">
              <div className="TexteDeBienvenue">Bienvenue</div>
              <div className="Version">v0.2</div>
            </div>
          </div>
            <div className="TitleButtonProject">
              <p className='Titre_Projet'>PROJETS</p>
              <button className="ButtonAddProject" onClick={addProject}><BsPlusSquareDotted /></button>
            </div>

            <div className="Projects_List">
              {projects.map((project, index) => (
                <div key={project.id} className="Project_Container">
                  {project.isEditing ? 
                    <input 
                    className="ProjectInput"
                    type="text" 
                    ref={projectNameInputRef}
                    value={project.name} 
                    onChange={(e) => handleEditProject(project.id, e.target.value)} 
                    onBlur={() => handleFinishEdit(project.id)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleFinishEdit(project.id); // Supposons que cette fonction finalise la création du projet
                      }
                    }}
                  />: 
          <div 
            className={`Project_Item ${selectedProjectIndex === index ? 'Project_Item_Selected' : ''}`} 
            onClick={() => handleSelectProject(index)}>
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
                  }
                </div>
              ))}
            </div>

        </div>

        <div className="NotesTodo">
          <div className="Notes">
    {selectedProjectIndex !== -1 && projects[selectedProjectIndex] &&
      <div className="notes-tabs-container">
        {projects[selectedProjectIndex].notes.map((note, index) => (
          <div
            key={index}
            className={`notes-tab ${index === selectedNoteIndex ? 'notes-tab-active' : ''}`}
            style={{ backgroundColor: note.color }} // Appliquer la couleur ici
            onClick={() => handleSelectNote(index)}
          >
            <span className="note-text-class">Note {index + 1}</span>
            <FaTrash onClick={(e) => { e.stopPropagation(); handleDeleteNote(selectedProjectIndex, index); }} className="Delete_Icon" />
          </div>
        ))}
        <button onClick={handleAddNote} className="add-note-button"><BsPlusSquareDotted className="icone_plus"/></button>
      </div>
    }
    {selectedProjectIndex !== -1 && projects[selectedProjectIndex] &&
      <Notes
        content={projects[selectedProjectIndex].notes[selectedNoteIndex].content} // Assurez-vous d'accéder à la propriété content ici
        onContentChange={(content) => handleUpdateNote(content, selectedNoteIndex)}
        onDeleteNote={() => handleDeleteNote(selectedProjectIndex, selectedNoteIndex)}
      />
    }
          </div>

          <div className="Todo">
          <TodoList
            todos={todos}
            setTodos={setTodos}
            saveProjects={saveProjects}
            projects={projects}  // Ajouter cette ligne
          />
          </div>
        </div>

      </div>
      
    </div>
  );
}

export default App;
