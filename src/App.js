import React, { useState } from 'react';
import { ethers } from 'ethers';
import TodoListABI from './contracts/TodoListABI.json';
import './App.css';


function App() {
  const [tasks, setTasks] = useState([]);
  const [taskContent, setTaskContent] = useState('');


  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();


  const todoListContract = new ethers.Contract(
    process.env.REACT_APP_TODO_LIST_ADDRESS,
    TodoListABI,
    signer
  );


  const getTasks = async () => {
    const count = await todoListContract.taskCount();
    const newTasks = [];


    for (let i = 1; i <= count; i++) {
      const task = await todoListContract.tasks(i);
      newTasks.push(task);
    }


    setTasks(newTasks);
  };


  const createTask = async (e) => {
    e.preventDefault();
    const { hash } = await todoListContract.createTask(taskContent);
    await provider.waitForTransaction(hash);
    await getTasks();
    setTaskContent('');
  };


  const toggleCompleted = async (taskId) => {
    const { hash } = await todoListContract.toggleCompleted(taskId);
    await provider.waitForTransaction(hash);
    await getTasks();
  };


  return (
    <div className="App">
      <h1>Todo List</h1>


      <form onSubmit={createTask}>
        <input
          type="text"
          placeholder="Add a Task"
          value={taskContent}
          onChange={(e) => setTaskContent(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>


      <div>
        {tasks.map((task) => (
          <div key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleCompleted(task.id)}
            />
            <span>{task.content}</span>
          </div>))
        }
      </div>
    </div>
  );
}


export default App;