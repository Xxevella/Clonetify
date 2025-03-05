import React, {useEffect, useState} from 'react';

const Main = () => {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);

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
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching tracks:', error);
                setLoading(false);
            });
    }, []);

    return (
        <div className='min-h-screen bg-pink-400'>

        </div>
    );
};

export default Main;