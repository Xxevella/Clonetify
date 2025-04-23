import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slices/userSlice';
import tabSlice from "./slices/tabSlice.js";
import tracksSlice from "./slices/tracksSlice.js";

export const store = configureStore({
    reducer: {
        user: userSlice,
        tab: tabSlice,
        tracks: tracksSlice,
    }
});