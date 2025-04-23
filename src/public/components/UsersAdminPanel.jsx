import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { getAuth } from 'firebase/auth';

const UsersAdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const auth = getAuth();

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const filtered = users.filter(user =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`http://localhost:5000/userRouter/users`);
            const data = await response.json();
            setUsers(data.users || []);
            setFilteredUsers(data.users || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to fetch users');
        }
    };

    const handleAddUser = () => {
        navigate('/add-admin-panel');
    };

    const handleDeleteUser = (id) => {
        setUserToDelete(id);
        setConfirmDelete(true);
    };


    const confirmDeletion = async () => {
        try {
            const response = await fetch(`http://localhost:5000/userRouter/users/${userToDelete}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error('Failed to delete user: ' + errorText);
            }

            setUsers(users.filter(user => user.id !== userToDelete));
            setFilteredUsers(filteredUsers.filter(user => user.id !== userToDelete));
            alert('User deleted successfully from database.');
        } catch (error) {
            console.error('Error during deletion:', error);
            alert('Error deleting user: ' + error.message);
        } finally {
            setConfirmDelete(false);
            setUserToDelete(null);
        }
    };

    const handleUpdateUser = (id) => {
        navigate(`/update-user/${id}`);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return (
        <div>
            <div className="flex items-center mb-4">
                <button
                    onClick={handleAddUser}
                    className="p-2 bg-green-500 text-white rounded cursor-pointer"
                >
                    Add User
                </button>
                <div className="ml-4 relative">
                    <input
                        type="text"
                        placeholder="Search by username..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="p-2 rounded text-black w-64 border border-white"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>
            <table className="min-w-full bg-gray-800 border border-gray-600">
                <thead>
                <tr>
                    <th className="py-2 px-4 border border-gray-600 text-left">ID</th>
                    <th className="py-2 px-4 border border-gray-600 text-left">Role</th>
                    <th className="py-2 px-4 border border-gray-600 text-left">Email</th>
                    <th className="py-2 px-4 border border-gray-600 text-left">Username</th>
                    <th className="py-2 px-4 border border-gray-600 text-left">Created At</th>
                    <th className="py-2 px-4 border border-gray-600 text-left">Updated At</th>
                    <th className="py-2 px-4 border border-gray-600 text-left">Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                        <tr key={user.id}>
                            <td className="py-2 px-4 border border-gray-600">{user.id}</td>
                            <td className="py-2 px-4 border border-gray-600">{user.role}</td>
                            <td className="py-2 px-4 border border-gray-600">{user.email}</td>
                            <td className="py-2 px-4 border border-gray-600">{user.username}</td>
                            <td className="py-2 px-4 border border-gray-600">{new Date(user.createdAt).toLocaleString()}</td>
                            <td className="py-2 px-4 border border-gray-600">{new Date(user.updatedAt).toLocaleString()}</td>
                            <td className="py-2 px-4 border border-gray-600">
                                <button onClick={() => handleUpdateUser(user.id)} className="mx-1 bg-yellow-500 text-white rounded px-2 cursor-pointer">Update</button>
                                <button onClick={() => handleDeleteUser(user.id)} className="mx-1 bg-red-500 text-white rounded px-2 cursor-pointer">Delete</button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="7" className="py-2 px-4 text-center border border-gray-600">No users found</td>
                    </tr>
                )}
                </tbody>
            </table>
            {confirmDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-1/3">
                        <h2 className="text-lg font-bold mb-4 text-black">Confirm Deletion</h2>
                        <p className="text-black">Are you sure you want to delete this user?</p>
                        <div className="mt-4 flex justify-end">
                            <button onClick={() => setConfirmDelete(false)} className="mr-2 p-2 bg-gray-300 rounded">Cancel</button>
                            <button onClick={confirmDeletion} className="p-2 bg-red-500 text-white rounded">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersAdminPanel;