import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// AlbumDetail handles retrieving album data from Spotify API
// Additional styling is applied to make albums load into organized grid

const AlbumDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [album, setAlbum] = useState(null);
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [review, setReview] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Retrieves album data from Spotify API
        const fetchAlbum = async () => {
            try {
                const token = localStorage.getItem('token');
                // Update to your backend endpoint
                const response = await fetch(`http://localhost:5007/api/spotify/albums/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch album');
                }

                const data = await response.json();
                if (data.success) {
                    setAlbum(data.data);

                    // Fetch user's existing rating if any
                    try {
                        const ratingResponse = await fetch(`http://localhost:5007/api/ratings/album/${id}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });

                        if (ratingResponse.ok) {
                            const ratingData = await ratingResponse.json();
                            if (ratingData.success) {
                                setRating(ratingData.data.rating);
                                setReview(ratingData.data.review);
                            }
                        }
                    } catch (ratingError) {
                        console.error('Error fetching rating:', ratingError);
                    }
                } else {
                    throw new Error(data.message || 'Failed to fetch album');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAlbum();
    }, [id]);

    // Handles submitting the rating
    const handleRatingSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

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
                    rating,
                    review
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit rating');
            }

            setSuccess(true);
            setTimeout(() => {
                navigate('/profile');
            }, 1500);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Loading when searching album - I get errors if search is too broad. API crashes if too many results are fetched
    // Provides load screen with spinning circle
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg shadow-sm">
                    Error: {error}
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
                        <h1 className="text-3xl font-bold text-gray-900">{album.name}</h1>
                        <p className="text-xl text-gray-600 mt-2">{album.artists[0].name}</p>

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
                            {error && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {success && (
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
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoveredRating(star)}
                                            onMouseLeave={() => setHoveredRating(0)}
                                            className="text-3xl focus:outline-none"
                                        >
                                            <span className={`${
                                                star <= (hoveredRating || rating)
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
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Write your review here..."
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting || !rating}
                                className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                    (isSubmitting || !rating) ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {isSubmitting ? (
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
        </div>
    );
};

export default AlbumDetail;