import React, { useState } from 'react';
import "./css/TodoList.css";

const TodoList = ({ todos, setTodos }) => {  const [newTodo, setNewTodo] = useState('');

const addTodo = () => {
  if (!newTodo.trim()) return;
  const newTodoItem = {
    id: Math.random().toString(),
    text: newTodo
  };
  const updatedTodos = [...todos, newTodoItem];
  setTodos(updatedTodos);
  setNewTodo('');
  saveProjects(updatedTodos); // Mettre à jour pour passer les todos mis à jour
};

const deleteTodo = (todoId) => {
  const updatedTodos = todos.filter(todo => todo.id !== todoId);
  setTodos(updatedTodos);
  saveProjects(updatedTodos); // Mettre à jour pour passer les todos mis à jour
};

const saveProjects = (updatedTodos) => {
  localStorage.setItem('todos', JSON.stringify(updatedTodos));
};

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  if (!todos) {
    return <div>Aucune tâche.</div>;
  }

  return (
    <div className="todo-container">
      <h2>Liste des tâches</h2>
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
            <input 
              type="checkbox" 
              onClick={() => deleteTodo(todo.id)}
            />
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
