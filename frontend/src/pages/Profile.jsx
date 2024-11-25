import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// For the user Profile.

const Profile = () => {
    const { user } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('ratings'); // 'ratings' or 'lists'

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const token = localStorage.getItem('token');
            // Fetch profile with ratings
            const profileResponse = await fetch('http://localhost:5007/api/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!profileResponse.ok) {
                throw new Error('Failed to fetch profile data');
            }

            const profileData = await profileResponse.json();

            // Fetch user's lists
            const listsResponse = await fetch('http://localhost:5007/api/lists', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!listsResponse.ok) {
                throw new Error('Failed to fetch lists');
            }

            const listsData = await listsResponse.json();

            setProfileData(profileData.data);
            setRatings(profileData.data.ratings || []);
            setLists(listsData.data || []);
        } catch (error) {
            console.error('Error fetching profile data:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <div className="flex items-center space-x-6">
                    <img
                        src={user?.avatar_url || '/avatars/default-1.png'}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover"
                    />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {user?.username}
                        </h1>
                        <p className="text-gray-600 mt-2">
                            {profileData?.description || `Hello my name is ${user?.username}`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabs - Ability to switch between Ratings and Lists tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('ratings')}
                        className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'ratings'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Ratings
                    </button>
                    <button
                        onClick={() => setActiveTab('lists')}
                        className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'lists'
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Lists
                    </button>
                </nav>
            </div>

            {/* Content */}
            {activeTab === 'ratings' ? (
                <div className="space-y-8">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-900">Recent Ratings</h2>
                    </div>

                    {ratings.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <p className="text-gray-600">No ratings yet</p>
                            <Link
                                to="/search"
                                className="mt-4 inline-block text-blue-600 hover:text-blue-500"
                            >
                                Start rating albums
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {ratings.map((rating) => (
                                <Link
                                    key={rating.id}
                                    to={`/album/${rating.albumId}`}
                                    className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex space-x-4">
                                        <img
                                            src={rating.albumImage || '/album-placeholder.png'}
                                            alt={rating.albumName}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                        <div>
                                            <h3 className="font-medium text-gray-900 truncate">
                                                {rating.albumName}
                                            </h3>
                                            <p className="text-sm text-gray-500 truncate">
                                                {rating.artistName}
                                            </p>
                                            <div className="mt-2 flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <span
                                                        key={i}
                                                        className={`text-xl ${
                                                            i < rating.rating
                                                              ? 'text-yellow-400'
                                                              : 'text-gray-300'
                                                        }`}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    {rating.review && (
                                        <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                                            {rating.review}
                                        </p>
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-8">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-900">My Lists</h2>
                        <Link
                            to="/lists/create"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Create New List
                        </Link>
                    </div>

                    {lists.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <p className="text-gray-600">No lists created yet</p>
                            <Link
                                to="/lists/create"
                                className="mt-4 inline-block text-blue-600 hover:text-blue-500"
                            >
                                Create your first list
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {lists.map((list) => (
                                <Link
                                    key={list.id}
                                    to={`/lists/${list.id}`}
                                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium text-gray-900">{list.name}</h3>
                                            {list.description && (
                                                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
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
                                    <p className="mt-4 text-xs text-gray-400">
                                        Created {new Date(list.createdAt).toLocaleDateString()}
                                    </p>
                                    {list.albums && (
                                        <p className="mt-1 text-xs text-gray-500">
                                            {list.albums.length} albums
                                        </p>
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Profile;