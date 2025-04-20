import { createSlice } from '@reduxjs/toolkit';

const tabSlice = createSlice({
    name: 'tab',
    initialState: {
        selectedTab: null,
    },
    reducers: {
        selectTab(state, action) {
            state.selectedTab = action.payload;
        },
        resetTab(state) {
            state.selectedTab = null;
        },
    },
});

export const { selectTab, resetTab } = tabSlice.actions;
export default tabSlice.reducer;