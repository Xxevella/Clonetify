import React from 'react';
import { assets } from "../assets/assets.js";

const Login = () => {
    return (
        <div className='bg-gradient-to-b from-gray-700 to-black min-h-screen grid place-items-center text-white'>
            <div className='bg-gray-900 h-200 w-140 p-6 rounded-lg flex flex-col items-center'>
                <img
                    className='w-9 mb-4'
                    src={assets.spotify_logo}
                    alt="Spotify Logo"
                />
                <h2 className='text-xl font-bold'>Login to Clonetify</h2>
                <button className='w-70 h-11 border-1 border-gray-500 mt-9 rounded-3xl flex items-center cursor-pointer hover:border-white'>
                    <img
                    className='w-6 ml-7'
                    src={assets.google_icon}
                    alt="Google Icon"/>
                    <p className='pl-8 font-medium'>Login in with Google</p>
                </button>
            </div>
        </div>
    );
};

export default Login;