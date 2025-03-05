import React, { useState } from 'react';
import { assets } from "../assets/assets.js";
import {Link} from "react-router-dom";

const SearchBar = () => {
    const [query, setQuery] = useState(''); // Состояние для поискового запроса
    const [isFocused, setIsFocused] = useState(false); // Состояние для фокуса

    const handleSearch = (event) => {
        if (event.key === 'Enter') {
            console.log('Searching for:', query); // Логика поиска
        }
    };

    return (
        <div
            style={{backgroundColor: '#2a2a2a'}}
            className={`search-container ml-2 h-12 w-97 border-2 rounded-3xl flex align-center
             ${isFocused ? 'border-white' : 'bg-none'}`}
        >
            <button className="search-button" onClick={() => console.log('Searching for:', query)}>
                <img
                    src={assets.search_icon}
                    alt="Search"
                    className='w-6 align-middle ml-2 cursor-pointer'
                />
            </button>
            <input
                type="text"
                placeholder="What do you want to play?"
                className="search-input w-[79%] text-gray-400 ml-2"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearch}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
            <div className="border-1 border-gray-500 h-7 mt-2"/>
            <Link to="/" className='flex items-center text-white'>
                <img
                    src={assets.speaker_icon}
                    alt='Home Icon'
                    className='w-6 h-6 ml-2'
                />
            </Link>
        </div>
    );
};

export default SearchBar;