import React, { useEffect, useState } from 'react';
import "../css/todoList.css";

import { AiOutlineDelete } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";

function ToDoList(){ //関数名を必ず大文字で始まる！
    // btn area Hook
    const [isCompleteScreen, setIsCompleteScreen] = useState(false);
    const [allTodos,setTodos] = useState([]);
    const [newTitle,setNewTitle] = useState("");
    const [newDescription,setNewDescription] = useState("");

    const handleAddTodo = () => {
        if (!newTitle.trim() || !newDescription.trim()) return; // Prevent empty tasks
    
        let newTodoItem = {
            title: newTitle,
            description: newDescription
        };
    
        let updatedTodoArray = [...allTodos, newTodoItem]; // Cleaner way to update array
        setTodos(updatedTodoArray);
        localStorage.setItem('todolist', JSON.stringify(updatedTodoArray));
    
        // Reset input fields
        setNewTitle("");
        setNewDescription("");
    };
    
    useEffect(() =>{
        let savedTodo = JSON.parse(localStorage.getItem('todolist'));
        if(savedTodo){ 
            setTodos(savedTodo);
        }
    },[])

    const handleDeleteTodo = (index) => {
        let updatedTodoArray = [...allTodos];
        updatedTodoArray.splice(index, 1); // Remove the task at the given index
        setTodos(updatedTodoArray);
        localStorage.setItem('todolist', JSON.stringify(updatedTodoArray));
    };

    const [completedTodos, setCompletedTodos] = useState([]);

    const handleCompleteTodo = (index) => {
        let updatedTodoArray = [...allTodos];
        let completedTask = updatedTodoArray.splice(index, 1)[0]; // Remove and get task
    
        setTodos(updatedTodoArray);
        setCompletedTodos([...completedTodos, completedTask]);
    
        // Update localStorage
        localStorage.setItem('todolist', JSON.stringify(updatedTodoArray));
        localStorage.setItem('completedTodos', JSON.stringify([...completedTodos, completedTask]));
    };

    useEffect(() => {
        let savedTodo = JSON.parse(localStorage.getItem('todolist')) || [];
        let savedCompleted = JSON.parse(localStorage.getItem('completedTodos')) || [];
    
        setTodos(savedTodo);
        setCompletedTodos(savedCompleted);
    }, []);
    

    const handleClearCompleted = () => {
        setCompletedTodos([]); // Clear the state
        localStorage.setItem('completedTodos', JSON.stringify([])); // Update localStorage
    };
    return (
        <>
        <section className="toDoListApp">
        <h1>My ToDo's</h1>
            <div className="toDo-wrapper">
                <div className="toDo-input"> {/* Task Bar */}

                    {/* Task Name */}
                    <div className="toDo-input-item"> {/* タスクの内容を入れられる */}
                        <label>Task Name</label>
                        <input type="text" value={newTitle} onChange={(e)=> setNewTitle(e.target.value)} placeholder="Task Name" />
                    </div>

                    {/* Task Description */}
                    <div className="toDo-input-item">
                        <label>Description</label>
                        <input type="text" value={newDescription} onChange={(e)=> setNewDescription(e.target.value)} placeholder="Task Description" />
                    </div>

                    {/* Enter Task Button */}
                    <div className="toDo-input-item">
                        <button type="button" onClick={handleAddTodo} className="primaryBtn">Add</button>
                    </div>

                </div>

                {/* Buttons */}
                <div className="btn-area">
                    <div className='btn-wrapper'>
                        <button className={`secondaryBtn ${isCompleteScreen === false && 'active'}`} onClick={() => setIsCompleteScreen(false)}>To Do</button>
                        <button className={`secondaryBtn ${isCompleteScreen === true && 'active'}`} onClick={() => setIsCompleteScreen(true)}>Completed</button>
                    </div>

                </div>

                {/* Actual Content */} 
                <div className="todo-list">
                {isCompleteScreen ? (
                    <>
                        {completedTodos.map((item, index) => (
                            <div className="todo-list-item completed" key={index}>
                                <div>
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                </div>
                            </div>
                        ))}
                        {/* Clear All Button for Completed Tasks */}
                        {completedTodos.length > 0 && (
                            <div className="clear-btn-area">
                                <button className="clearBtn" onClick={handleClearCompleted}>Clear All</button>
                            </div>
                        )}
                    </>
                ) : (
                    allTodos.map((item, index) => (
                        <div className="todo-list-item" key={index}>
                            <div>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                            </div>

                            <div>
                                <AiOutlineDelete className='delete-icon' onClick={() => handleDeleteTodo(index)} />
                                <BsCheckLg className='check-icon' onClick={() => handleCompleteTodo(index)} />
                            </div>
                        </div>
                    ))
                )}
            </div>
            </div>
        </section>
        </>
    )
}
export default ToDoList;
