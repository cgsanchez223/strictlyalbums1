import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Handles lists

const Lists = () => {
    const { user } = useAuth();
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // all, public, private

    useEffect(() => {
        fetchLists();
    }, []);

    const fetchLists = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5007/api/lists', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch lists');
            }

            setLists(data.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredLists = lists.filter(list => {
        if (filter === 'public') return list.isPublic;
        if (filter === 'private') return !list.isPublic;
        return true;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Your Lists</h1>
                            <p className="mt-2 text-blue-100">
                                Organize and share your music collections
                            </p>
                        </div>
                        <Link
                            to="/lists/create"
                            className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                        >
                            Create New List
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Filters */}
                <div className="mb-6 flex space-x-4">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg ${
                            filter === 'all'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        All Lists
                    </button>
                    <button
                        onClick={() => setFilter('public')}
                        className={`px-4 py-2 rounded-lg ${
                            filter === 'public'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Public Lists
                    </button>
                    <button
                        onClick={() => setFilter('private')}
                        className={`px-4 py-2 rounded-lg ${
                            filter === 'private'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Private Lists
                    </button>
                </div>

                {/* Lists Grid */}
                {filteredLists.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No lists found
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {filter !== 'all'
                                ? `You don't have any ${filter} lists yet.`
                                : "You haven't created any lists yet."}
                        </p>
                        <Link
                            to="/lists/create"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Create Your First List
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredLists.map(list => (
                            <Link
                                key={list.id}
                                to={`/lists/${list.id}`}
                                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900 mb-1">
                                            {list.name}
                                        </h2>
                                        {list.description && (
                                            <p className="text-gray-600 line-clamp-2">
                                                {list.description}
                                            </p>
                                        )}
                                    </div>
                                    {list.isPublic && (
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                            Public
                                        </span>
                                    )}
                                </div>

                                {/* List Stats */}
                                <div className="mt-auto pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <div>
                                            {list.albums?.length || 0} albums
                                        </div>
                                        <div>
                                            Created {new Date(list.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Lists;