import React, { useState } from 'react';
import { assets } from "../assets/assets.js";

const SearchBar = ({ onSearch, onClear }) => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleSearch = (event) => {
        if (event.key === 'Enter') {
            onSearch(query);
        }
    };

    return (
        <div
            className={`search-container ml-2 h-12 w-97 border-2 rounded-3xl flex align-center ${isFocused ? 'border-white' : 'bg-none'}`}
        >
            <button
                className="search-button"
                onClick={() => onSearch(query)}
                type="button"
            >
                <img
                    src={assets.search_icon}
                    alt="Search"
                    className='w-6 align-middle ml-2 cursor-pointer'
                />
            </button>
            <input
                type="text"
                placeholder="What do you want to play?"
                className="search-input w-[79%] text-gray-400 ml-2 bg-transparent outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearch}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
            {query && (
                <button
                    className="ml-2 text-gray-500 hover:text-white text-lg"
                    onClick={() => {
                        setQuery('');
                        onClear && onClear();
                    }}
                    tabIndex={-1}
                    aria-label="Clear search"
                    type="button"
                >×</button>
            )}
        </div>
    );
};

export default SearchBar;