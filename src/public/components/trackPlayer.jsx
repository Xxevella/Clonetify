import React from 'react';
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
                         isPlaying
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

    return (
        <div className="track-player bg-gray-800 p-4 flex items-center justify-between fixed bottom-0 left-0 right-0">
            <div className="flex items-center">
                <img src={"../../../static/images/" + track.picture} alt={track.title} className="w-16 h-16 rounded" />
                <div className="ml-4">
                    <h2 className="text-white text-lg">{track.title}</h2>
                    <p className="text-gray-400">{track.artist}</p>
                </div>
            </div>

            <div className="flex flex-col items-center mx-4">
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