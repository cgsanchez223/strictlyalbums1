import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// AuthProvider helps connect to backend Authorization.
// Creates tokens for access to the Spotify API
// Provides users access when registering an account and signing in

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Verify token on mount
    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch('http://localhost:5007/api/auth/verify', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setUser(data.data.user);
                        setIsAuthenticated(true);
                    } else {
                        // If token is invalid, clean up
                        localStorage.removeItem('token');
                        setUser(null);
                        setIsAuthenticated(false);
                    }
                } catch (error) {
                    console.error('Token verification error:', error);
                    localStorage.removeItem('token');
                    setUser(null);
                    setIsAuthenticated(false);
                }
            }
            setLoading(false);
        };

        verifyToken();
    }, []);

    // Handles user registration. Sends response to server to obtain authentication.
    const register = async (username, email, password, avatar_url) => {
        try {
            const response = await fetch('http://localhost:5007/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    confirmPassword: password,
                    avatar_url
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            setUser(data.data.user);
            setIsAuthenticated(true);
            localStorage.setItem('token', data.data.token);

            return {
                success: true,
                data: data.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    };

    // Retrieves user data for login access.
    const login = async (email, password) => {
        try {
            const response = await fetch('http://localhost:5007/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            setUser(data.data.user);
            setIsAuthenticated(true);
            localStorage.setItem('token', data.data.token);

            return {
                success: true,
                data: data.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    };

    // Ends session with user
    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                loading,
                register,
                login,
                logout
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context;
};