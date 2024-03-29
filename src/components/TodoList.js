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
  

  return (
    <div className="todo-container">
      <div className="Title_Button_Container">
        <h2>TO-DO</h2>
        <div className="BackgroundButton2">
          <button className="todo-add-button" onClick={addTodo}><FaPlus className="fa" /></button>
        </div>
      </div>
      <ul className="todo-list">
  {todos.map((todo, index) => (
    <li
      key={todo.id}
      className={`todo-list-item ${todo.isEditing ? "editing" : ""}`}
      onDoubleClick={() => handleDoubleClick(todo.id)}
    >
      {todo.isEditing ? (
        <input
          ref={index === todos.length - 1 ? newTodoRef : null}
          type="text"
          value={todo.text}
          onChange={(e) => handleEditChange(e, todo.id)}
          onBlur={() => handleFinishEdit(todo.id)}
          onKeyPress={(e) => e.key === 'Enter' && handleFinishEdit(todo.id)}
          autoFocus
        />
      ) : (
        <div className="task-content">
          <input type="checkbox" className="task-checkbox" onClick={() => deleteTodo(todo.id)} />
          <span className="task-text">{todo.text}</span>
        </div>
      )}
    </li>
  ))}
</ul>

    </div>
  );
};

export default TodoList;