import React, { useState, useEffect } from 'react';

const CreateAlbumModal = ({ onClose, onCreated }) => {
    const [title, setTitle] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [picture, setPicture] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [genres, setGenres] = useState('');
    const [artistIds, setArtistIds] = useState('');
    const [trackIds, setTrackIds] = useState('');

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

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert('Please fill in the album title');
            return;
        }

        const genreIdsArray = genres
            .split(',')
            .map((id) => id.trim())
            .filter(Boolean)
            .map(Number);

        const artistIdsArray = artistIds
            .split(',')
            .map((id) => id.trim())
            .filter(Boolean)
            .map(Number);

        const trackIdsArray = trackIds
            .split(',')
            .map((id) => id.trim())
            .filter(Boolean)
            .map(Number);

        const formData = new FormData();
        formData.append('title', title.trim());
        if (releaseDate) {
            formData.append('release_date', releaseDate);
        }
        if (picture) {
            formData.append('picture', picture);
        }
        formData.append('genreIds', JSON.stringify(genreIdsArray));
        formData.append('artistIds', JSON.stringify(artistIdsArray));
        formData.append('trackIds', JSON.stringify(trackIdsArray));

        try {
            const res = await fetch('http://localhost:5000/albumRouter/albums', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || 'Failed to create album');
            }

            const newAlbum = await res.json();

            alert('Album created successfully!');
            onCreated(newAlbum);
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

                <h2 className="text-xl font-semibold mb-4">Create Album</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded text-black"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Release Date</label>
                        <input
                            type="date"
                            value={releaseDate}
                            onChange={(e) => setReleaseDate(e.target.value)}
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

                    <div>
                        <label className="block text-gray-700 mb-1">Genres (IDs, comma-separated)</label>
                        <input
                            type="text"
                            value={genres}
                            onChange={(e) => setGenres(e.target.value)}
                            placeholder="e.g. 1, 2, 3"
                            className="w-full p-2 border border-gray-300 rounded text-black"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Artist IDs (comma-separated)</label>
                        <input
                            type="text"
                            value={artistIds}
                            onChange={(e) => setArtistIds(e.target.value)}
                            placeholder="e.g. 4, 5, 6"
                            className="w-full p-2 border border-gray-300 rounded text-black"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Track IDs (comma-separated)</label>
                        <input
                            type="text"
                            value={trackIds}
                            onChange={(e) => setTrackIds(e.target.value)}
                            placeholder="e.g. 7, 8, 9"
                            className="w-full p-2 border border-gray-300 rounded text-black"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                    >
                        Create Album
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateAlbumModal;