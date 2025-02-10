import React, { useState, useEffect, useCallback } from 'react';
import "../css/calendar.css";
import { AiOutlineDelete } from "react-icons/ai";


function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState([]);
  const [monthDisplay, setMonthDisplay] = useState('');
  const [selectedDay, setSelectedDay] = useState(null);
  const [events, setEvents] = useState([]);
  const [eventText, setEventText] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  const genres = {
    "🔴 仕事": "#ff6347", // Tomato
    "🟢 プライベート": "#32cd32", // LimeGreen
    "🔵 趣味": "#1e90ff", // DodgerBlue
    "🟣 重要": "#ff1493", // DeepPink
  };

  const weekdays = ["日", "月", "火", "水", "木", "金", "土"]; // Array for weekdays (曜日)

  useEffect(() => {
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
  }, [currentDate]);

  const generateCalendar = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    setMonthDisplay(`${year}年 ${month + 1}月`);

    let newDays = Array(42).fill(null);
    for (let i = 0; i < daysInMonth; i++) {
      const key = `${year}-${month + 1}-${i + 1}`;
      const storedData = localStorage.getItem(key);
      newDays[startingDay + i] = {
        day: i + 1,
        hasEvent: storedData && JSON.parse(storedData).length > 0,
      };
    }

    setDays(newDays);
  };

  const handleDayClick = useCallback((dayNumber, year, month) => {
    const key = `${year}-${month + 1}-${dayNumber}`;
    const storedData = localStorage.getItem(key);
    let storedEvents = storedData ? JSON.parse(storedData) : [];

    setSelectedDay(dayNumber);
    setEvents(Array.isArray(storedEvents) ? storedEvents : []);
  }, []);

  const handleSaveEvent = useCallback((dayNumber, year, month) => {
    if (!eventText.trim() || !selectedGenre) return;

    const key = `${year}-${month + 1}-${dayNumber}`;
    const newEvent = { text: eventText, genre: selectedGenre, color: genres[selectedGenre] };
    
    const storedData = localStorage.getItem(key);
    let storedEvents = storedData ? JSON.parse(storedData) : [];

    const updatedEvents = [...storedEvents, newEvent];
    localStorage.setItem(key, JSON.stringify(updatedEvents));
    
    setEvents(updatedEvents);
    setEventText('');
    setSelectedGenre('');
    generateCalendar(year, month);
  }, [eventText, selectedGenre, genres]);

  const handleDeleteEvent = useCallback((index, dayNumber, year, month) => {
    const key = `${year}-${month + 1}-${dayNumber}`;
    const updatedEvents = events.filter((_, i) => i !== index);

    if (updatedEvents.length === 0) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(updatedEvents));
    }

    setEvents(updatedEvents);
    generateCalendar(year, month);
  }, [events]);

  return (
    <div>
      <h1>Calendar</h1>
        <div className='contentArea'>
          <div className='calendarArea'>
            <div className='calendarNavi'>
              <button className='prevMonth' onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}>前月</button>
              <div>
                <h2>                
                  {monthDisplay}
                </h2>
              </div>
              <button className='nextMonth' onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}>翌月</button>
            </div>
            
            {/* Weekdays and Days grid combined */}
            <div className='calendarTable'>
              {weekdays.map((weekday, index) => (
                <div className='weekDay'>
                  {weekday}
                </div>
              ))}
              {days.map((dayData, index) => (
                <div
                  key={index}
                  className={`day ${selectedDay === dayData?.day ? "selected-day" : ""}`}
                  onClick={() => dayData && handleDayClick(dayData.day, currentDate.getFullYear(), currentDate.getMonth())}
                  >
                  {dayData ? (
                    <>
                      {dayData.day}
                      <br />
                      <span className='dayMark'> {dayData.hasEvent ? "◯" : ""} </span>
                    </>
                  ) : null}
                </div>
            ))}
            </div>

          </div>

          <div className='scheduleArea'>
            {selectedDay !== null && (
              <div style={{ marginTop: '20px' }}>
                  <div className='schedEditArea'>
                    <h2>{currentDate.getMonth() + 1}月{selectedDay}日の予定</h2>
                    <div className='genreSelect'>
                      <label>Genre:</label>
                      <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
                        <option value="">Select Genre</option>
                        {Object.keys(genres).map((genre, index) => (
                          <option key={index} value={genre}>{genre}</option>
                        ))}
                      </select>
                      <textarea value={eventText} onChange={(e) => setEventText(e.target.value)} placeholder="Enter Schedule" rows="4" />
                      <button onClick={() => handleSaveEvent(selectedDay, currentDate.getFullYear(), currentDate.getMonth())}>Save</button>
                    </div>
                  </div>
                  
                  <div className='addedSched'>
                    <h3>予定:</h3>
                      {events.map((event, index) => (
                        <div className='addedSchedList' key={index} style={{ backgroundColor: event.color }}>
                          <p>{event.text}</p>
                            <AiOutlineDelete className='delete-icon2' onClick={() => handleDeleteEvent(index, selectedDay, currentDate.getFullYear(), currentDate.getMonth())}/>
                        </div>
                      ))}
                  </div>

              </div>
            )}
          </div>

        </div>

    </div>
  );
}

export default Calendar;