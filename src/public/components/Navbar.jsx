import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchQuery, setSearchResults, setIsSearching, clearSearch } from '../../redux/slices/searchSlice.js';
import { assets } from "../assets/assets.js";
import { Link, useNavigate } from "react-router-dom";
import handleLogout from "./handleLogout.js";
import resetTabs from "./resetTabs.js";
import SearchBar from "./SearchBar.jsx";

const Navbar = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.user.isAuthenticated);
    const user = useSelector(state => state.user);
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const searchQuery = useSelector(state => state.search.query);
    const isSearching = useSelector(state => state.search.isSearching);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const handleSearch = (query) => {
        const q = query.trim();
        dispatch(setSearchQuery(q));
        if (!q) {
            dispatch(clearSearch());
            return;
        }
        dispatch(setIsSearching(true));

        fetch(`http://localhost:5000/searchRouter/search?query=${encodeURIComponent(q)}`)
            .then(res => {
                if (!res.ok) throw new Error('Search request failed');
                return res.json();
            })
            .then(data => {
                dispatch(setSearchResults(data));
            })
            .catch(() => {
                dispatch(setSearchResults({ albums: [], tracks: [], artists: [] }));
            })
            .finally(() => {
                dispatch(setIsSearching(false));
            });
    };

    const handleClearSearch = () => {
        dispatch(clearSearch());
    };

    const handleTrackClick = (track) => {
        window.dispatchEvent(new CustomEvent('playTrackFromSearch', { detail: track }));
    };

    return (
        <>
            <nav className='nav h-17 bg-black flex flex-row items-center justify-between p-4 z-40 relative'>
                <div className='flex items-center pl-2'>
                    <div className='cursor-pointer' onClick={() => resetTabs(dispatch, navigate)}>
                        <img src={assets.spotify_logo} alt='spotify logo' className='h-10' />
                    </div>
                    <div style={{ backgroundColor: '#2a2a2a' }} className='flex items-center justify-center ml-4 w-12 h-12 border-2 rounded-full'>
                        <div className='flex items-center text-white cursor-pointer' onClick={() => resetTabs(dispatch, navigate)}>
                            <img src={assets.home_icon} alt='Home Icon' className='w-6 h-6' />
                        </div>
                    </div>
                    <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
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
                                    {user.role === 'artist' && (
                                        <>
                                            <Link to="/artist-panel" className="block px-4 py-2 hover:bg-gray-200" onClick={() => setMenuOpen(false)}>
                                                Artist Panel
                                            </Link>
                                            <Link to="/artist-statistic" className="block px-4 py-2 hover:bg-gray-200" onClick={() => setMenuOpen(false)}>
                                                Statistics
                                            </Link>
                                        </>

                                    )}
                                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-200" onClick={() => setMenuOpen(false)}>
                                        Profile
                                    </Link>
                                    {user.role === 'admin' && (
                                        <>
                                            <Link to="/admin-panel" className="block px-4 py-2 hover:bg-gray-200" onClick={() => setMenuOpen(false)}>
                                                Admin Panel
                                            </Link>
                                            <Link to="/admin-statistic" className="block px-4 py-2 hover:bg-gray-200" onClick={() => setMenuOpen(false)}>
                                                Statistic
                                            </Link>

                                        </>
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
        </>
    );
};

export default Navbar;