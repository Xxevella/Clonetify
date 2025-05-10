import React, {useEffect, useState} from 'react';
import AlbumsArtistPanel from "./AlbumsArtistPanel.jsx";
import TracksArtistPanel from "./TracksArtistPanel.jsx";
import {assets} from "../../assets/assets.js";
import {useNavigate} from "react-router-dom";


const ArtistPanel = () => {
    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem('artistPanelActiveTab') || 'albums';
    });
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('artistPanelActiveTab', activeTab);
    }, [activeTab]);

    return (
        <div className="p-4 bg-gray-700 min-h-screen relative">
            <div className="absolute top-4 right-4">
                <div
                    onClick={() => navigate('/')}
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center cursor-pointer hover:bg-gray-600"
                >
                    <img src={assets.arrow_left} alt="Back" className="w-6 h-6" />
                </div>
            </div>
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
                {activeTab === 'albums' && <AlbumsArtistPanel />}
                {activeTab === 'tracks' && <TracksArtistPanel />}
            </div>
        </div>
    );
};

export default ArtistPanel;