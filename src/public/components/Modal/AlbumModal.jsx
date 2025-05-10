import React, { useEffect, useState } from 'react';

const AlbumModal = ({ album, onClose, onTrackClick }) => {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!album) return;

        const fetchAlbumTracks = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`http://localhost:5000/albumRouter/${album.id}/tracks`);
                if (!res.ok) throw new Error('Failed to fetch album tracks');
                const data = await res.json();
                setTracks(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAlbumTracks();
    }, [album]);

    if (!album) return null;

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-md  flex justify-center items-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-red-500"
                    aria-label="Close modal"
                    title="Close"
                >
                    ×
                </button>

                <h2 className="text-white text-3xl mb-4">{album.title}</h2>

                <img
                    src={'../../../static/images/' + album.picture}
                    alt={album.title}
                    className="w-full max-w-md mx-auto rounded mb-6 object-cover"
                />

                {loading && <p className="text-gray-400 text-center">Loading tracks...</p>}
                {error && <p className="text-red-500 text-center">{error}</p>}

                {!loading && !error && (
                    tracks.length === 0 ? (
                        <p className="text-gray-400 text-center">No tracks found in this album.</p>
                    ) : (
                        <div className="space-y-4">
                            {tracks.map(track => (

                                <div
                                    key={track.id}
                                    className="bg-gray-700 rounded p-3 cursor-pointer hover:bg-gray-600 flex items-center"
                                    onClick={() => onTrackClick(track)}
                                >
                                    <img
                                        src={'../../../static/images/' + track.picture}
                                        alt={track.title}
                                        className="w-16 h-16 object-cover rounded mr-4"
                                    />
                                    <div>
                                        <h3 className="text-white font-semibold">{track.title}</h3>
                                        <p className="text-gray-400 text-sm">
                                            {track.Artists && track.Artists.length > 0
                                                ? track.Artists.map(a => a.name).join(', ')
                                                : 'Unknown Artist'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default AlbumModal;