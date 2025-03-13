import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        id: null,
        email: null,
        username: null,
        createdAt: null,
        updatedAt: null,
        isAuthenticated: false,
    },
    reducers: {
        setUser: (state, action) => {
            const { id, email, username, createdAt, updatedAt } = action.payload;
            state.id = id;
            state.email = email;
            state.username = username;
            state.createdAt = createdAt;
            state.updatedAt = updatedAt;
            state.isAuthenticated = true;
        },
        clearUser: (state) => {
            state.id = null;
            state.email = null;
            state.username = null;
            state.createdAt = null;
            state.updatedAt = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;