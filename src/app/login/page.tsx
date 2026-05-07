'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Check if already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    console.log('Checking existing login:', isLoggedIn);
    if (isLoggedIn === 'true') {
      console.log('Already logged in, redirecting to dashboard');
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt with:', username, password);
    setLoading(true);
    setError('');
    
    // Hardcoded credentials check
    if (username === 'admin' && password === 'admin123') {
      console.log('Login successful!');
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify({ username: 'admin', role: 'admin' }));
      // Set cookie for middleware
      document.cookie = "isLoggedIn=true; path=/";
      console.log('Redirecting to dashboard...');
      // Use router.push for Next.js navigation
      router.push('/dashboard');
    } else {
      console.log('Login failed: Invalid credentials');
      setError('Invalid username or password. Use admin / admin123');
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
      }}>
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '15px',
          width: '400px',
          textAlign: 'center'
        }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    }}>
      <div style={{ 
        background: 'white', 
        padding: '2rem', 
        borderRadius: '15px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        width: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {/* Campus Image */}
          <div style={{ 
            width: '80px', 
            height: '80px', 
            margin: '0 auto 1rem',
            position: 'relative',
            borderRadius: '50%',
            overflow: 'hidden',
            backgroundColor: '#f0f0f0'
          }}>
            <Image
              src="/images/blc.png"
              alt="BLC Campus Logo"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
          <h2 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>BLC Campus</h2>
          <p style={{ color: '#6c757d' }}>Online Class Schedule System</p>
        </div>
        
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '600' 
            }}>Username</label>
            <input
              type="text"
              style={{ 
                width: '100%', 
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '1rem'
              }}
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '600' 
            }}>Password</label>
            <input
              type="password"
              style={{ 
                width: '100%', 
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '1rem'
              }}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {error && (
            <div style={{ 
              background: '#f8d7da', 
              color: '#721c24', 
              padding: '0.75rem', 
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '0.75rem',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'transform 0.2s'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}