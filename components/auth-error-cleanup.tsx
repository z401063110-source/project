'use client';

import { useEffect } from 'react';
import { clearAuthReturnState } from '@/lib/auth-return-state';

export function AuthErrorCleanup() {
  useEffect(() => {
    clearAuthReturnState();
  }, []);

  return null;
}
