'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify({ username: 'admin', role: 'admin' }));
      window.location.href = '/dashboard';
    } else {
      setError('Invalid username or password. Use admin / admin123');
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="card p-4 shadow-lg" style={{ width: '400px', borderRadius: '15px' }}>
        <div className="text-center mb-4">
          <div className="mb-3">
            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center mx-auto" style={{ width: '60px', height: '60px' }}>
              <span style={{ fontSize: '30px' }}>📚</span>
            </div>
          </div>
          <h2 className="fw-bold">BLC Campus</h2>
          <p className="text-muted">Online Class Schedule System</p>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button type="button" className="btn-close" onClick={() => setError('')}></button>
            </div>
          )}
          
          <button 
            type="submit" 
            className="btn btn-primary w-100 py-2 fw-semibold"
            disabled={loading}
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              transition: 'transform 0.2s'
            }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
        
        <div className="text-center mt-3">
          <small className="text-muted">
            Demo Credentials: admin / admin123
          </small>
        </div>
      </div>
    </div>
  );
}