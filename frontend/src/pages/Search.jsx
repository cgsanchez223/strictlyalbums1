import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Handles the search. Connects to Spotify API in the backend server

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Auto search when debounced search term changes
    useEffect(() => {
        if (debouncedSearchTerm) {
            searchAlbums();
        }
    }, [debouncedSearchTerm]);

    const searchAlbums = async () => {
        if (!searchTerm.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5007/api/spotify/search?query=${encodeURIComponent(searchTerm)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch albums');
            }

            const data = await response.json();

            if (data.success) {
                setAlbums(data.data.items || []);
            } else {
                setError(data.message || 'Failed to fetch albums');
            }
        } catch (error) {
            console.error('Error searching albums:', error);
            setError('Error searching albums. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            searchAlbums();
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col items-center space-y-8">
                {/* Search Input */}
                <div className="w-full max-w-2xl">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Search for albums..."
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                        onClick={searchAlbums}
                        disabled={loading || !searchTerm.trim()}
                        className={`mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                            (loading || !searchTerm.trim()) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Searching...
                            </div>
                        ) : 'Search'}
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="w-full max-w-2xl bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        {error}
                    </div>
                )}

                {/* No Results Message */}
                {!loading && searchTerm && albums.length === 0 && !error && (
                    <div className="text-gray-600">
                        No albums found for "{searchTerm}"
                    </div>
                )}

                {/* Albums Grid */}
                <div className="grid grid-cols-1 dm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                    {albums.map((album) => (
                        <Link
                            key={album.id}
                            to={`/album/${album.id}`}
                            className="block hover:opacity-75 transition-opacity"
                        >
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="aspect-square relative">
                                    <img
                                        src={album.images[0]?.url || '/album-placeholder.png'}
                                        alt={album.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-medium text-gray-900 truncate">
                                        {album.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 truncate">
                                        {album.artists[0]?.name}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(album.release_date).getFullYear()}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Search;