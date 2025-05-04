import React, { useState } from 'react';

const CreatePlaylistModal = ({ onClose, onCreated }) => {
    const [userId, setUserId] = useState('');
    const [name, setName] = useState('');
    const [picture, setPicture] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'image/png') {
            setPicture(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        } else {
            alert('Please select a PNG file.');
            e.target.value = null;
            setPicture(null);
            setPreviewUrl(null);
        }
    };

    // Очистка URL при размонтировании
    React.useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId || !name) {
            alert('Please fill User ID and Name');
            return;
        }

        const formData = new FormData();
        formData.append('user_id', userId);
        formData.append('name', name);
        if (picture) {
            formData.append('picture', picture);
        }

        try {
            const res = await fetch('http://localhost:5000/playlistRouter/playlists', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || 'Failed to create playlist');
            }

            alert('Playlist created successfully!');
            onCreated();
            onClose();
        } catch (error) {
            alert('Error: ' + error.message);
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

                <h2 className="text-xl font-semibold mb-4">Create Playlist</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1">User ID</label>
                        <input
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded text-black"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded text-black"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Picture (PNG only)</label>
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-24 h-24 object-cover rounded mb-2"
                            />
                        ) : (
                            <p className="text-gray-500">No picture selected</p>
                        )}
                        <input
                            type="file"
                            accept="image/png"
                            onChange={handleFileChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                    >
                        Create Playlist
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePlaylistModal;