import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile, deleteUser } from 'firebase/auth';
import { auth } from "../../firebaseConfig.js";
import { useNavigate } from 'react-router-dom';

const AddAdminPanel = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('user');
    const navigate = useNavigate();

    const handleSignUp = async () => {
        let user;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            user = userCredential.user;

            await updateProfile(user, { displayName: username });

            const newUser = {
                id: user.uid,
                email: user.email,
                username,
                role,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            await saveUserDB(newUser);
            alert('Created Successfully!');
            navigate('/admin-panel');
        } catch (error) {
            if (user) {
                await deleteUser(user).catch(e => console.error("Error deleting user:", e));
            }
            console.error("Error registering user:", error);
            alert('Error creating user: ' + error.message);
        }
    };

    const saveUserDB = async (user) => {
        try {
            await fetch('http://localhost:5000/userRouter/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user)
            });
        } catch (error) {
            console.error("Error saving user:", error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-800">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Add User</h2>
                <form onSubmit={(e) => { e.preventDefault(); handleSignUp(); }}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                    >
                        Add
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddAdminPanel;