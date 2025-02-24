'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function ConnectInstruction() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return null;
  }

  return (
    <p className="text-gray-600 dark:text-gray-400">
      Connect your Spotify account to find artists you should discover at festivals!
    </p>
  );
}