import React, { useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import "./css/TodoList.css";

const TodoList = ({ todos, onAddTodo, onDeleteTodo }) => {
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (!newTodo.trim()) return;
    onAddTodo({
      id: Math.random().toString(),
      text: newTodo
    });
    setNewTodo('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  // Vérification si 'todos' est défini et est un tableau
  if (!todos) {
    return <div>Aucune tâche.</div>;
  }

  return (
    <div className="todo-container">
      <input
        className="todo-input"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Ajouter une nouvelle tâche"
      />
      <button className="todo-add-button" onClick={addTodo}>Ajouter une tâche</button>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-list-item">
            {todo.text}
            <FaTrashAlt
              className="delete-icon"
              onClick={() => onDeleteTodo(todo.id)}
              style={{ cursor: 'pointer', marginLeft: '10px' }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
