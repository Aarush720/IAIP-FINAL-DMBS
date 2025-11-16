import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import FacultyPage from './pages/FacultyPage';
import CoursesPage from './pages/CoursesPage';
import AttendancePage from './pages/AttendancePage';
import AssessmentsPage from './pages/AssessmentsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminPage from './pages/AdminPage';
import ReportPage from './pages/ReportPage';
import MarkSheetPage from './pages/MarkSheetPage';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <HashRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<WelcomePage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/attendance" element={<AttendancePage />} />
                <Route path="/assessments" element={<AssessmentsPage />} />
                <Route path="/marksheet" element={<MarkSheetPage />} />
                
                <Route path="/students" element={<ProtectedRoute allowedRoles={['Faculty', 'Admin']}><StudentsPage /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute allowedRoles={['Faculty', 'Admin']}><AnalyticsPage /></ProtectedRoute>} />
                
                <Route path="/faculty" element={<ProtectedRoute allowedRoles={['Admin']}><FacultyPage /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute allowedRoles={['Admin']}><AdminPage /></ProtectedRoute>} />
                <Route path="/report" element={<ProtectedRoute allowedRoles={['Admin']}><ReportPage /></ProtectedRoute>} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </HashRouter>
  );
};

export default App;