'use client';

import { useState, useEffect } from 'react';
import { FiCalendar, FiBook, FiUsers, FiUserCheck, FiHome, FiGrid, FiX, FiMenu } from 'react-icons/fi';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, isOpen, onToggle }: SidebarProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome },
    { id: 'classes', label: 'Classes', icon: FiCalendar },
    { id: 'modules', label: 'Modules', icon: FiBook },
    { id: 'batches', label: 'Batches', icon: FiUsers },
    { id: 'courses', label: 'Courses', icon: FiGrid },
    { id: 'lecturers', label: 'Lecturers', icon: FiUserCheck },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && isMobile && (
        <div 
          className="sidebar-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998,
          }}
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '260px',
          height: '100vh',
          backgroundColor: '#212529',
          color: 'white',
          zIndex: 999,
          transform: isMobile ? (isOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
          transition: 'transform 0.3s ease-in-out',
          overflowY: 'auto',
        }}
      >
        <div className="sidebar-header" style={{
          padding: '1rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h4 style={{ margin: 0 }}>BLC Campus</h4>
            <small style={{ color: 'rgba(255,255,255,0.6)' }}>Admin Dashboard</small>
          </div>
          {isMobile && (
            <button
              onClick={onToggle}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1.2rem',
              }}
            >
              <FiX size={24} />
            </button>
          )}
        </div>
        
        <nav style={{ padding: '0.5rem' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (isMobile) onToggle();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  width: '100%',
                  padding: '0.75rem 1rem',
                  marginBottom: '0.25rem',
                  backgroundColor: isActive ? '#0d6efd' : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Icon size={20} />
                <span style={{ fontSize: '0.95rem' }}>{item.label}</span>
                {isActive && (
                  <span style={{ marginLeft: 'auto' }}>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                    }} />
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '1rem',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          textAlign: 'center',
        }}>
          <small style={{ color: 'rgba(255,255,255,0.5)' }}>© 2024 BLC Campus</small>
          <br />
          <small style={{ color: 'rgba(255,255,255,0.5)' }}>Version 1.0.0</small>
        </div>
      </div>
    </>
  );
}