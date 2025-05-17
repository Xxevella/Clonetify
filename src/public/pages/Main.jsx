import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from "js-cookie";
import { setUser } from "../../redux/slices/userSlice.js";
import { selectTab } from "../../redux/slices/tabSlice.js";
import { setCurrentTrack, setTracks } from "../../redux/slices/tracksSlice.js";
import TrackPlayer from '../components/trackPlayer.jsx';
import { assets } from "../assets/assets.js";
import ArtistModal from "../components/Modal/ArtistModal.jsx";
import AlbumModal from "../components/Modal/AlbumModal.jsx";

const Main = () => {
    const dispatch = useDispatch();
    const selectedTab = useSelector((state) => state.tab.selectedTab);
    const userId = useSelector((state) => state.user.id);
    const tracks = useSelector((state) => state.tracks.tracks);

    const searchQuery = useSelector(state => state.search.query);
    const searchResults = useSelector(state => state.search.results);

    const [showArtistModal, setShowArtistModal] = useState(false);
    const [selectedArtist, setSelectedArtist] = useState(null);

    const [showAlbumModal, setShowAlbumModal] = useState(false);
    const [selectedAlbum, setSelectedAlbum] = useState(null);

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
            count: pl.Tracks ? pl.Tracks.length : 0,
        })),
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
            setIsPlaying(false);
            audioRef.current.pause();
            setCurrentTime(0);
        }

        setLoading(false);
    }, [userId, dispatch]);

    const playTrack = (track) => {
        audioRef.current.src = `../../../static/audio/${track.audio}`;
        audioRef.current.onloadedmetadata = () => {
            const duration = audioRef.current.duration;
            dispatch(setCurrentTrack({ ...track, duration }));
            localStorage.setItem('currentTrack', JSON.stringify({ ...track, duration }));
            audioRef.current.play();
            setIsPlaying(true);
        };
        audioRef.current.play();
    };
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
            const response = await fetch('http://localhost:5000/trackRouter/playlist', {
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

    const getRandomTrackFromSelectedPlaylist = () => {
        if (!selectedTab) return null;

        if (selectedTab === 'Favorites') {
            if (!favorites || favorites.length === 0) return null;
            const otherTracks = favorites.filter(track => track.id !== currentTrack?.id);
            if (otherTracks.length === 0) return currentTrack;
            const randomIndex = Math.floor(Math.random() * otherTracks.length);
            return otherTracks[randomIndex];
        }

        const playlist = playlists.find(pl => pl.name === selectedTab);
        if (!playlist || !playlist.Tracks || playlist.Tracks.length === 0) return null;

        const otherTracks = playlist.Tracks.filter(track => track.id !== currentTrack?.id);
        if (otherTracks.length === 0) return currentTrack;

        const randomIndex = Math.floor(Math.random() * otherTracks.length);
        return otherTracks[randomIndex];
    };

    const handleNext = () => {
        const nextTrack = getRandomTrackFromSelectedPlaylist();
        if (nextTrack) {
            playTrack(nextTrack);
        }
    };

    const handlePrevious = () => {
        const prevTrack = getRandomTrackFromSelectedPlaylist();
        if (prevTrack) {
            playTrack(prevTrack);
        }
    };

    useEffect(() => {
        const audio = audioRef.current;
        const onEnded = () => {
            const nextTrack = getRandomTrackFromSelectedPlaylist();
            if (nextTrack) {
                playTrack(nextTrack);
            }
        };
        audio.addEventListener('ended', onEnded);
        return () => audio.removeEventListener('ended', onEnded);
    }, [currentTrack, playlists, selectedTab, favorites]);

    const handleRemoveTrackFromPlaylist = async (trackId, playlistId) => {
        try {
            const response = await fetch(`http://localhost:5000/playlistRouter/playlists/${playlistId}/tracks/${trackId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to remove track from playlist');
            }

            setPlaylists(prevPlaylists => prevPlaylists.map(pl => {
                if (pl.id === playlistId) {
                    return {
                        ...pl,
                        Tracks: pl.Tracks.filter(track => track.id !== trackId)
                    };
                }
                return pl;
            }));

            alert('Track removed from playlist successfully');
        } catch (error) {
            console.error('Error removing track from playlist:', error);
            alert('Error removing track from playlist: ' + error.message);
        }
    };

    const handleRemoveFromFavorites = async (trackId) => {
        try {
            const response = await fetch('http://localhost:5000/trackRouter/favorites', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ trackId, userId }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to remove track from favorites');
            }

            setFavorites(prevFavorites => prevFavorites.filter(track => track.id !== trackId));
            alert('Track removed from favorites successfully');
        } catch (error) {
            console.error('Error removing track from favorites:', error);
            alert('Error removing track from favorites: ' + error.message);
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

    useEffect(() => {
        const handlePlayTrackFromSearch = (e) => {
            const track = e.detail;
            if (track) {
                playTrack(track);
            }
        };
        window.addEventListener('playTrackFromSearch', handlePlayTrackFromSearch);
        return () => window.removeEventListener('playTrackFromSearch', handlePlayTrackFromSearch);
    }, []);

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

    const openArtistModal = (artist) => {
        setSelectedArtist(artist);
        setShowArtistModal(true);
    };

    const closeArtistModal = () => {
        setShowArtistModal(false);
        setSelectedArtist(null);
    };

    const openAlbumModal = (album) => {
        setSelectedAlbum(album);
        setShowAlbumModal(true);
    };

    const closeAlbumModal = () => {
        setShowAlbumModal(false);
        setSelectedAlbum(null);
    };

    const renderContent = () => {
        if (searchQuery && searchQuery.trim() !== '') {
            const hasAlbums = searchResults.albums && searchResults.albums.length > 0;
            const hasTracks = searchResults.tracks && searchResults.tracks.length > 0;
            const hasArtists = searchResults.artists && searchResults.artists.length > 0;
            const nothingFound = !hasAlbums && !hasTracks && !hasArtists;

            if (nothingFound) {
                return (
                    <div className="text-white">
                        <h2 className="text-2xl mb-4">Search results for "{searchQuery}"</h2>
                        <p>No results found.</p>
                    </div>
                );
            }

            return (
                <div className="text-white">
                    <h2 className="text-2xl mb-4">Search results for "{searchQuery}"</h2>

                    {hasAlbums && (
                        <div className="mb-6">
                            <h3 className="text-xl mb-2">Albums</h3>
                            <div className="flex flex-wrap">
                                {searchResults.albums.map(album => (
                                    <div
                                        key={album.id}
                                        className="p-2 bg-gray-700 rounded mr-4 mb-4 w-48 cursor-pointer"
                                        onClick={() => openAlbumModal(album)}
                                    >
                                        <img
                                            src={'../../../static/images/' + album.picture}
                                            alt={album.title}
                                            className="w-full h-40 object-cover rounded mb-2"
                                        />
                                        <h4 className="text-white font-semibold">{album.title}</h4>
                                        <p className="text-gray-400 text-sm">
                                            {album.Artists && album.Artists.length > 0
                                                ? album.Artists.map(a => a.name).join(', ')
                                                : 'Unknown Artist'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Треки */}
                    {hasTracks && (
                        <div className="mb-6">
                            <h3 className="text-xl mb-2">Tracks</h3>
                            <div className="flex flex-wrap">
                                {searchResults.tracks.map(track => (
                                    <div
                                        key={track.id}
                                        className="p-2 bg-gray-700 rounded mr-4 mb-4 w-48 cursor-pointer"
                                        onClick={() => playTrack(track)}
                                    >
                                        <img
                                            src={'../../../static/images/' + track.picture}
                                            alt={track.title}
                                            className="w-full h-40 object-cover rounded mb-2"
                                        />
                                        <h4 className="text-white font-semibold">{track.title}</h4>
                                        <p className="text-gray-400 text-sm">
                                            {track.Artists && track.Artists.length > 0
                                                ? track.Artists.map(a => a.name).join(', ')
                                                : 'Unknown Artist'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Артисты */}
                    {hasArtists && (
                        <div className="mb-6">
                            <h3 className="text-xl mb-2">Artists</h3>
                            <div className="flex flex-wrap">
                                {searchResults.artists.map(artist => (
                                    <div
                                        key={artist.id}
                                        className="p-2 bg-gray-700 rounded mr-4 mb-4 w-48 cursor-pointer"
                                        onClick={() => openArtistModal(artist)}
                                    >
                                        <img
                                            src={'../../../static/images/' + (artist.picture || '../../../static/images/twentyonepilots.png')}
                                            alt={artist.name}
                                            className="w-full h-40 object-cover rounded mb-2"
                                        />
                                        <h4 className="text-white font-semibold">{artist.name}</h4>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            );
        }
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
                                    className="relative flex flex-col items-center justify-between p-2 bg-gray-700 rounded mb-4 ml-6 cursor-pointer"
                                    onClick={() => playTrack(track)}
                                >
                                    <button
                                        onClick={e => {
                                            e.stopPropagation();
                                            handleRemoveFromFavorites(track.id);
                                        }}
                                        className="absolute top-1 right-1 text-white bg-red-600 rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                                        aria-label="Remove track from favorites"
                                        title="Remove track from favorites"
                                    >
                                        ×
                                    </button>

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
                                    className="relative flex flex-col items-center p-2 bg-gray-700 rounded mb-2 w-50 h-60 ml-10 cursor-pointer"
                                    onClick={() => playTrack(track)}
                                >
                                    <button
                                        onClick={e => {
                                            e.stopPropagation();
                                            handleRemoveTrackFromPlaylist(track.id, playlist.id);
                                        }}
                                        className="absolute top-1 right-1 text-white bg-red-600 rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                                        aria-label="Remove track from playlist"
                                        title="Remove track from playlist"
                                    >
                                        ×
                                    </button>

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
                                        onClick={() => playTrack(track)}
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
                                onClick={() => playTrack(track)}
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
                    onNext={handleNext}
                    onPrevious={handlePrevious}
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
            {showArtistModal && (
                <ArtistModal
                    artist={selectedArtist}
                    onClose={closeArtistModal}
                    onTrackClick={playTrack}
                />
            )}

            {showAlbumModal && (
                <AlbumModal
                    album={selectedAlbum}
                    onClose={closeAlbumModal}
                    onTrackClick={playTrack}
                />
            )}
        </div>
    );
};

export default Main;