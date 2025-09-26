import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../utils/AuthContext';

export default function HomeScreen() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading]);

  if (loading || !user) {
    return null;
  }
}