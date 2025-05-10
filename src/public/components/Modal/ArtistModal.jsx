import React, { useEffect, useState } from 'react';

const ArtistModal = ({ artist, onClose, onTrackClick }) => {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!artist) return;

        const fetchArtistTracks = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`http://localhost:5000/artistRouter/${artist.id}/tracks`);
                if (!res.ok) throw new Error('Failed to fetch artist tracks');
                const data = await res.json();
                setTracks(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchArtistTracks();
    }, [artist]);

    if (!artist) return null;

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-md flex justify-center items-center z-50">
            <div className="bg-gray-900 rounded-lg p-6 w-11/12 max-w-3xl max-h-[80vh] overflow-y-auto relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-red-500"
                    aria-label="Close modal"
                    title="Close"
                >
                    ×
                </button>

                <h2 className="text-white text-3xl mb-4">{artist.name}</h2>

                {loading && <p className="text-gray-400">Loading tracks...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && (
                    tracks.length === 0 ? (
                        <p className="text-gray-400">No tracks found for this artist.</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {tracks.map(track => (
                                <div
                                    key={track.id}
                                    className="bg-gray-700 rounded p-2 cursor-pointer hover:bg-gray-600"
                                    onClick={() => onTrackClick(track)}  // Воспроизведение трека при клике
                                >
                                    <img
                                        src={'../../../static/images/' + track.picture}
                                        alt={track.title}
                                        className="w-full h-32 object-cover rounded mb-2"
                                    />
                                    <h3 className="text-white font-semibold">{track.title}</h3>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default ArtistModal;