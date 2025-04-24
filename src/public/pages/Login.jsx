import React, { useEffect, useState } from 'react';
import { assets } from "../assets/assets.js";
import { auth } from "../../firebaseConfig.js";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { setUser } from "../../redux/slices/userSlice.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const Login = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();


    const handleSignIn = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Запрос на твой backend за полными данными пользователя
            const res = await fetch(`http://localhost:5000/userRouter/users/${user.uid}`);
            if (!res.ok) throw new Error('Failed to fetch user data');
            const userDataFromServer = await res.json();

            const userData = {
                id: userDataFromServer.id,
                email: userDataFromServer.email,
                username: userDataFromServer.username,
                role: userDataFromServer.role,
            };

            Cookies.set('auth', JSON.stringify(userData), { path: '/', expires: 7 });

            dispatch(setUser(userData));

            navigate('/');
            alert("Sign in Successfully!");
        } catch (error) {
            console.error("Error signing in:", error);
            alert("Invalid data");
        }
    };

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
                        alt="Google Icon"
                    />
                    <p className='pl-8 font-medium'>Login in with Google</p>
                </button>
                <input
                    type="email"
                    placeholder='name@domain.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-70 h-11 mt-3 pl-3 border-1 border-gray-500 rounded-sm"
                />
                <input
                    type="password"
                    placeholder='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-70 h-11 mt-3 pl-3 border-1 border-gray-500 rounded-sm"
                />
                <button
                    className='w-70 h-11 mt-5 bg-green-600 rounded-4xl text-black font-medium cursor-pointer'
                    onClick={handleSignIn}
                >Sign In</button>
            </div>
        </div>
    );
};

export default Login;