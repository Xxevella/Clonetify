import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import UsersAdminPanel from "../components/UsersAdminPanel.jsx";
import PlaylistsAdminPanel from "../components/PlaylistsAdminPanel.jsx";
import { assets } from "../assets/assets.js";
import AlbumsAdminPanel from "../components/AdminPanel/AlbumsAdminPanel.jsx";
import TracksAdminPanel from "../components/AdminPanel/TracksAdminPanel.jsx";
import GenresAdminPanel from "../components/AdminPanel/GenresAdminPanel.jsx";

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem('adminPanelActiveTab') || 'users';
    });
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('adminPanelActiveTab', activeTab);
    }, [activeTab]);

    return (
        <div className="p-4 bg-gray-700 min-h-screen relative">
            <h1 className="text-2xl mb-4 text-white">Admin Panel</h1>
            <div className="absolute top-4 right-4">
                <div
                    onClick={() => navigate('/')}
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center cursor-pointer hover:bg-gray-600"
                >
                    <img src={assets.arrow_left} alt="Back" className="w-6 h-6" />
                </div>
            </div>
            <div className="tabs mb-4 flex space-x-4">
                <div
                    onClick={() => setActiveTab('users')}
                    className={`tab cursor-pointer p-2 rounded ${activeTab === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Users
                </div>
                <div
                    onClick={() => setActiveTab('playlists')}
                    className={`tab cursor-pointer p-2 rounded ${activeTab === 'playlists' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Playlists
                </div>
                <div
                    onClick={() => setActiveTab('albums')}
                    className={`tab cursor-pointer p-2 rounded ${activeTab === 'albums' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Albums
                </div>
                <div
                    onClick={() => setActiveTab('tracks')}
                    className={`tab cursor-pointer p-2 rounded ${activeTab === 'tracks' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Tracks
                </div>
                <div
                    onClick={() => setActiveTab('genres')}
                    className={`tab cursor-pointer p-2 rounded ${activeTab === 'genres' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Genres
                </div>
            </div>
            <div className="tab-content text-white">
                {activeTab === 'users' && <UsersAdminPanel />}
                {activeTab === 'playlists' && <PlaylistsAdminPanel />}
                {activeTab === 'albums' && <AlbumsAdminPanel />}
                {activeTab === 'tracks' && <TracksAdminPanel />}
                {activeTab === 'genres' && <GenresAdminPanel/>}
            </div>
        </div>
    );
};

export default AdminPanel;