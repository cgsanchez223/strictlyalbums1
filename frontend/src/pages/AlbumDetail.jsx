import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// AlbumDetail handles retrieving album data from Spotify API
// Additional styling is applied to make albums load into organized grid
// 11/25 update - adding tweaks to properly add albums to lists

const AlbumDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    // Album and rating states
    const [album, setAlbum] = useState(null);
    const [userRating, setUserRating] = useState({
        rating: 0,
        review: '',
    });
    const [hoveredRating, setHoveredRating] = useState(0);

    // List management states
    const [userLists, setUserLists] = useState([]);
    const [selectedListId, setSelectedListId] = useState(null);
    const [showListModal, setShowListModal] = useState(false);

    // UI states
    const [loading, setLoading] = useState({
        album: true,
        lists: false,
        submitRating: false,
        addToList: false,
    });
    const [error, setError] = useState({
        album: null,
        rating: null,
        lists: null,
        addToList: null,
    });
    const [success, setSuccess] = useState({
        rating: false,
        addToList: false,
    });

    useEffect(() => {
        // Retrieves album data from Spotify API
        const fetchAlbumData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [albumResponse, ratingResponse] = await Promise.all([
                    fetch(`http://localhost:5007/api/spotify/albums/${id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(`http://localhost:5007/api/ratings/album/${id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                const albumData = await albumResponse.json();
                if (!albumResponse.ok) throw new Error(albumData.message || 'Failed to fetch album');
                setAlbum(albumData.data);
                
                if (ratingResponse.ok) {
                    const ratingData = await ratingResponse.json();
                    if (ratingData.success) {
                        setUserRating({
                            rating: ratingData.data.rating,
                            review: ratingData.data.review,
                        });
                    }
                }
            } catch (err) {
                setError(prev => ({ ...prev, album: err.message }));
            } finally {
                setLoading(prev => ({ ...prev, album: false }));
            }
        };

        fetchAlbumData();
    }, [id]);

    // Handles submitting the rating
    const handleRatingSubmit = async (e) => {
        e.preventDefault();
        setLoading(prev => ({ ...prev, submitRating: true }));
        setError(prev => ({ ...prev, rating: null }));
        setSuccess(prev => ({ ...prev, rating: false }));

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5007/api/ratings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    albumId: id,
                    albumName: album.name,
                    artistName: album.artists[0].name,
                    albumImage: album.images[0]?.url,
                    rating: userRating.rating,
                    review: userRating.review
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to submit rating');

            setSuccess(prev => ({ ...prev, rating: true }));
            setTimeout(() => navigate('/profile'), 1500);
        } catch (err) {
            setError(prev => ({ ...prev, rating: err.message }));
        } finally {
            setLoading(prev => ({ ...prev, submitRating: false }));
        }
    };

    // Handle list management
    const fetchUserLists = async () => {
        setLoading(prev => ({ ...prev, lists: true }));
        setError(prev => ({ ...prev, lists: null }));

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5007/api/lists', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch lists');

            setUserLists(data.data || []);
        } catch (err) {
            setError(prev => ({ ...prev, lists: err.message }));
        } finally {
            setLoading(prev => ({ ...prev, lists: false }));
        }
    };

    const handleAddToList = async () => {
        if (!selectedListId) return;

        setLoading(prev => ({ ...prev, addToList: true }));
        setError(prev => ({ ...prev, addToList: null }));
        setSuccess(prev => ({ ...prev, addToList: false }));

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5007/api/lists/${selectedListId}/albums`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    albumId: id,
                    albumName: album.name,
                    artistName: album.artists[0].name,
                    imageUrl: album.images[0]?.url
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to add to list');

            setSuccess(prev => ({ ...prev, addToList: true }));
            setTimeout(() => {
                setShowListModal(false);
                setSelectedListId(null);
                setSuccess(prev => ({ ...prev, addToList: false }));
            }, 1500);
        } catch (err) {
            setError(prev => ({ ...prev, addToList: err.message }));
        } finally {
            setLoading(prev => ({ ...prev, addToList: false }));
        }
    };

    // Loading when searching album - I get errors if search is too broad. API crashes if too many results are fetched
    // Provides load screen with spinning circle
    if (loading.album) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error.album) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg shadow-sm">
                    Error: {error.album}
                </div>
            </div>
        );
    }

    // Note: I am not sure how to get an album not found. Even typing gibberish gets results
    if (!album) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl text-gray-600">Album not found</div>
            </div>
        );
    }

    // Returns album detail including album/artist name, release date, number of tracks, album artwork, tracks on the album
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="md:flex">
                    {/* Album Image */}
                    <div className="md:w-1/2">
                        <img
                            src={album.images[0]?.url}
                            alt={album.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Album Details and Rating Form */}
                    <div className="md:w-1/2 p-6 md:p-8">
                        {/* Header with Title and Add to List Button */}
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{album.name}</h1>
                                <p className="text-xl text-gray-600 mt-2">{album.artists[0].name}</p>
                            </div>
                            <button
                                onClick={() => {
                                    fetchUserLists();
                                    setShowListModal(true);
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Add to List
                            </button>
                        </div>


                        {/* Album Info */}
                        <div className="mt-6 space-y-2">
                            <p className="text-gray-600">
                                Release Date: {new Date(album.release_date).toLocaleDateString()}
                            </p>
                            <p className="text-gray-600">
                                Tracks: {album.total_tracks}
                            </p>
                            {/* I have been having trouble obtaining genres */}
                            {album.genres?.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {album.genres.map(genre => (
                                        <span
                                            key={genre}
                                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                        >
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Track List - Contains track titles and also runtime of tracks */}
                        <div className="mt-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">Tracks</h2>
                            <div className="max-h-40 overflow-y-auto space-y-2">
                                {album.tracks?.items?.map((track, index) => (
                                    <div
                                        key={track.id}
                                        className="flex justify-between items-center text-sm text-gray-600 hover:bg-gray-50 p-2 rounded"
                                    >
                                        <span>{index + 1}. {track.name}</span>
                                        <span>{Math.floor(track.duration_ms / 60000)}:{String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Rating Form */}
                        <form onSubmit={handleRatingSubmit} className="mt-8 space-y-6">
                            {error.rating && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                                    {error.rating}
                                </div>
                            )}

                            {success.rating && (
                                <div className="bg-green-50 text-green-600 p-4 rounded-lg">
                                    Rating submitted successfully! Redirecting...
                                </div>
                            )}

                            {/* Star Rating - handles hovering over star icons to select rating */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Your Rating
                                </label>
                                <div className="flex space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setUserRating(prev => ({ ...prev, rating: star }))}
                                            onMouseEnter={() => setHoveredRating(star)}
                                            onMouseLeave={() => setHoveredRating(0)}
                                            className="text-3xl focus:outline-none"
                                        >
                                            <span className={`${
                                                star <= (hoveredRating || userRating.rating)
                                                    ? 'text-yellow-400'
                                                    : 'text-gray-300'
                                            } hover:scale-110 transition-transform`}>
                                                ★
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Review Text Area */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Your Review
                                </label>
                                <textarea
                                    value={userRating.review}
                                    onChange={(e) => setUserRating(prev => ({ ...prev, review: e.target.value }))}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Write your review here..."
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading.submitRating || !userRating.rating}
                                className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                    (loading.submitRating || !userRating.rating) ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {loading.submitRating ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Submitting...
                                    </div>
                                    ) : (
                                    'Submit Rating'
                                    )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Add to List Modal */}
            {showListModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Add to List</h2>
                            <button
                                onClick={() => setShowListModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ×
                            </button>
                        </div>

                        {error.lists && (
                            <div className="mb-4 bg-red-50 text-red-600 p-4 rounded-lg">
                                {error.lists}
                            </div>
                        )}

                        {error.addToList && (
                            <div className="mb-4 bg-red-50 text-red-600 p-4 rounded-lg">
                                {error.addToList}
                            </div>
                        )}

                        {success.addToList ? (
                            <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-4">
                                Album added to list successfully!
                            </div>
                        ) : (
                            <>
                                {loading.lists ? (
                                    <div className="flex justify-center py-4">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600">
                                        </div>
                                    </div>
                                ) : userLists.length === 0 ? (
                                    <div className="text-center py-4">
                                        <p className="text-gray-600 mb-4">You haven't created any lists yet</p>
                                        <Link
                                            to="/lists/create"
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                                        >
                                            Create Your First List
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {/* List Selection */}
                                        <div className="max-h-60 overflow-y-auto space-y-2">
                                            {userLists.map(list => (
                                                <button
                                                    key={list.id}
                                                    onClick={() => setSelectedListId(list.id)}
                                                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                                                        selectedListId === list.id
                                                            ? 'bg-blue-50 border-2 border-blue-500'
                                                            : 'hover:bg-gray-50 border-2 border-transparent'
                                                    }`}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <div className="font-medium text-gray-900">{list.name}</div>
                                                            {list.description && (
                                                                <div className="text-sm teext-gray-500 truncate mt-1">
                                                                    {list.description}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {list.isPublic && (
                                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                                Public
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-gray-500 mt-1">
                                                        {list.albums?.length || 0} albums
                                                    </div>
                                                </button>
                                            ))}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                            <Link
                                                to="/lists/create"
                                                className="text-sm text-blue-600 hover:text-blue-700"
                                            >
                                                Create New List
                                            </Link>

                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={() => setShowListModal(false)}
                                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                                                >
                                                    Cancel
                                                </button>
                                                <button 
                                                    onClick={handleAddToList}
                                                    disabled={!selectedListId || loading.addToList}
                                                    className={`px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors ${
                                                        !selectedListId || loading.addToList ? 'opacity-50 cursor-not-allowed' : ''
                                                    }`}
                                                >
                                                    {loading.addToList ? (
                                                        <div className="flex items-center">
                                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Adding...
                                                        </div>
                                                    ) : (
                                                        'Add to List'
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AlbumDetail;