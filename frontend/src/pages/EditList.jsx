import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Handles editing a list

const EditList = () => {
    const { listId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        isPublic: false,
    });

    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

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

            // Check if user owns the list
            if (data.data.userId !== user.id) {
                navigate('/profile');
                return;
            }

            setFormData({
                name: data.data.name,
                description: data.data.description || '',
                isPublic: data.data.isPublic || false
            });

            setAlbums(data.data.albums || []);

        } catch (err) {
            console.error('Fetch list error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData(prev => ({
            ...prev,
            [e.target.name]: value
        }));
    };

    const handleRemoveAlbum = async (albumId) => {
        try {
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

            setAlbums(prev => prev.filter(album => album.id !== albumId));

        } catch (err) {
            console.error('Remove album error:', err);
            setError(err.message);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5007/api/lists/${listId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update list');
            }

            setSuccess(true);
            setTimeout(() => {
                navigate(`/lists/${listId}`);
            }, 1500);
        } catch (err) {
            console.error('Update list error:', err);
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this list?')) {
            return;
        }

        try {
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
        }
    };

    if (loading) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
            </div>
        );
    }

    return (
        <div className='max-w-4xl mx-auto px-4 py-8'>
            <div className='mb-8'>
                <div className='flex justify-between items-center'>
                    <h1 className='text-3xl font-bold text-gray-900'>Edit List</h1>
                    <div className='flex space-x-4'>
                        <button
                            type="button"
                            onClick={() => navigate(`/lists/${listId}`)}
                            className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
                        >
                            Delete List
                        </button>
                    </div>
                </div>
                <p className='mt-2 text-sm text-gray-600'>
                    Edit your list details and manage albums
                </p>
            </div>

            {error && (
                <div className='mb-6 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg'>
                    {error}
                </div>
            )}

            {success && (
                <div className='mb-6 bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded-lg'>
                    List updated successfully! Redirecting...
                </div>
            )}

            <div className='bg-white rounded-lg shadow-sm p-6'>
                <form onSubmit={handleSave} className='space-y-6'>
                    <div>
                        <label
                            htmlFor='name'
                            className='block text-sm font-medium text-gray-700'
                        >
                            List Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500'
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor='description'
                            className='block text-sm font-medium text-gray-700'
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500'
                            placeholder='Add a description for your list'
                        />
                    </div>

                    <div className='flex items-center'>
                        <input
                            type="checkbox"
                            id="isPublic"
                            name="isPublic"
                            checked={formData.isPublic}
                            onChange={handleChange}
                            className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                        />
                        <label
                            htmlFor='isPublic'
                            className='ml-2 text-sm text-gray-700'
                        >
                            Make this list public
                        </label>
                    </div>

                    <div className='pt-6 border-t border-gray-200'>
                        <h2 className='text-lg font-medium text-gray-900 mb-4'>Albums in List</h2>

                        {albums.length === 0 ? (
                            <div className='text-center py-8 bg-gray-50 rounded-lg'>
                                <p className='text-gray-600'>No albums in this list</p>
                                <Link
                                    to="/search"
                                    className='mt-4 inline-block text-blue-600 hover:text-blue-500'
                                >
                                    Search for albums to add
                                </Link>
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                                {albums.map(album => (
                                    <div
                                        key={album.id}
                                        className='bg-gray-50 rounded-lg p-4 flex space-x-4'
                                    >
                                        <img
                                            src={album.imageUrl || '/album-placeholder.png'}
                                            alt={album.name}
                                            className='w-16 h-16 object-cover rounded'
                                        />
                                        <div className='flex-1 min-w-0'>
                                            <p className='text-sm font-medium text-gray-900 truncate'>
                                                {album.name}
                                            </p>
                                            <p className='text-sm text-gray-500 truncate'>
                                                {album.artistName}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveAlbum(album.id)}
                                                className='mt-2 text-sm text-red-600 hover:text-red-700'
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className='flex justify-end pt-6'>
                        <button
                            type="submit"
                            disabled={saving}
                            className={`px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                                saving ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              {saving ? (
                                <span className="flex items-center">
                                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Saving...
                                </span>
                              ) : (
                                'Save Changes'
                              )}
                            </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditList;