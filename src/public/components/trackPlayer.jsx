import React, { useState, useEffect, useRef } from 'react';
import { assets } from "../assets/assets.js";

const TrackPlayer = ({
                         track,
                         onPlay,
                         onPause,
                         onNext,
                         onPrevious,
                         currentTime,
                         duration,
                         onVolumeChange,
                         volume,
                         onSeek,
                         isPlaying,
                         playlists,
                         onAddToPlaylist,
                         onAddToFavorites,
                     }) => {
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    const handleSeek = (e) => {
        const seekTime = (e.target.value / 100) * duration;
        onSeek(seekTime);
    };

    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleAddToPlaylist = (playlistId) => {
        onAddToPlaylist(track, playlistId);
        setShowDropdown(false);
    };

    const handleAddToFavorites = () => {
        onAddToFavorites(track);
        setShowDropdown(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    return (
        <div className="track-player bg-gray-800 p-4 flex items-center justify-between fixed bottom-0 left-0 right-0">
            <div className="flex items-center">
                <img
                    src={track ? `../../../static/images/${track.picture}` : '../../../tracksPic/default.png'}
                    alt={track ? track.title : 'No track selected'}
                    className="w-16 h-16 rounded"
                />
                <div className="ml-4 flex items-center relative">
                    <h2 className="text-white text-lg truncate w-48">{track.title}</h2>
                    <img
                        src={assets.plus_icon}
                        alt="Add to Playlist"
                        className="w-4 h-4 ml-2 cursor-pointer"
                        onClick={toggleDropdown}
                    />
                    {showDropdown && (
                        <div
                            ref={dropdownRef}
                            className="absolute bg-gray-700 rounded shadow-lg z-50"
                            style={{
                                bottom: '100%',
                                left: 0,
                                marginBottom: '8px',
                                minWidth: '160px',
                            }}
                        >
                            <div
                                className="p-2 cursor-pointer hover:bg-gray-600"
                                onClick={handleAddToFavorites}
                            >
                                Liked Songs
                            </div>
                            {playlists.map(playlist => (
                                <div
                                    key={playlist.id}
                                    className="p-2 cursor-pointer hover:bg-gray-600"
                                    onClick={() => handleAddToPlaylist(playlist.id)}
                                >
                                    {playlist.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-col items-center mx-4 mr-45">
                <div className="flex space-x-4 items-center">
                    <img src={assets.prev_icon} onClick={onPrevious} className="text-white w-4 h-4 cursor-pointer" />
                    {isPlaying ? (
                        <img src={assets.pause_icon} onClick={onPause} className="text-white w-4 h-4 cursor-pointer" />
                    ) : (
                        <img src={assets.play_icon} onClick={onPlay} className="text-white w-4 h-4 cursor-pointer" />
                    )}
                    <img src={assets.next_icon} onClick={onNext} className="text-white w-4 h-4 cursor-pointer" />
                </div>
                <div className="flex items-center mt-2">
                    <span className="text-gray-400">{formatTime(currentTime)}</span>
                    <input
                        type="range"
                        value={(currentTime / duration) * 100 || 0}
                        onChange={handleSeek}
                        className="mx-2"
                    />
                    <span className="text-gray-400">{formatTime(duration - currentTime)}</span>
                </div>
            </div>
            <div className="flex items-center">
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => onVolumeChange(e.target.value)}
                    className="volume-slider"
                />
            </div>
        </div>
    );
};

export default TrackPlayer;