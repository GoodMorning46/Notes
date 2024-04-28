import React, { useState, useRef, useEffect, useCallback } from 'react';
import "./css/TodoList.css";
import { BsPlusSquareDotted } from "react-icons/bs";
import { IoIosArrowDown } from 'react-icons/io';  // Importer l'icône IoIosArrowDown


const TodoList = ({ todos, setTodos, projects }) => {
  const newTodoRef = useRef(null);
  const [visibleDropdownId, setVisibleDropdownId] = useState(null);
  const [todoProjects, setTodoProjects] = useState(() => {
    const savedProjects = localStorage.getItem('todoProjects');
    return savedProjects ? JSON.parse(savedProjects) : {};
  });


  useEffect(() => {
    localStorage.setItem('todoProjects', JSON.stringify(todoProjects));
  }, [todoProjects]);

  
  
  const addTodo = () => {
    const newTodoItem = {
      id: Math.random().toString(),
      text: '',
      isEditing: true
    };
    const updatedTodos = [...todos, newTodoItem];
    setTodos(updatedTodos);
    saveProjects(updatedTodos);
  };

  const handleDoubleClick = (todoId) => {
    const updatedTodos = todos.map(todo =>
      todo.id === todoId ? { ...todo, isEditing: !todo.isEditing } : todo
    );
    setTodos(updatedTodos);
  };

  const handleEditChange = (e, todoId) => {
    const updatedTodos = todos.map(todo =>
      todo.id === todoId ? { ...todo, text: e.target.value } : todo
    );
    setTodos(updatedTodos);
  };

  const handleFinishEdit = (todoId) => {
    const updatedTodos = todos.map(todo =>
      todo.id === todoId ? { ...todo, isEditing: false } : todo
    );
    setTodos(updatedTodos);
    saveProjects(updatedTodos);
  };

  const deleteTodo = (todoId) => {
    const updatedTodos = todos.filter(todo => todo.id !== todoId);
    setTodos(updatedTodos);
    saveProjects(updatedTodos);
  };

  useEffect(() => {
    if (todos.length > 0 && todos[todos.length - 1].isEditing) {
      newTodoRef.current?.focus();
    }
  }, [todos]);

  const saveProjects = useCallback((todos) => {
    const todosForSaving = todos.map(todo => ({ ...todo, isEditing: false }));
    localStorage.setItem('todos', JSON.stringify(todosForSaving));
  }, []);

  const toggleDropdown = (id) => {
    if (visibleDropdownId === id) {
      setVisibleDropdownId(null);
    } else {
      setVisibleDropdownId(id);
    }
  };

  const handleProjectSelect = (todoId, projectName) => {
    setTodoProjects(prev => ({
      ...prev,
      [todoId]: projectName
    }));
    setVisibleDropdownId(null);  // Ferme la liste déroulante après la sélection
  };
  
  // À l'intérieur du composant TodoList Affiche le texte de la tâche
  return (
    <div className="todo-container">
      <div className="Title_Button_Container">
        <p className='titre_mission'>MISSIONS</p>
        <button className="todo-add-button" onClick={addTodo}><BsPlusSquareDotted className="AddNote" /></button>
      </div>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id}
              className={`todo-list-item ${todo.isEditing ? "editing" : ""}`}
              onDoubleClick={() => handleDoubleClick(todo.id)}>
            {todo.isEditing ? (
              <input
                type="text"
                value={todo.text}
                onChange={(e) => handleEditChange(e, todo.id)}
                onBlur={() => handleFinishEdit(todo.id)}
                onKeyPress={(e) => e.key === 'Enter' && handleFinishEdit(todo.id)}
                autoFocus
              />
            ) : (
              <div className="Card">
                <div className="task-content">
                  <div className="checkbox_part">
                    <input type="checkbox" onClick={() => deleteTodo(todo.id)} />
                  </div>
                  
                  <div className="Text_button"> 

                    <span className="task-text">{todo.text}</span> {/* Affiche le texte de la tâche */}

                    {/* Conditionnellement affiche le projet sélectionné ou un bouton pour sélectionner un projet */}
                    {todoProjects[todo.id] ? ( 
                      <div className="project-display" onClick={() => toggleDropdown(todo.id)}>
                        {/* Affiche le nom du projet sélectionné */}
                        <div className="projet_card">
                        {todoProjects[todo.id]} 
                        </div>
                      </div>
                    ) : (   // Affiche le bouton "Ajouter un projet"
                      <button className="button_add_project" onClick={() => toggleDropdown(todo.id)}>
                        Ajouter à un projet
                        <IoIosArrowDown className="icon-arrow-down" /> {/* Icône indiquant qu'un menu peut être déroulé */}
                      </button>
                    )}
                    {visibleDropdownId === todo.id && (
                      <ul className="dropdown-menu">
                        {projects.map((project, projIndex) => (
                          <li key={projIndex} onClick={() => handleProjectSelect(todo.id, project.name)}>
                            {project.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

};

export default TodoList;