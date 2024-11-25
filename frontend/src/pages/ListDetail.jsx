import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ListDetail = () => {
    const { listId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [list, setList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetchList();
    }, [listId]);

    const fetchList = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5007/api/lists/${listId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch list');
            }

            setList(data.data);
        } catch (err) {
            console.error('Fetch list error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveAlbum = async (albumId) => {
        if (!confirm('Are you sure you want to remove this album from the list?')) {
            return;
        }

        try {
            setDeleteLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5007/api/lists/${listId}/albums/${albumId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to remove album');
            }

            // Update list state after removal
            setList(prev => ({
                ...prev,
                albums: prev.albums.filter(album => album.id !== albumId)
            }));
        } catch (err) {
            console.error('Remove album error:', err);
            setError(err.message);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleDeleteList = async () => {
        if (!confirm('Are you sure you want to delete this list?')) {
            return;
        }

        try {
            setDeleteLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5007/api/lists/${listId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete list');
            }

            navigate('/profile');
        } catch (err) {
            console.error('Delete list error:', err);
            setError(err.message);
        } finally {
            setDeleteLoading(false);
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
                    Error: {error}
                </div>
            </div>
        );
    }

    if (!list) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">List not found</h2>
                    <Link
                        to="/profile"
                        className="mt-4 inline-block text-blue-600 hover:text-blue-500"
                    >
                        Return to Profile
                    </Link>
                </div>
            </div>
        );
    }

    const isOwner = user?.id === list.userId;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{list.name}</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Created by {list.user?.username || 'Unknown'} •
                            {new Date(list.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    {isOwner && (
                        <div className="flex space-x-4">
                            <Link
                                to={`/lists/${listId}/edit`}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Edit List
                            </Link>
                            <button
                                onClick={handleDeleteList}
                                disabled={deleteLoading}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {deleteLoading ? 'Deleting...' : 'Delete List'}
                            </button>
                        </div>
                    )}
                </div>
                {list.description && (
                    <p className="text-gray-600 mt-4">{list.description}</p>
                )}
            </div>

            {error && (
                <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {list.albums?.map(album => (
                    <div
                        key={album.id}
                        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                        <img
                            src={album.imageUrl || '/album-placeholder.png'}
                            alt={album.name}
                            className="w-full aspect-square object-cover"
                        />
                        <div className="p-4">
                            <h3 className="font-medium text-lg truncate">{album.name}</h3>
                            <p className="text-gray-600 truncate">{album.artistName}</p>
                            {isOwner && (
                                <button
                                    onClick={() => handleRemoveAlbum(album.id)}
                                    disabled={deleteLoading}
                                    className="mt-4 text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                                >
                                    {deleteLoading ? 'Removing...' : 'Remove from List'}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {(!list.albums || list.albums.length === 0) && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No albums in this list yet.</p>
                    {isOwner && (
                        <Link
                            to="/search"
                            className="mt-4 inline-block text-blue-600 hover:text-blue-500"
                        >
                            Search albums to add
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
};

export default ListDetail;