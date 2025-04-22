import React, { useState } from 'react';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('users');

    return (
        <div className="p-4 bg-gradient-to-b from-gray-700 to-black h-screen">
            <h1 className="text-2xl mb-4 text-white">Admin Panel</h1>
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

            <div className="tab-content text-white  ">
                {activeTab === 'users' && <div>Users Tab Content</div>}
                {activeTab === 'playlists' && <div>Playlists Tab Content</div>}
                {activeTab === 'albums' && <div>Albums Tab Content</div>}
                {activeTab === 'tracks' && <div>Tracks Tab Content</div>}
                {activeTab === 'genres' && <div>Genres Tab Content</div>}
            </div>
        </div>
    );
};

export default AdminPanel;