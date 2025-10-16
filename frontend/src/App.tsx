import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Users from './pages/Users';
import UserForm from './pages/UserForm';
import UserDetail from './pages/UserDetail';
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          <Routes>
            {/* Public Routes - No Navbar */}
            <Route path="/login" element={
              <Layout showNavbar={false}>
                <Login />
              </Layout>
            } />
            <Route path="/signup" element={
              <Layout showNavbar={false}>
                <Signup />
              </Layout>
            } />
            <Route path="/unauthorized" element={
              <Layout showNavbar={false}>
                <Unauthorized />
              </Layout>
            } />
            
            {/* Public Landing Page - With Navbar */}
            <Route path="/" element={
              <Layout showNavbar={true}>
                <Home />
              </Layout>
            } />
            
            {/* Protected Routes - With Navbar */}
            <Route path="/users" element={
              <Layout showNavbar={true}>
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              </Layout>
            } />
            <Route path="/users/new" element={
              <Layout showNavbar={true}>
                <ProtectedRoute>
                  <UserForm />
                </ProtectedRoute>
              </Layout>
            } />
            <Route path="/users/:id" element={
              <Layout showNavbar={true}>
                <ProtectedRoute>
                  <UserDetail />
                </ProtectedRoute>
              </Layout>
            } />
            <Route path="/users/:id/edit" element={
              <Layout showNavbar={true}>
                <ProtectedRoute>
                  <UserForm />
                </ProtectedRoute>
              </Layout>
            } />
          </Routes>
        </Router>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;