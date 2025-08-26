import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === 'matthews' && password === 'MAtt1233xd') {
      onLogin();
      navigate('/');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="bg-sand min-h-screen flex items-center justify-center">
      <div className="bg-champagne p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-charcoal-gray mb-4">Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 rounded-md border border-taupe bg-white"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 rounded-md border border-taupe bg-white"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-terracotta text-white p-2 rounded-md hover:bg-opacity-90"
        >
          Login
        </button>
      </div>
    </div>
  );
}
