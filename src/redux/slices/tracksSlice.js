import { createSlice } from '@reduxjs/toolkit';

const tracksSlice = createSlice({
    name: 'tracks',
    initialState: {
        tracks: [],
    },
    reducers: {
        setTracks: (state, action) => {
            state.tracks = action.payload;
        },
    },
});

export const { setTracks } = tracksSlice.actions;
export default tracksSlice.reducer;