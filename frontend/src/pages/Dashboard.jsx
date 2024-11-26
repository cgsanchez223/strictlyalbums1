import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// The Dashboard represents the user's homepage. It contains the user's recent ratings, lists, and links to other features

const Dashboard = () => {
    const { user } = useAuth();
    const [recentRatings, setRecentRatings] = useState([]);
    const [userLists, setUserLists] = useState([]);
    const [stats, setStats] = useState({
        totalRatings: 0,
        averageRating: 0,
        totalLists: 0,
        favoriteGenres: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');

            // Fetch recent ratings
            const ratingsResponse = await fetch('http://localhost:5007/api/profile/ratings?limit=3', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Fetch user lists
            const listsResponse = await fetch('http://localhost:5007/api/lists?limit=3', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const [ratingsData, listsData] = await Promise.all([
                ratingsResponse.json(),
                listsResponse.json()
            ]);

            if (ratingsResponse.ok && listsResponse.ok) {
                setRecentRatings(ratingsData.data.ratings || []);
                setUserLists(listsData.data || []);
                // You can add an endpoint to fetch stats or calculate them from the data
                calculateStats(ratingsData.data.ratings);
            }
        } catch (err) {
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (ratings) => {
        if (!ratings?.length) return;

        const total = ratings.length;
        const avg = ratings.reduce((acc, curr) => acc + curr.rating, 0) / total;

        setStats({
            totalRatings: total,
            averageRating: avg.toFixed(1),
            totalLists: userLists.length,
            favoriteGenres: ['Rock', 'Jazz', 'Classical'] // This should come from backend
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white hover:from-purple-500 hover:to-indigo-500 transition-all transform hover:-translate-y-1">
                <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">
                                Welcome back, {user?.username}! 👋
                            </h1>
                            <p className="mt-2 text-blue-100">
                                Ready to discover and rate more music?
                            </p>
                        </div>
                        <Link
                            to="/search"
                            className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                        >
                            Search Albums
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="p-6 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl text-white hover:from-blue-500 hover:to-cyan-500 transition-all transform hover:-translate-y-1">
                        <h3 className="text-sm font-medium text-white-500">Total Ratings</h3>
                        <p className="mt-2 text-3xl font-bold text-white-900">{stats.totalRatings}</p>
                    </div>
                    <div className="p-6 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl text-white hover:from-blue-500 hover:to-cyan-500 transition-all transform hover:-translate-y-1">
                        <h3 className="text-sm font-medium text-white-500">Average Rating</h3>
                        <p className="mt-2 text-3xl font-bold text-white-900">⭐ {stats.averageRating}</p>
                    </div>
                    <div className="p-6 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl text-white hover:from-green-500 hover:to-teal-500 transition-all transform hover:-translate-y-1">
                        <h3 className="text-sm font-medium text-white-500">Lists Created</h3>
                        <p className="mt-2 text-3xl font-bold text-white-900">{stats.totalLists}</p>
                    </div>
                    <div className="p-6 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl text-white hover:from-green-500 hover:to-teal-500 transition-all transform hover:-translate-y-1">
                        <h3 className="text-sm font-medium text-white-500">Most Active Month</h3>
                        <p className="mt-2 text-3xl font-bold text-white-900">November</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Ratings */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Recent Ratings</h2>
                            <Link to="/profile" className="text-blue-600 hover:text-blue-500 text-sm">
                                View All
                            </Link>
                        </div>

                        {recentRatings.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No ratings yet</p>
                                <Link
                                    to="/search"
                                    className="mt-4 inline-block text-blue-600 hover:text-blue-500"
                                >
                                    Rate your first album
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentRatings.map(rating => (
                                    <Link
                                        key={rating.id}
                                        to={`/album/${rating.albumId}`}
                                        className="flex items-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <img
                                            src={rating.albumImage || '/album-placeholder.png'}
                                            alt={rating.albumName}
                                            className="w-16 h-16 rounded object-cover"
                                        />
                                        <div className="ml-4 flex-1">
                                            <h3 className="font-medium text-gray-900">{rating.albumName}</h3>
                                            <p className="text-sm text-gray-500">{rating.artistName}</p>
                                        </div>
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <span
                                                    key={i}
                                                    className={`text-lg ${
                                                        i < rating.rating ? 'text-yellow-400' : 'text-gray-300'
                                                    }`}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Your Lists */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Your Lists</h2>
                            <div className="flex space-x-4 items-center">
                                <Link to="/lists" className="text-blue-600 hover:text-blue-500 text-sm">
                                    View All
                                </Link>
                                <Link
                                    to="/lists/create"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                                >
                                    Create New
                                </Link>
                            </div>
                        </div>

                        {userLists.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No lists created yet</p>
                                <Link
                                    to="/lists/create"
                                    className="mt-4 inline-block text-blue-600 hover:text-blue-500"
                                >
                                    Create your first list
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {userLists.map(list => (
                                    <Link
                                        key={list.id}
                                        to={`/lists/${list.id}`}
                                        className="block p-4 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium text-gray-900">{list.name}</h3>
                                                {list.description && (
                                                    <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                                                        {list.description}
                                                    </p>
                                                )}
                                            </div>
                                            {list.isPublic && (
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                    Public
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-2 text-sm text-gray-400">
                                            {list.albums?.length || 0} albums
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Shortcuts at bottom of page */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link
                        to="/search"
                        className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white hover:from-purple-500 hover:to-indigo-500 transition-all transform hover:-translate-y-1"
                    >
                        <h3 className="font-bold text-xl mb-2">Discover Music</h3>
                        <p className="text-purple-100">
                            Search and rate new albums to expand your collection
                        </p>
                    </Link>
                    <Link
                        to="/lists/create"
                        className="p-6 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl text-white hover:from-blue-500 hover:to-cyan-500 transition-all transform hover:-translate-y-1"
                    >
                        <h3 className="font-bold text-xl mb-2">Create a List</h3>
                        <p className="text-blue-100">
                            Organize your favorite albums into your very own list
                        </p>
                    </Link>
                    <Link
                        to="/profile"
                        className="p-6 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl text-white hover:from-green-500 hover:to-teal-500 transition-all transform hover:-translate-y-1"
                    >
                        <h3 className="font-bold text-xl mb-2">View Profile</h3>
                        <p className="text-green-100">
                            Check your ratings, lists, and update your profile
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;