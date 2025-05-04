import React, { useEffect, useState } from 'react';
import UpdateAlbumModal from "../../pages/AdminPanel/Albums/UpdateAlbumModal.jsx";
import CreateAlbumModal from "../../pages/AdminPanel/Albums/CreateAlbumModal.jsx";

const AlbumsAdminPanel = () => {
    const [editingAlbum, setEditingAlbum] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [albums, setAlbums] = useState([]);
    const [filteredAlbums, setFilteredAlbums] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [albumToDelete, setAlbumToDelete] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAlbums();
    }, []);

    useEffect(() => {
        const filtered = albums.filter(album =>
            album.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredAlbums(filtered);
    }, [searchTerm, albums]);

    const fetchAlbums = async () => {
        try {
            const response = await fetch(`http://localhost:5000/albumRouter/albums`);
            if (!response.ok) throw new Error('Failed to fetch albums');
            const data = await response.json();

            setAlbums(data.rows || []);
            setFilteredAlbums(data.rows || []);
        } catch (error) {
            console.error('Error fetching albums:', error);
            setError('Failed to fetch albums');
        }
    };

    const handleDeleteAlbum = (id) => {
        setAlbumToDelete(id);
        setConfirmDelete(true);
    };

    const confirmDeletion = async () => {
        try {
            const response = await fetch(`http://localhost:5000/albumRouter/albums/${albumToDelete}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error('Failed to delete album: ' + errorText);
            }

            setAlbums(prev => prev.filter(al => al.id !== albumToDelete));
            setFilteredAlbums(prev => prev.filter(al => al.id !== albumToDelete));
            alert('Album deleted successfully.');
        } catch (error) {
            console.error('Error during deletion:', error);
            alert('Error deleting album: ' + error.message);
        } finally {
            setConfirmDelete(false);
            setAlbumToDelete(null);
        }
    };

    const handleUpdateAlbum = (album) => {
        setEditingAlbum(album);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Колбеки при создании и обновлении для локального обновления списка
    const handleCreated = (newAlbum) => {
        setAlbums(prev => {
            const updated = [...prev, newAlbum];
            setFilteredAlbums(updated.filter(al =>
                al.name.toLowerCase().includes(searchTerm.toLowerCase())
            ));
            return updated;
        });
        setIsCreateModalOpen(false);
    };

    const handleUpdated = (updatedAlbum) => {
        setAlbums(prev => {
            const updated = prev.map(al => al.id === updatedAlbum.id ? updatedAlbum : al);
            setFilteredAlbums(updated.filter(al =>
                al.name.toLowerCase().includes(searchTerm.toLowerCase())
            ));
            return updated;
        });
        setEditingAlbum(null);
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
                    Add Album
                </button>
                <div className="ml-4 relative">
                    <input
                        type="text"
                        placeholder="Search by album name..."
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
                {filteredAlbums.length > 0 ? (
                    filteredAlbums.map(al => (
                        <tr key={al.id}>
                            <td className="py-2 px-4 border border-gray-600">{al.id}</td>
                            <td className="py-2 px-4 border border-gray-600">{al.name}</td>

                            <td className="py-2 px-4 border border-gray-600">
                                {al.picture ? (
                                    <img
                                        src={`../../../static/images/${al.picture}`}
                                        alt={al.name}
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                ) : (
                                    '-'
                                )}
                            </td>

                            <td className="py-2 px-4 border border-gray-600">{al.user_id}</td>

                            <td className="py-2 px-4 border border-gray-600">{new Date(al.createdAt).toLocaleString()}</td>
                            <td className="py-2 px-4 border border-gray-600">{new Date(al.updatedAt).toLocaleString()}</td>
                            <td className="py-2 px-4 border border-gray-600">
                                <button onClick={() => handleUpdateAlbum(al)} className="mx-1 bg-yellow-500 text-white rounded px-2 cursor-pointer">Update</button>
                                <button onClick={() => handleDeleteAlbum(al.id)} className="mx-1 bg-red-500 text-white rounded px-2 cursor-pointer">Delete</button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="7" className="py-2 px-4 text-center border border-gray-600">No albums found</td>
                    </tr>
                )}
                </tbody>
            </table>

            {confirmDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-1/3">
                        <h2 className="text-lg font-bold mb-4 text-black">Confirm Deletion</h2>
                        <p className="text-black">Are you sure you want to delete this album?</p>
                        <div className="mt-4 flex justify-end">
                            <button onClick={() => setConfirmDelete(false)} className="mr-2 p-2 bg-gray-300 rounded">Cancel</button>
                            <button onClick={confirmDeletion} className="p-2 bg-red-500 text-white rounded">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {isCreateModalOpen && (
                <CreateAlbumModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreated={handleCreated}
                />
            )}

            {editingAlbum && (
                <UpdateAlbumModal
                    album={editingAlbum}
                    onClose={() => setEditingAlbum(null)}
                    onUpdated={handleUpdated}
                />
            )}

        </div>
    );
};

export default AlbumsAdminPanel;