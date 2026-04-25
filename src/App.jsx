import { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Evaluate from './pages/Evaluate';
import Results from './pages/Results';
import History from './pages/History';
import { Auth } from './auth';
import { initTheme } from './utils';

function PrivateRoute({ children }) {
  return Auth.isLoggedIn() ? children : <Navigate to="/login" />;
}

export default function App() {
  useEffect(() => {
    initTheme();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/evaluate" element={<PrivateRoute><Evaluate /></PrivateRoute>} />
        <Route path="/results" element={<PrivateRoute><Results /></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}
