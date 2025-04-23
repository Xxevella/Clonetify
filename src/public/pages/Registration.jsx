import React, { useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { setUser } from '../../redux/slices/userSlice.js';
import { auth } from '../../firebaseConfig.js';
import { createUserWithEmailAndPassword, updateProfile, deleteUser} from 'firebase/auth';
import { assets } from "../assets/assets.js";
import {useNavigate} from "react-router-dom";

const Registration = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state)=>state.user.isAuthenticated);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const handleSignUp = async () => {
        let user;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            user = userCredential.user;

            await updateProfile(user,{displayName:username})

            const newUser = {
                id: user.uid,
                email: user.email,
                username,
                role: 'user',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            await saveUserDB(newUser);
            dispatch(setUser(newUser));
            console.log(newUser);
            alert('Created Successfully!');
            navigate('/')
        } catch (error) {
            if (user) {
                await deleteUser(user).catch(e => console.error("Error deleting user:", e));
            }
            console.error("Error registering user:", error);
            alert('Error creating user: ' + error.message);
        }
    };

    const saveUserDB = async (user) => {
        try {
            await fetch('http://localhost:5000/userRouter/users',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user)})
        }catch (error) {
            console.error("Error saving user:", error);
        }
    }

    return (
        <div className='bg-gradient-to-b from-gray-700 to-black min-h-screen grid place-items-center text-white'>
            <div className='bg-gray-900 h-200 w-140 p-6 rounded-lg flex flex-col items-center'>
                <img
                    className='w-9 mb-4'
                    src={assets.spotify_logo}
                    alt="Spotify Logo"
                />
                <h2 className='text-xl font-bold'>Welcome to Clonetify</h2>
                <button className='w-70 h-11 border-1 border-gray-500 mt-9 rounded-3xl flex items-center cursor-pointer hover:border-white'>
                    <img
                        className='w-6 ml-7'
                        src={assets.google_icon}
                        alt="Google Icon" />
                    <p className='pl-8 font-medium'>Sign up with Google</p>
                </button>
                <input
                    type="text"
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-70 h-11 mt-3 pl-3 border-1 border-gray-500 rounded-sm"
                />
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
                    onClick={handleSignUp}
                    className='w-70 h-11 mt-5 bg-green-600 rounded-4xl text-black font-medium cursor-pointer'>
                    Sign Up
                </button>
            </div>
        </div>
    );
};

export default Registration;