'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);
  
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner"></div>
    </div>
  );
}