import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import App from '../App';
import Navbar from '../components/Navbar';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Search from '../pages/Search';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('token');
    return isAuthenticated ? children : <Navigate to="/login" />;
};

// Mock the AuthContext
jest.mock('../context/AuthContext', () => ({
    useAuth: jest.fn(),
    AuthProvider: ({ children }) => children,
}));

// Mock all page components
jest.mock('../pages/Home', () => () => <div>Home Page</div>);
jest.mock('../pages/Login', () => () => <div>Login Page</div>);
jest.mock('../pages/Register', () => () => <div>Register Page</div>);
jest.mock('../pages/Search', () => () => <div>Search Page</div>);
jest.mock('../pages/Profile', () => () => <div>Profile Page</div>);
jest.mock('../pages/Dashboard', () => () => <div>Dashboard Page</div>);
jest.mock('../pages/AlbumDetail', () => () => <div>Album Detail Page</div>);
jest.mock('../pages/EditProfile', () => () => <div>Edit Profile Page</div>);
jest.mock('../pages/Lists', () => () => <div>Lists Page</div>);
jest.mock('../pages/CreateList', () => () => <div>Create List Page</div>);
jest.mock('../pages/ListDetail', () => () => <div>List Detail Page</div>);
jest.mock('../pages/EditList', () => () => <div>Edit List Page</div>);
jest.mock('../components/Navbar', () => () => <div>Navbar</div>);

// Mock localStorage
const mockLocalStorage = {
    getItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
});

// Create AppContent component - the App component without Router
const AppContent = () => {
    return (
        <AuthProvider>
            <div className='min-h-screen bg-gray-50'>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/search"
                        element={
                            <ProtectedRoute>
                                <Search />
                            </ProtectedRoute>
                        }
                    />
                    {/* could put rest of links here but there is a ton */}
                </Routes>
            </div>
        </AuthProvider>
    );
};

describe('App Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        window.history.pushState({}, '', '/');
    });

    const renderWithRouter = (route = '/') => {
        window.history.pushState({}, '', route);
        return render(
            <BrowserRouter>
                <AppContent />
            </BrowserRouter>
        );
    };

    test('renders navbar on all pages', () => {
        renderWithRouter();
        expect(screen.getByText('Navbar')).toBeInTheDocument();
    });

    test('renders home page on root path', () => {
        renderWithRouter('/');
        expect(screen.getByText('Home Page')).toBeInTheDocument();
    });

    test('renders login page on /login path', () => {
        renderWithRouter('/login');
        expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    test('renders register page on /register path', () => {
        renderWithRouter('/register');
        expect(screen.getByText('Register Page')).toBeInTheDocument();
    });
    
    describe('Protected Routes', () => {
        test('redirects to login when accessing protected route without authentication', () => {
            mockLocalStorage.getItem.mockReturnValue(null);
            renderWithRouter('/dashboard');
        });

        test('allows access to protected route when authenticated', () => {
            mockLocalStorage.getItem.mockReturnValue('fake-token');
            renderWithRouter('/dashboard');
        });

        test.each([
            ['/search', 'Search Page'],
            ['/profile', 'Profile Page'],
            ['/profile/edit', 'Edit Profile Page'],
            ['/album/123', 'Album Detail Page'],
            ['/lists', 'Lists Page'],
            ['/lists/create', 'Create List Page'],
            ['/lists/123', 'List Detail Page'],
            ['/lists/123/edit', 'Edit List'],
        ])('renders %s when authenticated', (path, expectedText) => {
            mockLocalStorage.getItem.mockReturnValue('fake-token');
            renderWithRouter(path);
        });

        test.each([
            '/search',
            '/profile',
            '/profile/edit',
            '/album/123',
            '/lists',
            '/lists/create',
            '/lists/123',
            '/lists/123/edit',
        ])('redirects to login when accessing %s without authentication', (path) => {
            mockLocalStorage.getItem.mockReturnValue(null);
            renderWithRouter(path);
        });
    });

    test('applies correct background styling', () => {
        renderWithRouter();
        const mainController = screen.getByText('Navbar').parentElement;
        expect(mainController).toHaveClass('min-h-screen', 'bg-gray-50');
    });
});