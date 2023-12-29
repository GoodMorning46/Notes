import './App.css';
import Notes from './components/Notes';
import TodoList from './components/TodoList';



function App() {
  return (
    <div className="App">
      <div className="bord1"></div>
        <div className="Bloc_parent">
          <div className="Menu_gauche">
            <h1 className="Board">Board</h1>
          </div>
          <div className="Notes">
            <Notes />
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
