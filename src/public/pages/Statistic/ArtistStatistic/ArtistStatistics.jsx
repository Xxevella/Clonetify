import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import {useSelector} from "react-redux";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF', '#FF6384'];

const ArtistStatistics = () => {
    const userId = useSelector(state => state.user.id);
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        albumsCount: 0,
        tracksCount: 0,
        genresCount: 0,
        popularGenres: [],
        monthlyReleases: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStat, setSelectedStat] = useState('overview');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const res = await fetch(`http://localhost:5000/statistics/artist?userId=${userId}`)
                if (!res.ok) throw new Error('Не удалось загрузить статистику');
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

    if (loading) return <div className="p-8 text-white text-xl">Загрузка статистики...</div>;
    if (error) return <div className="p-8 text-red-500 text-xl">Ошибка: {error}</div>;

    return (
        <div className="p-8 bg-gray-900 min-h-screen text-white font-sans relative">
            <button
                onClick={() => navigate('/')}
                className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 transition text-white py-2 px-4 rounded shadow"
                aria-label="Вернуться на главную"
            >
                ← Главная
            </button>

            <h1 className="text-5xl font-bold mb-8 text-center">Моя Статистика</h1>

            <div className="flex justify-center gap-8 mb-12">
                <button
                    onClick={() => setSelectedStat('overview')}
                    className={`py-2 px-6 rounded ${
                        selectedStat === 'overview' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                >
                    Общая
                </button>
                <button
                    onClick={() => setSelectedStat('monthlyReleases')}
                    className={`py-2 px-6 rounded ${
                        selectedStat === 'monthlyReleases' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                >
                    Выпуски по месяцам
                </button>
                <button
                    onClick={() => setSelectedStat('popularGenres')}
                    className={`py-2 px-6 rounded ${
                        selectedStat === 'popularGenres' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                >
                    Популярные жанры
                </button>
            </div>

            {selectedStat === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
                    <MetricCard title="Альбомы" value={stats.albumsCount} color="bg-green-600" />
                    <MetricCard title="Треки" value={stats.tracksCount} color="bg-blue-600" />
                    <MetricCard title="Жанры" value={stats.genresCount} color="bg-yellow-600" />
                </div>
            )}

            {selectedStat === 'popularGenres' && (
                <section className="bg-gray-800 rounded-lg p-6 shadow-lg max-w-4xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-6 text-center">Популярные жанры</h2>
                    {stats.popularGenres.length === 0 ? (
                        <p className="text-center">Данные отсутствуют</p>
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
            )}

            {selectedStat === 'monthlyReleases' && (
                <section className="bg-gray-800 rounded-lg p-6 shadow-lg max-w-4xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-6 text-center">Выпуски треков по месяцам</h2>
                    {stats.monthlyReleases.length === 0 ? (
                        <p className="text-center">Данные отсутствуют</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={stats.monthlyReleases}
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
            )}
        </div>
    );
};

const MetricCard = ({ title, value, color }) => (
    <div
        className={`rounded-lg p-6 shadow-lg ${color} flex flex-col items-center justify-center`}
        style={{ minHeight: 120 }}
    >
        <p className="text-3xl font-bold">{value}</p>
        <p className="uppercase tracking-wider mt-2 text-white/80">{title}</p>
    </div>
);

export default ArtistStatistics;