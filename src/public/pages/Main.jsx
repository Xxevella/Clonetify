import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from "js-cookie";
import { setUser } from "../../redux/slices/userSlice.js";
import { selectTab } from "../../redux/slices/tabSlice.js";
import { setCurrentTrack, setTracks } from "../../redux/slices/tracksSlice.js";
import TrackPlayer from '../components/trackPlayer.jsx';
import { assets } from "../assets/assets.js";

const Main = () => {
    const dispatch = useDispatch();
    const [searchResults, setSearchResults] = useState([]);
    const selectedTab = useSelector((state) => state.tab.selectedTab);
    const userId = useSelector((state) => state.user.id);
    const tracks = useSelector((state) => state.tracks.tracks);

    const [user, setUserState] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [randomTracks, setRandomTracks] = useState([]);
    const currentTrack = useSelector(state => state.tracks.currentTrack);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(50);
    const audioRef = React.useRef(new Audio());
    const [currentTime, setCurrentTime] = useState(0);
    const [favorites, setFavorites] = useState([]);
    const [playlists, setPlaylists] = useState([]);

    const tabs = [
        { title: 'Favorites', icon: assets.likedSongs, count: favorites.length },
        ...playlists.map(pl => ({
            title: pl.name,
            icon: assets.likedSongs,
            count: pl.Tracks ? pl.Tracks.length : 0
        }))
    ];

    useEffect(() => {
        const storedUser = Cookies.get('auth');
        const storedVolume = Cookies.get('volume');
        const storedTrack = localStorage.getItem('currentTrack');

        if (storedUser) {
            const user = JSON.parse(storedUser);
            dispatch(setUser(user));
            setUserState(user);
        }

        if (storedVolume) {
            const volumeValue = parseInt(storedVolume, 10);
            setVolume(volumeValue);
            audioRef.current.volume = volumeValue / 100;
        }

        if (storedTrack) {
            const track = JSON.parse(storedTrack);
            dispatch(setCurrentTrack(track));
            audioRef.current.src = `../../../static/audio/${track.audio}`;
            setIsPlaying(true);
        }

        setLoading(false);
    }, [userId, dispatch]);

    useEffect(() => {
        fetch('http://localhost:5000/trackRouter/tracks')
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch tracks');
                }
                return res.json();
            })
            .then((data) => {
                dispatch(setTracks(data));
                setRandomTracks(getRandomTracks(data, 10));
            })
            .catch((error) => {
                console.error('Error fetching tracks:', error);
                setError('Failed to fetch tracks');
            });
    }, [dispatch]);

    const fetchFavorites = () => {
        if (userId) {
            fetch(`http://localhost:5000/trackRouter/favorites/${userId}`)
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch favorites');
                    return res.json();
                })
                .then(data => setFavorites(data))
                .catch(error => {
                    console.error('Error fetching favorites:', error);
                    setError('Failed to fetch favorites');
                });
        }
    };

    const fetchPlaylists = () => {
        if (userId) {
            fetch(`http://localhost:5000/playlistRouter/user/${userId}`)
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch playlists');
                    return res.json();
                })
                .then(data => setPlaylists(data))
                .catch(error => {
                    console.error('Error fetching playlists:', error);
                    setError('Failed to fetch playlists');
                });
        }
    };

    useEffect(() => {
        fetchFavorites();
        fetchPlaylists();
    }, [userId]);

    useEffect(() => {
        audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
        return () => {
            audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, []);

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    useEffect(() => {
        if (!selectedTab) {
            fetch('http://localhost:5000/playlistRouter/recs')
                .then((res) => {
                    if (!res.ok) {
                        throw new Error('Failed to fetch playlists');
                    }
                    return res.json();
                })
                .then((data) => {
                    setRecommendations(data);
                })
                .catch((error) => {
                    console.error('Error fetching playlists:', error);
                    setError('Failed to fetch playlists');
                });
        }
    }, [selectedTab]);

    const getRandomTracks = (tracks, num) => {
        if (tracks.length === 0) return [];
        const shuffledTracks = [...tracks].sort(() => 0.5 - Math.random());
        return shuffledTracks.slice(0, num);
    };

    const handleSeek = (time) => {
        audioRef.current.currentTime = time;
        dispatch(setCurrentTrack({ ...currentTrack, currentTime: time }));
    };

    const handleAddToFavorites = async (track) => {
        try {
            const response = await fetch('http://localhost:5000/trackRouter/favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    trackId: track.id,
                    userId: user.id,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add track to favorites');
            }

            fetchFavorites();
        } catch (error) {
            console.error('Error adding to favorites:', error);
        }
    };

    const handleAddToPlaylist = async (track, playlistId) => {
        try {
            const response = await fetch('http://localhost:5000/playlistRouter/addTrack', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    trackId: track.id,
                    playlistId,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add track to playlist');
            }

            fetchPlaylists();
        } catch (error) {
            console.error('Error adding to playlist:', error);
        }
    };

    const handlePause = () => {
        audioRef.current.pause();
        setIsPlaying(false);
    };

    const handlePlay = () => {
        audioRef.current.play();
        setIsPlaying(true);
    };

    const handleTrackClick = (track) => {
        audioRef.current.src = `../../../static/audio/${track.audio}`;
        audioRef.current.onloadedmetadata = () => {
            const duration = audioRef.current.duration;
            dispatch(setCurrentTrack({ ...track, duration }));
            localStorage.setItem('currentTrack', JSON.stringify({ ...track, duration })); // Сохраняем в localStorage
            audioRef.current.play();
            setIsPlaying(true);
        };
        audioRef.current.play();
    };

    const handleVolumeChange = (newVolume) => {
        setVolume(newVolume);
        audioRef.current.volume = newVolume / 100;
        Cookies.set('volume', newVolume);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    const renderContent = () => {
        if (selectedTab) {
            if (selectedTab === 'Favorites') {
                if (favorites.length === 0) {
                    return <div className="text-white">No favorite tracks found.</div>;
                }
                return (
                    <div>
                        <h2 className="text-white text-2xl mb-4">Your Favorite Tracks</h2>
                        <div className="flex flex-wrap">
                            {favorites.map((track) => (
                                <div
                                    key={track.id}
                                    className="flex flex-col items-center justify-between p-2 bg-gray-700 rounded mb-4 ml-6 cursor-pointer"
                                    onClick={() => handleTrackClick(track)}
                                >
                                    <img
                                        src={'../../../static/images/' + track.picture}
                                        alt={track.title}
                                        className="w-40 h-40 rounded mb-2"
                                    />
                                    <h3 className="text-white">{track.title}</h3>
                                    <div className="text-gray-400">
                                        {track.Artists && track.Artists.length > 0
                                            ? track.Artists.map((artist) => (
                                                <span key={artist.id}>{artist.name}{', '}</span>
                                            ))
                                            : 'Unknown Artist'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            }

            const playlist = playlists.find(pl => pl.name === selectedTab);
            if (playlist) {
                return (
                    <div>
                        <h2 className="text-white text-2xl mb-4">{playlist.name}</h2>
                        <p className="text-gray-400 mb-4">{`Playlist • ${playlist.Tracks.length} songs`}</p>
                        <div className="flex flex-wrap">
                            {playlist.Tracks.map((track) => (
                                <div
                                    key={track.id}
                                    className="flex flex-col items-center p-2 bg-gray-700 rounded mb-2 w-50 h-60 ml-10 cursor-pointer"
                                    onClick={() => handleTrackClick(track)}
                                >
                                    <img
                                        src={'../../../static/images/' + track.picture}
                                        alt={track.title}
                                        className="w-40 h-40 rounded mb-2"
                                    />
                                    <h3 className="text-white">{track.title}</h3>
                                    <div className="text-gray-400">
                                        {track.Artists && track.Artists.length > 0
                                            ? track.Artists.map((artist) => (
                                                <span key={artist.id}>{artist.name}{', '}</span>
                                            ))
                                            : 'Unknown Artist'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            }

            return <div className="text-white">Select a tab to see content</div>;
        } else {
            return (
                <div>
                    <h2 className="text-white text-2xl">Clonetify Recommendations</h2>
                    {recommendations.map((playlist) => (
                        <div key={playlist.id} className="p-4 bg-gray-800 rounded-lg mb-4">
                            <h2 className="text-white text-lg">{playlist.name}</h2>
                            <p className="text-gray-400">{`Playlist • ${playlist.Tracks.length} songs`}</p>
                            <div className="mt-2 flex flex-wrap">
                                {playlist.Tracks.map((track) => (
                                    <div
                                        key={track.id}
                                        className="flex flex-col items-center p-2 bg-gray-700 rounded mb-2 w-50 h-60 ml-10 cursor-pointer"
                                        onClick={() => handleTrackClick(track)}
                                    >
                                        <img
                                            src={'../../../static/images/' + track.picture}
                                            alt={track.title}
                                            className="w-40 h-40 rounded mb-2"
                                        />
                                        <h3 className="text-white">{track.title}</h3>
                                        <div className="text-gray-400">
                                            {track.Artists && track.Artists.length > 0
                                                ? track.Artists.map((artist) => (
                                                    <span key={artist.id}>{artist.name}{', '}</span>
                                                ))
                                                : 'Unknown Artist'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    <h2 className="text-white text-2xl">Random Tracks</h2>
                    <div className="flex flex-wrap">
                        {randomTracks.map((track) => (
                            <div
                                key={track.id}
                                className="flex flex-col items-center justify-between p-2 bg-gray-700 rounded mb-4 ml-6 cursor-pointer"
                                onClick={() => handleTrackClick(track)}
                            >
                                <img
                                    src={'../../../static/images/' + track.picture}
                                    alt={track.title}
                                    className="w-40 h-40 rounded mb-2"
                                />
                                <h3 className="text-white">{track.title}</h3>
                                <div className="text-gray-400">
                                    {track.Artists && track.Artists.length > 0
                                        ? track.Artists.map((artist) => (
                                            <span key={artist.id}>{artist.name}{', '}</span>
                                        ))
                                        : 'Unknown Artist'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="h-screen bg-gradient-to-b from-gray-700 to-black flex">
            <div className="w-1/5 bg-black p-4 overflow-y-auto">
                <h1 className="text-white text-2xl mb-4">Your Library</h1>
                {user ? (
                    <div>
                        <p className="text-white mb-4">Welcome back, {user.username}!</p>
                        <div className="space-y-2">
                            {tabs.map((tab, index) => (
                                <div
                                    key={index}
                                    className={`flex flex-row items-center p-4 rounded-lg transition-colors cursor-pointer ${
                                        selectedTab === tab.title ? 'bg-gray-700 text-white' : 'bg-gray-900 text-gray-400'
                                    }`}
                                    onClick={() => dispatch(selectTab(tab.title))}
                                >
                                    <img src={tab.icon} alt={tab.title} className="w-10 h-10 mr-4" />
                                    <div>
                                        <h2 className="text-lg">{tab.title}</h2>
                                        <p className="text-sm">{`Playlist • ${tab.count} songs`}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-white">Please log in to access your library.</p>
                )}
            </div>
            <div className="w-4/5 overflow-y-auto p-4 flex flex-col pb-60">
                {renderContent()}
            </div>
            {currentTrack && (
                <TrackPlayer
                    track={currentTrack}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onNext={() => {}}
                    onPrevious={() => {}}
                    currentTime={currentTime}
                    duration={currentTrack.duration}
                    onVolumeChange={handleVolumeChange}
                    volume={volume}
                    onSeek={handleSeek}
                    isPlaying={isPlaying}
                    playlists={playlists}
                    onAddToPlaylist={handleAddToPlaylist}
                    onAddToFavorites={handleAddToFavorites}
                />
            )}
        </div>
    );
};

export default Main;