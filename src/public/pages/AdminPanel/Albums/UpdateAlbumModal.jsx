import React, { useState, useEffect } from 'react';

const UpdateAlbumModal = ({ album, onClose, onUpdated }) => {
    const [title, setTitle] = useState('');
    const [picture, setPicture] = useState(null);
    const [currentPictureUrl, setCurrentPictureUrl] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [genres, setGenres] = useState('');
    const [artistIds, setArtistIds] = useState('');
    const [trackIds, setTrackIds] = useState('');

    useEffect(() => {
        if (album) {
            setTitle(album.title || '');
            setPicture(null);
            setPreviewUrl(null);
            setCurrentPictureUrl(
                album.picture ? `../../../static/images/${album.picture}` : null
            );
            setGenres(album.Genres.map(genre => genre.id).join(', '));
            setArtistIds(album.Artists.map(artist => artist.id).join(', '));
            setTrackIds(album.Tracks.map(track => track.id).join(', '));
        }
    }, [album]);

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

        if (!title) {
            alert('Title is required');
            return;
        }

        try {
            // Подготовка данных
            const genreIdsArray = genres ? genres.split(',').map(id => parseInt(id.trim())) : [];
            const artistIdsArray = artistIds ? artistIds.split(',').map(id => parseInt(id.trim())) : [];
            const trackIdsArray = trackIds ? trackIds.split(',').map(id => parseInt(id.trim())) : [];

            const formData = new FormData();
            formData.append('title', title);
            if (picture) {
                formData.append('picture', picture);
            }
            formData.append('genreIds', JSON.stringify(genreIdsArray));
            formData.append('artistIds', JSON.stringify(artistIdsArray));
            formData.append('trackIds', JSON.stringify(trackIdsArray));

            const response = await fetch(`http://localhost:5000/albumRouter/albums/${album.id}`, {
                method: 'PUT',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update album');
            }

            const updatedAlbum = await response.json();
            onUpdated(updatedAlbum);
            onClose();
            alert('Album updated successfully!');
        } catch (error) {
            console.error('Error updating album:', error);
            alert(error.message || 'Failed to update album');
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

                <h2 className="text-xl font-semibold mb-4">Update Album</h2>
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
                        <label className="block text-gray-700 mb-1">Current Picture</label>
                        {(previewUrl || currentPictureUrl) ? (
                            <img
                                src={previewUrl || currentPictureUrl}
                                alt="Current"
                                className="w-24 h-24 object-cover rounded mb-2"
                            />
                        ) : (
                            <p className="text-gray-500">No picture uploaded</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">
                            Change Picture (PNG only)
                        </label>
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
                            required
                            className="w-full p-2 border border-gray-300 rounded text-black"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Artist IDs (comma-separated)</label>
                        <input
                            type="text"
                            value={artistIds}
                            onChange={(e) => setArtistIds(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded text-black"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Track IDs (comma-separated)</label>
                        <input
                            type="text"
                            value={trackIds}
                            onChange={(e) => setTrackIds(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded text-black"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        Update Album
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateAlbumModal;