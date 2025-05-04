import React, { useState } from 'react';

const UpdateGenreModal = ({ genre, onClose, onUpdated }) => {
    const [name, setName] = useState(genre.name);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedGenre = { id: genre.id, name };

        try {
            const response = await fetch(`http://localhost:5000/genreRouter/genres/${updatedGenre.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedGenre),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error('Failed to update genre: ' + errorText);
            }

            const updatedData = await response.json();
            onUpdated(updatedData);
            onClose();
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-md z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
                <button
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold"
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    ×
                </button>

                <h2 className="text-xl font-semibold mb-4">Update Genre</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1">Genre Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded text-black"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        Update Genre
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateGenreModal;