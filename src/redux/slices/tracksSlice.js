import { createSlice } from '@reduxjs/toolkit';

const tracksSlice = createSlice({
    name: 'tracks',
    initialState: {
        currentTrack: null,
        tracks: [],
    },
    reducers: {
        setTracks: (state, action) => {
            state.tracks = action.payload;
        },
        setCurrentTrack(state, action) {
            state.currentTrack = action.payload;
        },
        clearCurrentTrack(state) {
            state.currentTrack = null;
        },
    },
});

export const { setTracks, setCurrentTrack, clearCurrentTrack } = tracksSlice.actions;
export default tracksSlice.reducer;