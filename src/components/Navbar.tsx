'use client';

import { useState, useEffect } from 'react';
import { FiBell, FiUser, FiLogOut, FiMenu } from 'react-icons/fi';
import Notifications from './Notifications';

interface NavbarProps {
  onMenuClick?: () => void;
  onLogout: () => void;
}

export default function Navbar({ onMenuClick, onLogout }: NavbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <nav style={{
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: isMobile ? '0.75rem 1rem' : '1rem 1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 997,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {isMobile && (
          <button
            onClick={onMenuClick}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f0f0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <FiMenu size={24} />
          </button>
        )}
        <div>
          {!isMobile ? (
            <>
              <h5 style={{ margin: 0, fontWeight: 600 }}>Welcome back, Admin!</h5>
              <p style={{ margin: 0, color: '#6c757d', fontSize: '0.875rem' }}>Manage your online classes</p>
            </>
          ) : (
            <div>
              <h6 style={{ margin: 0, fontWeight: 600 }}>BLC Campus</h6>
              <p style={{ margin: 0, color: '#6c757d', fontSize: '0.75rem' }}>Admin Dashboard</p>
            </div>
          )}
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.75rem' : '1.5rem' }}>
        <Notifications />
        
        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => setShowDropdown(!showDropdown)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '8px',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f0f0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <div style={{ 
              backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50%',
              width: isMobile ? '32px' : '38px',
              height: isMobile ? '32px' : '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FiUser size={isMobile ? 14 : 18} color="white" />
            </div>
            {!isMobile && (
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Admin User</div>
                <small style={{ color: '#6c757d', fontSize: '0.75rem' }}>Administrator</small>
              </div>
            )}
          </div>
          
          {showDropdown && (
            <>
              <div 
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 998,
                }}
                onClick={() => setShowDropdown(false)}
              />
              <div style={{
                position: 'absolute',
                right: 0,
                top: '45px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                minWidth: isMobile ? '180px' : '220px',
                zIndex: 999,
                overflow: 'hidden',
              }}>
                <div style={{ padding: '0.75rem', borderBottom: '1px solid #e9ecef' }}>
                  <div style={{ fontWeight: 600 }}>Admin User</div>
                  <small style={{ color: '#6c757d', fontSize: '0.75rem' }}>admin@blc.edu</small>
                </div>
                <button 
                  onClick={() => {
                    setShowDropdown(false);
                    alert('Profile settings coming soon');
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    fontSize: '0.875rem',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  <FiUser style={{ marginRight: '0.5rem', fontSize: '0.875rem' }} /> Profile Settings
                </button>
                <button 
                  onClick={() => {
                    setShowDropdown(false);
                    onLogout();
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#dc3545',
                    transition: 'background 0.2s',
                    fontSize: '0.875rem',
                    borderTop: '1px solid #e9ecef',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  <FiLogOut style={{ marginRight: '0.5rem', fontSize: '0.875rem' }} /> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}