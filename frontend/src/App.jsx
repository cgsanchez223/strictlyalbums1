import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home';
import Login from './pages/Login'
import SignUp from './pages/Register.jsx';
import Search from './pages/Search.jsx';
import Profile from './pages/Profile.jsx';
import AlbumDetail from './pages/AlbumDetail.jsx';
import EditProfile from './pages/EditProfile.jsx';
import CreateList from './pages/CreateList.jsx';
import ListDetail from './pages/ListDetail.jsx';
import EditList from './pages/EditList.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import Dashboard from './pages/Dashboard.jsx';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className='min-h-screen bg-gray-50'>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/search" element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            <Route path="/profile/edit" element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            } />

            <Route path="/album/:id" element={
              <ProtectedRoute>
                <AlbumDetail />
              </ProtectedRoute>
            } />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            <Route path="/lists/create" element={
              <ProtectedRoute>
                <CreateList />
              </ProtectedRoute>
            } />

            <Route path="/lists/:listId" element={
              <ProtectedRoute>
                <ListDetail />
              </ProtectedRoute>
            } />

            <Route path="/lists/:listId/edit" element={
              <ProtectedRoute>
                <EditList />
              </ProtectedRoute>
            } />
            
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default App;