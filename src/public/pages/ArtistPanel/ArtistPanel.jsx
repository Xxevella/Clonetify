import React, { useState } from 'react';
import AlbumsAdminPanel from "../../components/AdminPanel/AlbumsAdminPanel.jsx";
import TracksAdminPanel from "../../components/AdminPanel/TracksAdminPanel.jsx";


const ArtistPanel = () => {
    const [activeTab, setActiveTab] = useState('albums');

    return (
        <div className="p-4 bg-gray-700 min-h-screen relative">
            <h1 className="text-2xl mb-4 text-white">Artist Panel</h1>
            <div className="tabs mb-4 flex space-x-4">
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
            </div>
            <div className="tab-content text-white">
                {activeTab === 'albums' && <AlbumsAdminPanel />}
                {activeTab === 'tracks' && <TracksAdminPanel />}
            </div>
        </div>
    );
};

export default ArtistPanel;