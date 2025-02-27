import React from 'react';
import {assets} from "../assets/assets.js";

const Header = () => {
    return (
       <div className='h-500 pt-4 pl-6 flex flex-row'>
           <div className='w-[33%] cursor-pointer'>
               <img src={assets.spotify_logo} alt='spotify logo' />
           </div>
           <div>
               <button className='flex items-center p-2 rounded transition'>
                   <img
                       src={assets.home_icon}
                       alt='Button Icon'
                       className='w-6 h-6 mr-2'
                   />
               </button>
           </div>
       </div>
    );
};

export default Header;