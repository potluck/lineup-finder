'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function FestivalLink() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('spotify_access_token');
    const userId = localStorage.getItem('spotify_user_id');
    setIsAuthenticated(!!(token && userId));
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Link
      href="/festival-matches"
      className="rounded-full bg-purple-600 text-white px-6 py-3 font-bold hover:bg-purple-700"
    >
      Artists you should discover at festivals
    </Link>
  );
}