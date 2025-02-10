import { useState, useEffect } from "react";
import "../css/journal.css";

function Journal() {
    const [entries, setEntries] = useState({});
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // 現在の月
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // 現在の年
    const [image, setImage] = useState(null); // 写真を保存する状態

    // ローカルストレージからデータを取得
    useEffect(() => {
        const savedEntries = JSON.parse(localStorage.getItem("journalEntries")) || {};
        setEntries(savedEntries);
    }, []);

    // ローカルストレージにデータを保存
    useEffect(() => {
        if (Object.keys(entries).length > 0) {
            localStorage.setItem("journalEntries", JSON.stringify(entries));
        }
    }, [entries]);

    // 新しい日記を追加
    const addEntry = () => {
        if (!title.trim() || !content.trim()) return;

        const newEntry = { title, content, date: new Date().toLocaleDateString(), image };

        const updatedEntries = { ...entries };
        if (!updatedEntries[selectedDate]) {
            updatedEntries[selectedDate] = [];
        }
        updatedEntries[selectedDate].push(newEntry);

        setEntries(updatedEntries);
        setTitle("");
        setContent("");
        setImage(null); // 写真をリセット
    };

    // 日記を削除
    const deleteEntry = (date, index) => {
        const updatedEntries = { ...entries };
        updatedEntries[date].splice(index, 1);
        if (updatedEntries[date].length === 0) {
            delete updatedEntries[date]; // 空の配列を削除
        }
        setEntries(updatedEntries);
    };

    // 日付を選択したときにエントリを表示
    const handleDateClick = (date) => {
        setSelectedDate(date);
    };

    // 前月へ移動
    const goToPreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11); // 12月に戻る
            setCurrentYear(currentYear - 1); // 年を1つ減らす
        } else {
            setCurrentMonth(currentMonth - 1); // 月を1つ減らす
        }
    };

    // 次月へ移動
    const goToNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0); // 1月に進む
            setCurrentYear(currentYear + 1); // 年を1つ増やす
        } else {
            setCurrentMonth(currentMonth + 1); // 月を1つ進める
        }
    };

    // 画像を選択したときの処理
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result); // 画像をbase64で保存
            };
            reader.readAsDataURL(file);
        }
    };

    // カレンダーをレンダリング（曜日も含めて）
    const renderCalendar = () => {
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();

        // 曜日名を定義
        const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

        // 月の最初の日の曜日を求める
        const startDay = firstDayOfMonth.getDay();

        // カレンダーを作成
        const calendarDays = [];
        let dayCounter = 1;

        // 1行目（曜日の表示）
        calendarDays.push(
            <tr key="header">
                {weekdays.map((weekday, index) => (
                    <th key={index} className="p-2 text-center">{weekday}</th>
                ))}
            </tr>
        );

        // 2行目以降（実際の日付）
        for (let row = 0; row < 6; row++) {
            const daysInRow = [];
            for (let col = 0; col < 7; col++) {
                if (row === 0 && col < startDay) {
                    daysInRow.push(<td key={col}></td>); // 最初の行の空のセル
                } else if (dayCounter <= daysInMonth) {
                    const day = new Date(currentYear, currentMonth, dayCounter).toLocaleDateString();
                    daysInRow.push(
                        <td key={col} className={`p-2 text-center ${day === selectedDate ? "bg-blue-500 text-white cursor-pointer" : "cursor-pointer"}`} onClick={() => handleDateClick(day)}>
                            <span>{dayCounter}</span> {/* 日付を表示 */}
                        </td>
                    );
                    dayCounter++;
                }
            }
            calendarDays.push(<tr key={row}>{daysInRow}</tr>);
            if (dayCounter > daysInMonth) break;
        }

        return (
            <table className="table-auto w-full">
                <thead>{calendarDays[0]}</thead>
                <tbody>{calendarDays.slice(1)}</tbody>
            </table>
        );
    };

    return (
        <>
         <h1>Journal</h1>
            <div className="journal-container">
                <div className="calendarArea">
                        <div className="calendar-container">
                            <div className="calendar-Navi">
                                <button onClick={goToPreviousMonth} className="prevMonth">前月</button>
                                <h2 className="text-xl">{`${currentYear}年 ${currentMonth + 1}月`}</h2>
                                <button onClick={goToNextMonth} className="nextMonth">次月</button>
                            </div>
                            <div className="calendar-table">
                            {renderCalendar()}
                            </div>
                        </div>
                </div>

                <div className="entry-Area">
                            <h2>Write your Journal</h2>
                            <div className="Title">
                                <label>
                                    Journal Title
                                </label>
                                <input
                                    type="text"
                                    className="diary-Title"
                                    placeholder="Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="diary-entries">
                                <textarea
                                    placeholder=" Write your Entry"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                ></textarea>
                            </div>

                            {/* 写真のアップロード */}
                            <div className="uploadPhotoArea">
                                <label>Upload Photo</label>
                                <input
                                    type="file"
                                    id="imageUpload"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="imageUpload"
                                />
                                {image && <img src={image} alt="Selected" className="image-preview" />}                
                            </div>

                            <button
                                className="addEntry-btn"
                                onClick={addEntry}
                            >
                                Add
                            </button>
                </div>

                <div className="addedEntry-Container">
                    <h2 className="entryDate-header"> {selectedDate}</h2>
                    {entries[selectedDate] ? (
                        <ul>
                            {entries[selectedDate].map((entry, index) => (
                                <li key={index} className="entryList">
                                <h3>{entry.title}</h3>
                                {entry.image && <img src={entry.image} alt="Entry" className="imageSaved" />}

                                    <p>{entry.content}</p>
                                    {/* <small className="entryDate">{entry.date}</small> */}
                                            <button
                                                className="deleteEntryBtn"
                                                onClick={() => deleteEntry(selectedDate, index)}
                                            >
                                                Clear
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                        ) : (
                                <p>No Entries for today</p>
                    )}

                </div>
            </div>
        </>
    );
}

export default Journal;