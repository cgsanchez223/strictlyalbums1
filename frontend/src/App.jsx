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
import Lists from './pages/Lists.jsx';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className='min-h-screen bg-gray-50'>
          <Navbar />
          <ProtectedRoute>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="/search" element={<Search />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/edit" element={<EditProfile />} />
              <Route path="/album/:id" element={<AlbumDetail />} />
              <Route path="/lists" element={<Lists />} />
              <Route path="/profile/edit" element={<EditProfile />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/lists/create" element={<CreateList />} />
              <Route path="/lists/:listId" element={<ListDetail />} />
              <Route path="/lists/:listId/edit" element={<EditList />} />
              </Routes>
          </ProtectedRoute>
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