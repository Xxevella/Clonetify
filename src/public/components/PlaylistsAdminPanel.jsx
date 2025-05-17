import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import UpdatePlaylistModal from "../pages/AdminPanel/Playlists/UpdatePlaylistModal.jsx";
import CreatePlaylistModal from "../pages/AdminPanel/Playlists/CreatePlaylistModal.jsx";

const PlaylistsAdminPanel = () => {
    const [editingPlaylist, setEditingPlaylist] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [filteredPlaylists, setFilteredPlaylists] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [playlistToDelete, setPlaylistToDelete] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPlaylists();
    }, []);

    useEffect(() => {
        const filtered = playlists.filter(pl =>
            pl.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPlaylists(filtered);
    }, [searchTerm, playlists]);

    const fetchPlaylists = async () => {
        try {
            const response = await fetch(`http://localhost:5000/playlistRouter/playlists`);
            const data = await response.json();
            setPlaylists(data || []);
            setFilteredPlaylists(data || []);
        } catch (error) {
            console.error('Error fetching playlists:', error);
            setError('Failed to fetch playlists');
        }
    };

    const handleAddPlaylist = () => {
        navigate('/add-playlist');
    };

    const handleDeletePlaylist = (id) => {
        setPlaylistToDelete(id);
        setConfirmDelete(true);
    };


    const confirmDeletion = async () => {
        try {
            const response = await fetch(`http://localhost:5000/playlistRouter/playlists/${playlistToDelete}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error('Failed to delete playlist: ' + errorText);
            }

            setPlaylists(playlists.filter(pl => pl.id !== playlistToDelete));
            setFilteredPlaylists(filteredPlaylists.filter(pl => pl.id !== playlistToDelete));
            alert('Playlist deleted successfully.');
        } catch (error) {
            console.error('Error during deletion:', error);
            alert('Error deleting playlist: ' + error.message);
        } finally {
            setConfirmDelete(false);
            setPlaylistToDelete(null);
        }
    };

    const handleUpdatePlaylist = (playlist) => {
        setEditingPlaylist(playlist);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
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
                    Add Playlist
                </button>
                <div className="ml-4 relative">
                    <input
                        type="text"
                        placeholder="Search by playlist name..."
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
                    <th className="py-2 px-4 border border-gray-600 text-left">Name</th>
                    <th className="py-2 px-4 border border-gray-600 text-left">Picture</th>
                    <th className="py-2 px-4 border border-gray-600 text-left">User ID</th>
                    <th className="py-2 px-4 border border-gray-600 text-left">Created At</th>
                    <th className="py-2 px-4 border border-gray-600 text-left">Updated At</th>
                    <th className="py-2 px-4 border border-gray-600 text-left">Actions</th>
                </tr>
                </thead>

                <tbody>
                {filteredPlaylists.length > 0 ? (
                    filteredPlaylists.map(pl => (
                        <tr key={pl.id}>
                            <td className="py-2 px-4 border border-gray-600">{pl.id}</td>
                            <td className="py-2 px-4 border border-gray-600">{pl.name}</td>

                            <td className="py-2 px-4 border border-gray-600">
                                {pl.picture ? (
                                    <img
                                        src={`../../../static/images/${pl.picture}`}
                                        alt={pl.name}
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                ) : (
                                    '-'
                                )}
                            </td>

                            <td className="py-2 px-4 border border-gray-600">{pl.user_id}</td>

                            <td className="py-2 px-4 border border-gray-600">{new Date(pl.createdAt).toLocaleString()}</td>
                            <td className="py-2 px-4 border border-gray-600">{new Date(pl.updatedAt).toLocaleString()}</td>
                            <td className="py-2 px-4 border border-gray-600">
                                <button onClick={() => handleUpdatePlaylist(pl)} className="mx-1 bg-yellow-500 text-white rounded px-2 cursor-pointer">Update</button>
                                <button onClick={() => handleDeletePlaylist(pl.id)} className="mx-1 bg-red-500 text-white rounded px-2 cursor-pointer">Delete</button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="7" className="py-2 px-4 text-center border border-gray-600">No playlists found</td>
                    </tr>
                )}
                </tbody>
            </table>
            {confirmDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-1/3">
                        <h2 className="text-lg font-bold mb-4 text-black">Confirm Deletion</h2>
                        <p className="text-black">Are you sure you want to delete this playlist?</p>
                        <div className="mt-4 flex justify-end">
                            <button onClick={() => setConfirmDelete(false)} className="mr-2 p-2 bg-gray-300 rounded">Cancel</button>
                            <button onClick={confirmDeletion} className="p-2 bg-red-500 text-white rounded">Delete</button>
                        </div>
                    </div>
                </div>
            )}
            {isCreateModalOpen && (
                <CreatePlaylistModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreated={() => {
                        setIsCreateModalOpen(false);
                        fetchPlaylists();
                    }}
                />
            )}
            {editingPlaylist && (
                <UpdatePlaylistModal
                    playlist={editingPlaylist}
                    onClose={() => setEditingPlaylist(null)}
                    onUpdated={() => {
                        fetchPlaylists();
                        setEditingPlaylist(null);
                    }}
                />
            )}

        </div>
    );
};

export default PlaylistsAdminPanel;