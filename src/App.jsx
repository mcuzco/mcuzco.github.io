import React, { useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import PomodoroPage from './pages/PomodoroPage';
import StatsPage from './pages/StatsPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <div className="bg-sand text-charcoal-gray min-h-screen">
      {isAuthenticated && (
        <nav className="bg-champagne p-4 shadow-md">
          <Link to="/" className="mr-4 text-terracotta hover:underline">Pomodoro</Link>
          <Link to="/stats" className="text-terracotta hover:underline">Stats</Link>
        </nav>
      )}
      <Routes>
        <Route
          path="/login"
          element={<LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/"
          element={
            isAuthenticated ? <PomodoroPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/stats"
          element={
            isAuthenticated ? <StatsPage /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
