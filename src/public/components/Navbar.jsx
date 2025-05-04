import React, { useState, useRef, useEffect } from 'react';
import { assets } from "../assets/assets.js";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar.jsx";
import { useSelector, useDispatch } from 'react-redux';
import { resetTab } from "../../redux/slices/tabSlice.js";
import handleLogout from "./handleLogout.js";
import resetTabs from "./resetTabs.js";

// Новый оверлей поиска
const SearchOverlay = ({
                           results,
                           onClose,
                           onTrackClick,
                           isLoading,
                           query
                       }) => {
    const overlayRef = useRef();

    useEffect(() => {
        // Клик вне оверлея – закрыть
        function handleClickOutside(event) {
            if (overlayRef.current && !overlayRef.current.contains(event.target)) {
                onClose();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-80">
            <div
                ref={overlayRef}
                className="relative mt-28 bg-gray-900 p-6 rounded-lg max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[80vh]"
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-300 hover:text-white text-2xl"
                    aria-label="Close"
                >×</button>
                <h2 className="text-white text-2xl mb-4">Search results for: <b>{query}</b></h2>
                {isLoading ? (
                    <div className="text-gray-300">Searching...</div>
                ) : (
                    results.length === 0
                        ? <div className="text-gray-400">No tracks found.</div>
                        : (
                            <div className="flex flex-wrap gap-6">
                                {results.map((track) => (
                                    <div
                                        key={track.id}
                                        className="flex flex-col items-center bg-gray-800 rounded p-3 cursor-pointer hover:bg-gray-700 w-44"
                                        onClick={() => {onTrackClick(track); onClose();}}
                                    >
                                        <img
                                            src={'../../../static/images/' + track.picture}
                                            alt={track.title}
                                            className="w-32 h-32 rounded mb-2 object-cover"
                                        />
                                        <h3 className="text-white text-base font-semibold">{track.title}</h3>
                                        <div className="text-gray-400 text-xs text-center">
                                            {track.Artists && track.Artists.length > 0
                                                ? track.Artists.map((artist, idx) => (
                                                    <span key={artist.id}>
                                                        {artist.name}{idx < track.Artists.length - 1 ? ', ' : ''}
                                                    </span>
                                                ))
                                                : 'Unknown Artist'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                )}
            </div>
        </div>
    );
};

const Navbar = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    // Поисковое состояние
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchActive, setSearchActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    // Поиск треков
    const handleSearch = (query) => {
        const q = query.trim();
        setSearchQuery(q);
        if (!q) {
            setSearchResults([]);
            setSearchActive(false);
            return;
        }
        setIsLoading(true);
        setSearchActive(true);
        // Запрос на сервер поиска
        fetch(`http://localhost:5000/trackRouter/search?query=${encodeURIComponent(q)}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to search');
                return res.json();
            })
            .then(data => {
                setSearchResults(data);
                setIsLoading(false);
            })
            .catch(err => {
                setSearchResults([]);
                setIsLoading(false);
            });
    };

    // Закрыть поиск
    const handleCloseSearch = () => {
        setSearchActive(false);
        setSearchQuery('');
        setSearchResults([]);
        setIsLoading(false);
    };

    // Воспроизвести трек при клике
    const handleTrackClick = (track) => {
        // Можно вызвать кастомное событие для Main, или через глобал redux (setCurrentTrack)
        // Для простоты: window.dispatchEvent + кастомное событие
        window.dispatchEvent(new CustomEvent('playTrackFromSearch', { detail: track }));
    };

    return (
        <>
            <nav className='nav h-17 bg-black flex flex-row items-center justify-between p-4 z-40 relative'>
                <div className='flex items-center pl-2'>
                    <div className='cursor-pointer' onClick={() => resetTabs(dispatch, navigate)}>
                        <img src={assets.spotify_logo} alt='spotify logo' className='h-10' />
                    </div>
                    <div style={{backgroundColor: '#2a2a2a'}} className='flex items-center justify-center ml-4 w-12 h-12 border-2 rounded-full'>
                        <div className='flex items-center text-white cursor-pointer' onClick={() => resetTabs(dispatch, navigate)}>
                            <img src={assets.home_icon} alt='Home Icon' className='w-6 h-6' />
                        </div>
                    </div>
                    <SearchBar
                        onSearch={handleSearch}
                        onClear={handleCloseSearch}
                    />
                </div>
                <div className='flex flex-row mr-35 items-center'>
                    {!isAuthenticated ? (
                        <>
                            <div>
                                <Link to="/registration" className="text-white">Sign up</Link>
                            </div>
                            <div className='ml-5 mr-5'>
                                <Link to="/login" className="text-white">
                                    <button className='bg-white text-black h-10 w-25 rounded-3xl'>Log in</button>
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="relative">
                            <div
                                className='w-12 h-12 rounded-full overflow-hidden border-2 cursor-pointer bg-gray-800 flex items-center justify-center'
                                onClick={toggleMenu}
                            >
                                {user.role === 'admin' && (
                                    <img src={assets.adminIcon} alt='Admin Avatar' className='w-7 h-7 object-cover' />
                                )}
                                {user.role === 'artist' && (
                                    <img src={assets.artistIcon} alt='Artist Avatar' className='w-7 h-7 object-cover' />
                                )}
                                {user.role === 'user' && (
                                    <img src={assets.userIcon} alt='User Avatar' className='w-7 h-7 object-cover' />
                                )}
                            </div>
                            {menuOpen && (
                                <div className="absolute right-0 bg-white text-black rounded shadow-md mt-2">
                                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-200" onClick={() => setMenuOpen(false)}>
                                        Profile
                                    </Link>
                                    {user.role === 'admin' && (
                                        <Link to="/admin-panel" className="block px-4 py-2 hover:bg-gray-200" onClick={() => setMenuOpen(false)}>
                                            Admin Panel
                                        </Link>
                                    )}
                                    <div
                                        className="block px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                        onClick={() => {
                                            handleLogout(dispatch, navigate);
                                            setMenuOpen(false);
                                        }}
                                    >
                                        Logout
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </nav>
            {/* ОВЕРЛЕЙ поиска */}
            {searchActive && (
                <SearchOverlay
                    results={searchResults}
                    onClose={handleCloseSearch}
                    onTrackClick={handleTrackClick}
                    isLoading={isLoading}
                    query={searchQuery}
                />
            )}
        </>
    );
};

export default Navbar;