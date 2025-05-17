import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import UpdateTrackModal from '../../pages/AdminPanel/Tracks/UpdateTrackModal.jsx';
import CreateTrackModal from '../../pages/AdminPanel/Tracks/CreateTrackModal.jsx';

const TracksArtistPanel = () => {
    const loggedInArtistId = useSelector(state => state.user.id);
    const [editingTrack, setEditingTrack] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [tracks, setTracks] = useState([]);
    const [filteredTracks, setFilteredTracks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [trackToDelete, setTrackToDelete] = useState(null);
    const [error, setError] = useState(null);
    const audioPlayerRef = useRef(null);
    const [playingTrackId, setPlayingTrackId] = useState(null);

    useEffect(() => {
        fetchTracks();
    }, []);

    useEffect(() => {
        const filtered = tracks.filter(track =>
            track.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredTracks(filtered);
    }, [searchTerm, tracks]);

    const fetchTracks = async () => {
        try {
            const response = await fetch('http://localhost:5000/trackRouter/tracks');
            if (!response.ok) throw new Error('Failed to fetch tracks');
            const data = await response.json();

            console.log('Fetched tracks:', data);
            console.log('Logged-in artist ID:', loggedInArtistId);

            const artistTracks = data.filter(track =>
                track.Artists && track.Artists.some(artist => artist.User.id === loggedInArtistId)
            );

            console.log('Filtered tracks:', artistTracks);

            setTracks(artistTracks);
            setFilteredTracks(artistTracks);
        } catch (error) {
            console.error('Error fetching tracks:', error);
            setError('Failed to fetch tracks');
        }
    };

    const handleDeleteTrack = (id) => {
        setTrackToDelete(id);
        setConfirmDelete(true);
    };

    const confirmDeletion = async () => {
        try {
            const response = await fetch(`http://localhost:5000/trackRouter/tracks/${trackToDelete}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error('Failed to delete track: ' + errorText);
            }

            setTracks(prev => prev.filter(tr => tr.id !== trackToDelete));
            setFilteredTracks(prev => prev.filter(tr => tr.id !== trackToDelete));
            alert('Track deleted successfully.');
        } catch (error) {
            console.error('Error during deletion:', error);
            alert('Error deleting track: ' + error.message);
        } finally {
            setConfirmDelete(false);
            setTrackToDelete(null);
            stopAudio();
        }
    };

    const handleUpdateTrack = (track) => {
        setEditingTrack(track);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCreated = (newTrack) => {
        setTracks(prev => {
            const updated = [...prev, newTrack];
            setFilteredTracks(updated.filter(tr =>
                tr.title.toLowerCase().includes(searchTerm.toLowerCase())
            ));
            return updated;
        });
        setIsCreateModalOpen(false);
    };

    const handleUpdated = (updatedTrack) => {
        setTracks(prev => {
            const updated = prev.map(tr => tr.id === updatedTrack.id ? updatedTrack : tr);
            setFilteredTracks(updated.filter(tr =>
                tr.title.toLowerCase().includes(searchTerm.toLowerCase())
            ));
            return updated;
        });
        setEditingTrack(null);
        stopAudio();
    };

    const playAudio = (track) => {
        if (!track.audio) {
            alert('No audio file available for this track');
            return;
        }

        if (playingTrackId === track.id) {
            stopAudio();
            return;
        }

        if (audioPlayerRef.current) {
            audioPlayerRef.current.src = `/static/audio/${track.audio}`;
            audioPlayerRef.current.play();
            setPlayingTrackId(track.id);
        }
    };

    const stopAudio = () => {
        if (audioPlayerRef.current) {
            audioPlayerRef.current.pause();
            audioPlayerRef.current.currentTime = 0;
        }
        setPlayingTrackId(null);
    };

    const handleAudioEnded = () => {
        setPlayingTrackId(null);
    };

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return (
        <div>
            <div className="flex items-center mb-4">
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                    Add Track
                </button>
                <div className="ml-4 relative">
                    <input
                        type="text"
                        placeholder="Search by track title..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="p-2 rounded text-black w-64 border border-white"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>

            <table className="min-w-full bg-gray-800 border border-gray-600">
                <thead>
                <tr>
                    <th className="py-2 px-4 border border-gray-600 text-left">ID</th>
                    <th className="py-2 px-4 border border-gray-600 text-left">Title</th>
                    <th className="py-2 px-4 border border-gray-600 text-left">Picture</th>
                    <th className="py-2 px-4 border border-gray-600 text-left">Audio</th>
                    <th className="py-2 px-4 border border-gray-600 text-left">Release Date</th>
                    <th className="py-2 px-4 border border-gray-600 text-left">Artist IDs</th>
                    <th className="py-2 px-4 border border-gray-600 text-left">Album ID</th>
                    <th className="py-2 px-4 border border-gray-600 text-left">Genres</th>
                    <th className="py-2 px-4 border border-gray-600 text-left">Created At</th>
                    <th className="py-2 px-4 border border-gray-600 text-left">Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredTracks.length > 0 ? (
                    filteredTracks.map(tr => (
                        <tr key={tr.id}>
                            <td className="py-2 px-4 border border-gray-600">{tr.id}</td>
                            <td className="py-2 px-4 border border-gray-600">{tr.title}</td>
                            <td className="py-2 px-4 border border-gray-600">
                                {tr.picture ? (
                                    <img
                                        src={`/static/images/${tr.picture}`}
                                        alt={tr.title}
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                ) : '-'}
                            </td>
                            <td className="py-2 px-4 border border-gray-600 text-center">
                                <button
                                    onClick={() => playAudio(tr)}
                                    aria-label={playingTrackId === tr.id ? "Pause audio" : "Play audio"}
                                    className="text-white bg-blue-600 hover:bg-blue-700 rounded px-2 py-1 select-none"
                                >
                                    {playingTrackId === tr.id ? '⏸️' : '▶️'}
                                </button>
                            </td>
                            <td className="py-2 px-4 border border-gray-600">
                                {tr.releaseDate ? new Date(tr.releaseDate).toLocaleDateString() : '-'}
                            </td>
                            <td className="py-2 px-4 border border-gray-600">
                                {tr.Artists?.map(artist => artist.id).join(', ') || '-'}
                            </td>
                            <td className="py-2 px-4 border border-gray-600">{tr.album_id || '-'}</td>
                            <td className="py-2 px-4 border border-gray-600">
                                {tr.Genres?.map(genre => genre.name).join(', ') || '-'}
                            </td>
                            <td className="py-2 px-4 border border-gray-600">
                                {new Date(tr.createdAt).toLocaleString()}
                            </td>
                            <td className="py-2 px-4 border border-gray-600">
                                <button onClick={() => handleUpdateTrack(tr)} className="mx-1 bg-yellow-500 text-white rounded px-2 cursor-pointer">Update</button>
                                <button onClick={() => handleDeleteTrack(tr.id)} className="mx-1 bg-red-500 text-white rounded px-2 cursor-pointer">Delete</button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="10" className="py-2 px-4 text-center border border-gray-600">No tracks found</td>
                    </tr>
                )}
                </tbody>
            </table>

            <audio
                ref={audioPlayerRef}
                onEnded={handleAudioEnded}
                style={{ display: 'none' }}
            />

            {confirmDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-1/3">
                        <h2 className="text-lg font-bold mb-4 text-black">Confirm Deletion</h2>
                        <p className="text-black">Are you sure you want to delete this track?</p>
                        <div className="mt-4 flex justify-end">
                            <button onClick={() => setConfirmDelete(false)} className="mr-2 p-2 bg-gray-300 rounded">Cancel</button>
                            <button onClick={confirmDeletion} className="p-2 bg-red-500 text-white rounded">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {isCreateModalOpen && (
                <CreateTrackModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreated={handleCreated}
                />
            )}

            {editingTrack && (
                <UpdateTrackModal
                    track={editingTrack}
                    onClose={() => setEditingTrack(null)}
                    onUpdated={handleUpdated}
                />
            )}
        </div>
    );
};

export default TracksArtistPanel;