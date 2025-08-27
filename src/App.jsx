import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import StatsPage from './pages/StatsPage';
import NotesPage from './pages/NotesPage';
import ProtectedRoute from './components/ProtectedRoute';
import ThemeToggle from './components/ThemeToggle';
import DashboardLayout from './components/DashboardLayout';

function App() {
  return (
    <Router>
      <ThemeToggle />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage />} /> {/* Home page as index route */}
          <Route path="stats" element={<StatsPage />} />
          <Route path="notes" element={<NotesPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
