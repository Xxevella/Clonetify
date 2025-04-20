import React, { useState } from 'react';
import { assets } from "../assets/assets.js";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar.jsx";
import { useSelector, useDispatch } from 'react-redux';
import { resetTab } from "../../redux/slices/tabSlice.js";
import handleLogout from "./handleLogout.js";
import resetTabs from "./resetTabs.js";

const Navbar = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className='nav h-17 bg-black flex flex-row items-center justify-between p-4'>
            <div className='flex items-center pl-2'>
                <div className='cursor-pointer' onClick={() => resetTabs(dispatch, navigate)}>
                    <img src={assets.spotify_logo} alt='spotify logo' className='h-10' />
                </div>
                <div style={{backgroundColor: '#2a2a2a'}} className='flex items-center justify-center ml-4 w-12 h-12 border-2 rounded-full'>
                    <div className='flex items-center text-white cursor-pointer' onClick={() => resetTabs(dispatch, navigate)}>
                        <img src={assets.home_icon} alt='Home Icon' className='w-6 h-6' />
                    </div>
                </div>
                <SearchBar />
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
                            <img src={user.avatar || assets.search_icon} alt='User Avatar' className='w-7 h-7 object-cover' />
                        </div>
                        {menuOpen && (
                            <div className="absolute right-0 bg-white text-black rounded shadow-md mt-2">
                                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-200" onClick={() => setMenuOpen(false)}>
                                    Profile
                                </Link>
                                <div
                                    className="block px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                    onClick={() => {
                                        handleLogout(dispatch);
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
    );
};

export default Navbar;