import React, { useState, useEffect } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import "./css/TodoList.css"; // Importez le fichier CSS

const TodoList = () => {
  // Charger les tâches sauvegardées ou initialiser une liste vide
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  // Mettre à jour le localStorage à chaque changement de la liste des tâches
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (!newTodo.trim()) return;
    const newTask = {
      id: Math.random().toString(),
      text: newTodo
    };
    setTodos([...todos, newTask]);
    setNewTodo('');
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="todo-container">
      <input
        className="todo-input"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Ajouter une nouvelle tâche"
      />
      <button className="todo-add-button" onClick={addTodo}>Ajouter</button>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-list-item">
            {todo.text}
            <FaTrashAlt
              className="delete-icon"
              onClick={() => deleteTodo(todo.id)}
              style={{ cursor: 'pointer', marginLeft: '10px' }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
