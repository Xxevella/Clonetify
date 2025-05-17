import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF', '#FF6384'];

const Statistic = () => {
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        tracksCount: 0,
        albumsCount: 0,
        genresCount: 0,
        usersCount: 0,
        popularGenres: [],
        userRegistrations: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const res = await fetch('http://localhost:5000/statistics/admin');
                if (!res.ok) throw new Error('Failed to fetch statistics');
                const data = await res.json();
                setStats(data);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="p-8 text-white text-xl">Loading statistics...</div>;
    if (error) return <div className="p-8 text-red-500 text-xl">Error: {error}</div>;

    return (
        <div className="p-8 bg-gray-900 min-h-screen text-white font-sans relative">
            {/* Кнопка возврата */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 transition text-white py-2 px-4 rounded shadow"
                aria-label="Вернуться на главную"
            >
                ← Главная
            </button>

            <h1 className="text-5xl font-bold mb-12">Statistics Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
                <MetricCard title="Tracks" value={stats.tracksCount} color="bg-blue-600" />
                <MetricCard title="Albums" value={stats.albumsCount} color="bg-green-600" />
                <MetricCard title="Genres" value={stats.genresCount} color="bg-yellow-600" />
                <MetricCard title="Users" value={stats.usersCount} color="bg-purple-600" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <section className="bg-gray-800 rounded-lg p-6 shadow-lg">
                    <h2 className="text-2xl font-semibold mb-6">Popular Genres</h2>
                    {stats.popularGenres.length === 0 ? (
                        <p>No genre data available</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    dataKey="count"
                                    isAnimationActive={true}
                                    data={stats.popularGenres}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    label={(entry) => entry.name}
                                >
                                    {stats.popularGenres.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [value, 'Count']} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </section>

                <section className="bg-gray-800 rounded-lg p-6 shadow-lg">
                    <h2 className="text-2xl font-semibold mb-6">User Registrations (Monthly)</h2>
                    {stats.userRegistrations.length === 0 ? (
                        <p>No registration data available</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={stats.userRegistrations}
                                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis dataKey="month" stroke="#aaa" />
                                <YAxis stroke="#aaa" />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </section>
                <section className="bg-gray-800 rounded-lg p-6 shadow-lg mt-12 mx-auto" style={{ width: 1200 }}>
                    <h2 className="text-2xl font-semibold mb-6 text-center">Track Releases (Monthly)</h2>
                    {stats.trackReleases.length === 0 ? (
                        <p className="text-center">No track release data available</p>
                    ) : (
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={stats.trackReleases}
                                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                    <XAxis dataKey="month" stroke="#aaa" />
                                    <YAxis stroke="#aaa" />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

const MetricCard = ({ title, value, color }) => (
    <div className={`rounded-lg p-6 shadow-lg ${color} flex flex-col items-center justify-center`}>
        <p className="text-3xl font-bold">{value}</p>
        <p className="uppercase tracking-wider mt-2 text-white/80">{title}</p>
    </div>
);

export default Statistic;