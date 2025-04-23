import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {updateEmail, updatePassword } from 'firebase/auth';
import {auth} from '../../firebaseConfig.js';

const UpdateUserPanel = () => {
    const [userData, setUserData] = useState(null);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await fetch(`http://localhost:5000/userRouter/users/${id}`);
            const data = await response.json();
            if (data) {
                setUserData(data);
                setEmail(data.email);
                setUsername(data.username);
                setRole(data.role);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const handleUpdate = async () => {
        try {
            const updatedUser = {
                id,
                email,
                username,
                role,
                updatedAt: new Date().toISOString(),
            };

            await fetch(`http://localhost:5000/userRouter/users`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            });

            alert('User updated successfully!');
            navigate('/admin-panel');
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Error updating user: ' + error.message);
        }
    };

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-800">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Update User</h2>
                <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
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
                        <label className="block text-gray-700">Password (Leave blank to keep current)</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Role</label>
                        <input
                            type="text"
                            value={role}
                            readOnly
                            className="w-full p-2 border border-gray-300 rounded bg-gray-200"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                    >
                        Update
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateUserPanel;