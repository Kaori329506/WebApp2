// `react-router-dom` を使う
import  './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router'; 

// Routerフォルダ内のjsxファイルをImport
import Home from './routers/home';
import ToDoList from './routers/toDoList';
import Journal from './routers/journal';
import Calendar from './routers/calendar';

function App() {
  return (
    <BrowserRouter>
    <main>
      <header>
        <nav > 
            <ul className='mainNavi'>
              <li>
                <Link to='/'>Home</Link>
              </li>
              <li>
                <Link to='/toDoList'>To Do List</Link>
              </li>
              <li>
                <Link to='/journal'>Journal</Link>
              </li>
              <li>
                <Link to='/calendar'>Calendar</Link>
              </li>
            </ul>
          </nav>
      </header>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/toDoList' element={<ToDoList />} />
        <Route path='/journal' element={<Journal />} />
        <Route path='/calendar' element={<Calendar />} />
      </Routes>
      </main>

    </BrowserRouter>
  );
}

export default App;