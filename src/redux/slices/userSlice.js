import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        id: null,
        email: null,
        username: null,
        role: "guest",
        createdAt: null,
        updatedAt: null,
        isAuthenticated: false,
    },
    reducers: {
        setUser: (state, action) => {
            const { id, email, username, role, createdAt, updatedAt } = action.payload;
            state.id = id;
            state.email = email;
            state.username = username;
            state.role = role;
            state.createdAt = createdAt;
            state.updatedAt = updatedAt;
            state.isAuthenticated = true;
        },
        clearUser: (state) => {
            state.id = null;
            state.email = null;
            state.username = null;
            state.role = null;
            state.createdAt = null;
            state.updatedAt = null;
            state.isAuthenticated = false;
        },
        logout: (state) => {
            state.id = null;
            state.email = null;
            state.username = null;
            state.role = "guest";
            state.createdAt = null;
            state.updatedAt = null;
            state.isAuthenticated = false;
        },
        updateUserEmail: (state, action) => {
            state.email = action.payload;
        },
    },
});

export const { setUser, clearUser, logout, updateUserEmail } = userSlice.actions;
export default userSlice.reducer;