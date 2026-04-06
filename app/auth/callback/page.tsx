'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

function getSafeNextPath(rawNextPath: string | null) {
  if (!rawNextPath || !rawNextPath.startsWith('/')) {
    return '/';
  }

  return rawNextPath;
}

function buildHomeErrorRedirect(errorMessage: string) {
  const homeUrl = new URL('/', window.location.origin);
  homeUrl.searchParams.set('error_description', errorMessage.replace(/\+/g, ' ').trim());
  return homeUrl.toString();
}

function readCallbackErrorMessage(currentUrl: URL) {
  const hashParams = new URLSearchParams(
    currentUrl.hash.startsWith('#') ? currentUrl.hash.slice(1) : currentUrl.hash,
  );

  return (
    hashParams.get('error_description') ??
    currentUrl.searchParams.get('error_description') ??
    hashParams.get('error') ??
    currentUrl.searchParams.get('error')
  );
}

export default function AuthCallbackPage() {
  const [statusMessage, setStatusMessage] = useState('Finishing Google sign-in...');

  useEffect(() => {
    let isActive = true;

    const completeAuth = async () => {
      const currentUrl = new URL(window.location.href);
      const nextPath = getSafeNextPath(currentUrl.searchParams.get('next'));
      const callbackErrorMessage = readCallbackErrorMessage(currentUrl);

      if (callbackErrorMessage) {
        window.location.replace(buildHomeErrorRedirect(callbackErrorMessage));
        return;
      }

      const code = currentUrl.searchParams.get('code');

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          window.location.replace(buildHomeErrorRedirect(error.message));
          return;
        }
      }

      if (!isActive) {
        return;
      }

      setStatusMessage('Redirecting you back to the game...');
      window.location.replace(new URL(nextPath, window.location.origin).toString());
    };

    void completeAuth();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0B101B] px-4 text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[#00D17F]/10 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-400/5 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md rounded-[2rem] border border-white/10 bg-[#0B101B]/85 p-8 text-center shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
          Google Sign-In
        </p>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-white">
          Wrapping up your login
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-300">{statusMessage}</p>
      </div>
    </main>
  );
}
