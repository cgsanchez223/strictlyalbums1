import { Link } from "react-router-dom";

// This is the Homepage if you are not signed in.

const Home = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <div className="max-w-4xl w-full text-center space-y-8">
                <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
                    StrictlyAlbums
                </h1>

                <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
                    Search and rate your favorite albums. Create playlists.
                </p>

                <div className="mt-8 flex-col sm:flex-row gap-4 justify-content">
                    <Link
                        to="/register"
                        className="px-8 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                    >
                        Get Started
                    </Link>
                    <Link
                        to="/login"
                        className="px-8 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;