import React, { useState, useEffect } from 'react';

const CreateTrackModal = ({ onClose, onCreated }) => {
    const [title, setTitle] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [picture, setPicture] = useState(null);
    const [audio, setAudio] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [artistIds, setArtistIds] = useState('');
    const [genres, setGenres] = useState('');
    const [albumId, setAlbumId] = useState('');

    const handlePictureChange = (e) => {
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

    const handleAudioChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'audio/mpeg') { // MP3 files
            setAudio(file);
        } else {
            alert('Please select an MP3 file.');
            e.target.value = null;
            setAudio(null);
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
            alert('Please fill in the track title');
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

        const formData = new FormData();
        formData.append('title', title.trim());
        if (releaseDate) {
            formData.append('releaseDate', releaseDate); // Ensure correct key
        }
        if (picture) {
            formData.append('picture', picture);
        }
        if (audio) {
            formData.append('audio', audio);
        }
        formData.append('genre_ids', JSON.stringify(genreIdsArray)); // Ensure correct key
        formData.append('artist_ids', JSON.stringify(artistIdsArray)); // Ensure correct key
        if (albumId) {
            formData.append('album_id', albumId); // Correctly send album_id
        }

        try {
            const res = await fetch('http://localhost:5000/trackRouter/tracks', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || 'Failed to create track');
            }

            const newTrack = await res.json();

            alert('Track created successfully!');
            onCreated(newTrack);
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

                <h2 className="text-xl font-semibold mb-4">Create Track</h2>
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
                            onChange={handlePictureChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Audio File (MP3 only)</label>
                        <input
                            type="file"
                            accept="audio/mpeg"
                            onChange={handleAudioChange}
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
                        <label className="block text-gray-700 mb-1">Optional Album ID</label>
                        <input
                            type="text"
                            value={albumId}
                            onChange={(e) => setAlbumId(e.target.value)}
                            placeholder="e.g. 7"
                            className="w-full p-2 border border-gray-300 rounded text-black"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                    >
                        Create Track
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateTrackModal;