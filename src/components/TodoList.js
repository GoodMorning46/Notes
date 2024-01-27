import React, { useRef, useEffect, useCallback } from 'react';
import "./css/TodoList.css";
import { FaPlus } from 'react-icons/fa';


const TodoList = ({ todos, setTodos }) => {
  const newTodoRef = useRef(null);

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

  const handleEditTodo = (e, todoId) => {
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

  return (
    <div className="todo-container">
      <h2>Liste des tâches</h2>
      <button className="todo-add-button" onClick={addTodo}>
  <FaPlus className="fa" /> Créer une tâche
</button>
      <ul className="todo-list">
        {todos.map((todo, index) => (
          <li key={todo.id} className="todo-list-item">
            {todo.isEditing ? (
              <input
                ref={index === todos.length - 1 ? newTodoRef : null}
                type="text"
                value={todo.text}
                onChange={(e) => handleEditTodo(e, todo.id)}
                onBlur={() => handleFinishEdit(todo.id)}
                onKeyPress={(e) => e.key === 'Enter' && handleFinishEdit(todo.id)}
              />
            ) : (
              <>
                <input type="checkbox" onClick={() => deleteTodo(todo.id)} />
                {todo.text}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
