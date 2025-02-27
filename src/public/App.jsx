import { useEffect, useState } from 'react';
import './App.css';
import Header from "./components/Header.jsx";

function App() {
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5000/trackRouter/tracks`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((data) => {
                console.log('Fetched tracks:', data);
                setTracks(data);
            })
            .catch((error) => console.error('Error fetching tracks:', error));
    }, []);

    return (
        <div className='h-screen bg-pink-400'>
            <div className='h-[5%] flex'>
                <Header />
            </div>
            <div className='h-[95%] p-4'>
                <h1 className="text-white">Список треков</h1>
                <ul className="text-white">
                    {tracks.map(track => (
                        <li key={track.id} className="py-2">
                            {track.title} - {track.album}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;