'use client';

import { useState, useEffect } from 'react';
import { FiBell, FiX } from 'react-icons/fi';

interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: Date;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [show, setShow] = useState(false);

 useEffect(() => {
  const interval = setInterval(() => {
    // Check for upcoming classes
    const now = new Date();

    const upcomingClasses = JSON.parse(localStorage.getItem('classes') || '[]');

    const upcoming = upcomingClasses.filter((c: any) => {
      const classTime = new Date(c.startTime);
      const diff = (classTime.getTime() - now.getTime()) / (1000 * 60);
      return diff > 0 && diff <= 30;
    });

    upcoming.forEach((cls: any) => {
      addNotification({
        message: `Class "${cls.moduleName}" starts in 30 minutes!`,
        type: 'warning',
      });
    });

  }, 60000);

  return () => clearInterval(interval);
}, []);

  const addNotification = (notif: { message: string; type: Notification['type'] }) => {
    const newNotification: Notification = {
      id: Date.now(),
      message: notif.message,
      type: notif.type,
      timestamp: new Date(),
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 10));
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
  };

  const getIconColor = (type: string) => {
    switch(type) {
      case 'success': return 'text-success';
      case 'error': return 'text-danger';
      case 'warning': return 'text-warning';
      default: return 'text-info';
    }
  };

  return (
    <>
      <div className="position-relative">
        <FiBell 
          size={22} 
          className="text-muted" 
          style={{ cursor: 'pointer' }}
          onClick={() => setShow(!show)}
        />
        {notifications.length > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {notifications.length}
          </span>
        )}
      </div>
      
      {show && (
        <div 
          className="position-absolute bg-white shadow-lg rounded" 
          style={{ 
            top: '50px', 
            right: '20px', 
            width: '320px', 
            maxHeight: '400px', 
            overflowY: 'auto',
            zIndex: 1000 
          }}
        >
          <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
            <h6 className="mb-0">Notifications</h6>
            <FiX style={{ cursor: 'pointer' }} onClick={() => setShow(false)} />
          </div>
          {notifications.length === 0 ? (
            <div className="p-3 text-center text-muted">
              No new notifications
            </div>
          ) : (
            notifications.map(notif => (
              <div key={notif.id} className="p-3 border-bottom hover-bg-light">
                <div className={`${getIconColor(notif.type)}`}>
                  <small>{notif.message}</small>
                  <div className="text-muted mt-1">
                    <small>{notif.timestamp.toLocaleTimeString()}</small>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}