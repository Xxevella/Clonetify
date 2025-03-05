import React from 'react';
import { assets } from "../assets/assets.js";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar.jsx";

const Navbar = () => {
    return (
        <nav className='nav h-17 bg-black flex flex-row items-center justify-between border-2 border-blue-800 p-4'>
            <div className='flex items-center pl-2'>
                <div className='cursor-pointer'>
                    <img src={assets.spotify_logo} alt='spotify logo' className='h-10' />
                </div>
                <div style={{backgroundColor: '#2a2a2a'}} className='flex items-center justify-center
                 ml-4 w-12 h-12 border-2  rounded-full'>
                    <Link to="/" className='flex items-center text-white'>
                        <img
                            src={assets.home_icon}
                            alt='Home Icon'
                            className='w-6 h-6'
                        />
                    </Link>
                </div>
                <SearchBar />
            </div>
            <div className='flex flex-row mr-35 border-2 border-blue-800 items-center'>
                <div>
                    <Link to="/registration" className="text-white">
                        Sign up
                    </Link>
                </div>
                <div className='ml-5 mr-5'>
                    <Link to="/login" className="text-white">
                        <button className='bg-white text-black h-10 w-25 rounded-3xl'>Log in</button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;