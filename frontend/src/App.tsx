import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import FacultyLayout from './components/FacultyLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import FacultyRoute from './components/FacultyRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Users from './pages/Users';
import UserForm from './pages/UserForm';
import UserDetail from './pages/UserDetail';
import Unauthorized from './pages/Unauthorized';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUserSearch from './pages/admin/AdminUserSearch';
import AdminUserForm from './pages/admin/AdminUserForm';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import FacultyStudents from './pages/faculty/FacultyStudents';
import FacultyEvents from './pages/faculty/FacultyEvents';
import FacultyAttendance from './pages/faculty/FacultyAttendance';

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
            
            {/* Admin Routes - With Admin Layout */}
            <Route path="/admin/dashboard" element={
              <AdminLayout>
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              </AdminLayout>
            } />
            <Route path="/admin/users" element={
              <AdminLayout>
                <AdminRoute>
                  <AdminUserSearch />
                </AdminRoute>
              </AdminLayout>
            } />
            <Route path="/admin/users/student" element={
              <AdminLayout>
                <AdminRoute>
                  <AdminUserForm userType="STUDENT" />
                </AdminRoute>
              </AdminLayout>
            } />
            <Route path="/admin/users/faculty" element={
              <AdminLayout>
                <AdminRoute>
                  <AdminUserForm userType="FACULTY" />
                </AdminRoute>
              </AdminLayout>
            } />
            <Route path="/admin/users/admin" element={
              <AdminLayout>
                <AdminRoute>
                  <AdminUserForm userType="ADMIN" />
                </AdminRoute>
              </AdminLayout>
            } />
            
            {/* Faculty Routes - With Faculty Layout */}
            <Route path="/faculty/dashboard" element={
              <FacultyLayout>
                <FacultyRoute>
                  <FacultyDashboard />
                </FacultyRoute>
              </FacultyLayout>
            } />
            <Route path="/faculty/students" element={
              <FacultyLayout>
                <FacultyRoute>
                  <FacultyStudents />
                </FacultyRoute>
              </FacultyLayout>
            } />
            <Route path="/faculty/events" element={
              <FacultyLayout>
                <FacultyRoute>
                  <FacultyEvents />
                </FacultyRoute>
              </FacultyLayout>
            } />
            <Route path="/faculty/attendance" element={
              <FacultyLayout>
                <FacultyRoute>
                  <FacultyAttendance />
                </FacultyRoute>
              </FacultyLayout>
            } />
          </Routes>
        </Router>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;