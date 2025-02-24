'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function FestivalLink() {
  const { isAuthenticated } = useAuth();

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