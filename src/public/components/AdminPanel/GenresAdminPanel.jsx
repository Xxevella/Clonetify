import React, { useEffect, useState } from 'react';
import AddGenreModal from '../../pages/AdminPanel/Genres/AddGenreModal.jsx';
import UpdateGenreModal from '../../pages/AdminPanel/Genres/UpdateGenreModal.jsx';

const GenresAdminPanel = () => {
    const [genres, setGenres] = useState([]);
    const [filteredGenres, setFilteredGenres] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingGenre, setEditingGenre] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [genreToDelete, setGenreToDelete] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchGenres();
    }, []);

    useEffect(() => {
        const filtered = genres.filter(genre =>
            genre.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredGenres(filtered);
    }, [searchTerm, genres]);

    const fetchGenres = async () => {
        try {
            const response = await fetch('http://localhost:5000/genreRouter/genres');
            if (!response.ok) throw new Error('Failed to fetch genres');
            const data = await response.json();
            setGenres(data);
            setFilteredGenres(data);
        } catch (error) {
            console.error('Error fetching genres:', error);
            setError('Failed to fetch genres');
        }
    };

    const handleDeleteGenre = (id) => {
        setGenreToDelete(id);
        setConfirmDelete(true);
    };

    const confirmDeletion = async () => {
        try {
            const response = await fetch(`http://localhost:5000/genreRouter/genres/${genreToDelete}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error('Failed to delete genre: ' + errorText);
            }

            setGenres(prev => prev.filter(genre => genre.id !== genreToDelete));
            setFilteredGenres(prev => prev.filter(genre => genre.id !== genreToDelete));
            alert('Genre deleted successfully.');
        } catch (error) {
            console.error('Error during deletion:', error);
            alert('Error deleting genre: ' + error.message);
        } finally {
            setConfirmDelete(false);
            setGenreToDelete(null);
        }
    };

    const handleUpdateGenre = (genre) => {
        setEditingGenre(genre);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCreated = (newGenre) => {
        setGenres(prev => [...prev, newGenre]);
        setFilteredGenres(prev => [...prev, newGenre].filter(genre =>
            genre.name.toLowerCase().includes(searchTerm.toLowerCase())
        ));
        setIsCreateModalOpen(false);
    };

    const handleUpdated = (updatedGenre) => {
        setGenres(prev => {
            const updated = prev.map(genre => (genre.id === updatedGenre.id ? updatedGenre : genre));
            setFilteredGenres(updated.filter(genre =>
                genre.name.toLowerCase().includes(searchTerm.toLowerCase())
            ));
            return updated;
        });
        setEditingGenre(null);
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
                    Add Genre
                </button>
                <div className="ml-4 relative">
                    <input
                        type="text"
                        placeholder="Search by genre name..."
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
                    <th className="py-2 px-4 border border-gray-600 text-left">Actions</th>
                </tr>
                </thead>

                <tbody>
                {filteredGenres.length > 0 ? (
                    filteredGenres.map(genre => (
                        <tr key={genre.id}>
                            <td className="py-2 px-4 border border-gray-600">{genre.id}</td>
                            <td className="py-2 px-4 border border-gray-600">{genre.name}</td>
                            <td className="py-2 px-4 border border-gray-600">
                                <button
                                    onClick={() => handleUpdateGenre(genre)}
                                    className="mx-1 bg-yellow-500 text-white rounded px-2 cursor-pointer"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => handleDeleteGenre(genre.id)}
                                    className="mx-1 bg-red-500 text-white rounded px-2 cursor-pointer"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="3" className="py-2 px-4 text-center border border-gray-600">No genres found</td>
                    </tr>
                )}
                </tbody>
            </table>

            {confirmDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-1/3">
                        <h2 className="text-lg font-bold mb-4 text-black">Confirm Deletion</h2>
                        <p className="text-black">Are you sure you want to delete this genre?</p>
                        <div className="mt-4 flex justify-end">
                            <button onClick={() => setConfirmDelete(false)} className="mr-2 p-2 bg-gray-300 rounded">Cancel</button>
                            <button onClick={confirmDeletion} className="p-2 bg-red-500 text-white rounded">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {isCreateModalOpen && (
                <AddGenreModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onAdded={handleCreated}
                />
            )}

            {editingGenre && (
                <UpdateGenreModal
                    genre={editingGenre}
                    onClose={() => setEditingGenre(null)}
                    onUpdated={handleUpdated}
                />
            )}
        </div>
    );
};

export default GenresAdminPanel;