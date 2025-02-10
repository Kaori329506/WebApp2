import "../css/home.css";
import { LuListTodo } from "react-icons/lu";
import { IoIosJournal } from "react-icons/io";
import { FaCalendarAlt } from "react-icons/fa";


function Home() { // ✅ 関数名を大文字に修正
    return (
        <>
        <h1>Home</h1>
        <ul className='contentDescription'>
            <li>
                <LuListTodo  className='todoIcon'/>
                <h2>ToDo List</h2>
                <p>Write Todays ToDo List</p>
            </li>
            <li>
                <IoIosJournal className='journal'/>
                <h2>Journal</h2>
                <p>Write Today's Journal</p>
            </li>
            <li>
                <FaCalendarAlt className='schedule'/>
                <h2>Schedule</h2>
                <p>Write Todays Schedule</p>

            </li>
        </ul>
        </>
    );
}

export default Home;