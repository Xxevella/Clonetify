import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserEmail } from '../../redux/slices/userSlice';
import { auth } from '../../firebaseConfig';
import { updateProfile, updatePassword } from 'firebase/auth';

const Profile = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const [username, setUsername] = useState(user.username || '');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        setUsername(user.username || '');
    }, [user]);

    const handleUpdateProfile = async () => {
        setLoading(true);
        try {
            await updateProfile(auth.currentUser, { displayName: username });
            const response = await fetch('http://localhost:5000/userRouter/users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: user.id, // Ensure user.id is valid
                    username: username,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error('Ошибка обновления логина: ' + errorData.message || response.statusText);
            }

            setSuccess('Логин обновлен успешно!');
        } catch (err) {
            setError('Ошибка обновления логина: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async () => {
        setLoading(true);
        try {
            await updatePassword(auth.currentUser, password);
            setSuccess('Пароль обновлен успешно!');
        } catch (err) {
            setError('Ошибка обновления пароля: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 h-screen bg-gray-800 text-white">
            <h1 className="text-2xl mb-4">Профиль</h1>
            {error && <div className="text-red-500">{error}</div>}
            {success && <div className="text-green-500">{success}</div>}
            <div className="mb-4">
                <label className="block mb-1">Логин:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-2 p-2 bg-gray-700 rounded w-full"
                />
                <button onClick={handleUpdateProfile} className="mt-2 bg-blue-600 p-2 rounded" disabled={loading}>
                    Обновить логин
                </button>
            </div>
            <div className="mb-4">
                <label className="block mb-1">Пароль:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-2 p-2 bg-gray-700 rounded w-full"
                />
                <button onClick={handleUpdatePassword} className="mt-2 bg-blue-600 p-2 rounded" disabled={loading}>
                    Обновить Пароль
                </button>
            </div>
        </div>
    );
};

export default Profile;