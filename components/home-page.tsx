'use client';

import type { User as SupabaseUser } from '@supabase/supabase-js';
import { LockKeyhole, User as UserIcon, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  ImposterGamePanel,
  type ImposterPanelScreen,
} from '@/components/imposter-game-panel';
import { SeoContent } from '@/components/seo-content';
import { clearAuthReturnState, getCurrentPath } from '@/lib/auth-return-state';
import { supabase } from '@/lib/supabase';

function getGoogleRedirectUrl(currentPath: string) {
  if (typeof window === 'undefined') {
    return '';
  }

  return `${window.location.origin}/auth/callback?next=${encodeURIComponent(currentPath)}`;
}

function readAuthErrorMessageFromUrl() {
  if (typeof window === 'undefined') {
    return null;
  }

  const currentUrl = new URL(window.location.href);
  const hashParams = new URLSearchParams(
    currentUrl.hash.startsWith('#') ? currentUrl.hash.slice(1) : currentUrl.hash,
  );
  const rawErrorMessage =
    hashParams.get('error_description') ??
    currentUrl.searchParams.get('error_description') ??
    hashParams.get('error') ??
    currentUrl.searchParams.get('error');

  if (!rawErrorMessage) {
    return null;
  }

  currentUrl.hash = '';
  currentUrl.searchParams.delete('error');
  currentUrl.searchParams.delete('error_code');
  currentUrl.searchParams.delete('error_description');
  window.history.replaceState({}, document.title, `${currentUrl.pathname}${currentUrl.search}`);

  return rawErrorMessage.replace(/\+/g, ' ').trim();
}

export function HomePageClient() {
  const [currentScreen, setCurrentScreen] = useState<ImposterPanelScreen>('entry');
  const [hasMounted, setHasMounted] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [authErrorMessage, setAuthErrorMessage] = useState<string | null>(null);
  const isHeroView = currentScreen === 'entry';

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const syncSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!isMounted) {
          return;
        }

        setUser(session?.user ?? null);
        setIsLoggingIn(false);
        setIsLoginModalOpen(false);

        if (session) {
          setAuthErrorMessage(null);
        }
      } finally {
        if (isMounted) {
          setIsAuthReady(true);
        }
      }
    };

    void syncSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setIsLoggingIn(false);
      setIsLoginModalOpen(false);
      setIsAccountMenuOpen(false);
      setIsAuthReady(true);

      if (session || event === 'SIGNED_OUT') {
        setAuthErrorMessage(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const nextAuthErrorMessage = readAuthErrorMessageFromUrl();

    if (!nextAuthErrorMessage) {
      return;
    }

    setAuthErrorMessage(nextAuthErrorMessage);
    setIsLoginModalOpen(true);
    setIsLoggingIn(false);
  }, []);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setIsLoggingIn(false);
    setAuthErrorMessage(null);
    clearAuthReturnState();
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoggingIn(true);
      setAuthErrorMessage(null);
      const currentPath = getCurrentPath();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getGoogleRedirectUrl(currentPath),
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Google sign-in failed:', error);
      setIsLoggingIn(false);
      setAuthErrorMessage(
        error instanceof Error ? error.message : 'Google sign-in could not be started.',
      );
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      setUser(null);
      setIsAccountMenuOpen(false);
    } catch (error) {
      console.error('Sign-out failed:', error);
    }
  };

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const shouldRenderResolvedAccountControl = hasMounted && isAuthReady;

  const renderAccountControl = () => {
    if (!shouldRenderResolvedAccountControl) {
      return (
        <div
          aria-hidden="true"
          className="flex h-11 min-w-[7.5rem] items-center justify-center rounded-full border border-white/10 bg-[#0B101B]/50 px-4 py-2 text-sm text-slate-500 backdrop-blur-md"
        >
          <span className="inline-flex h-5 w-5 rounded-full border border-white/10 bg-white/5" />
          <span className="ml-2">Account</span>
        </div>
      );
    }

    if (user) {
      return (
        <div className="relative">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={isAccountMenuOpen}
            aria-label="Open account menu"
            className="block"
            onClick={() => setIsAccountMenuOpen((isOpen) => !isOpen)}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                aria-hidden="true"
                className="h-9 w-9 cursor-pointer rounded-full border border-white/20 shadow-sm transition-colors hover:border-[#00D17F]"
              />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-[#0B101B]/90 text-slate-200 shadow-sm transition-colors hover:border-[#00D17F]">
                <UserIcon size={16} strokeWidth={2.2} />
              </span>
            )}
          </button>

          {isAccountMenuOpen && (
            <div className="absolute right-0 mt-2 w-32 rounded-xl border border-white/10 bg-[#0B101B]/90 py-1 shadow-xl backdrop-blur-md">
              <button
                type="button"
                className="w-full px-4 py-2 text-left text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isLoginModalOpen}
        className="flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-[#0B101B]/50 px-4 py-2 text-sm text-slate-300 backdrop-blur-md transition-all hover:bg-[#0B101B]/80 hover:text-white"
        onClick={openLoginModal}
      >
        <UserIcon size={16} strokeWidth={2} />
        <span>Sign In</span>
      </button>
    );
  };

  return (
    <main className="relative min-h-[100svh] bg-slate-950">
      <div className="px-4 pt-4 sm:px-6 lg:hidden">
        <div className="flex justify-end">{renderAccountControl()}</div>
      </div>

      <div className="fixed right-6 top-6 z-40 hidden lg:block md:right-8 md:top-8">
        {renderAccountControl()}
      </div>

      <section className={isHeroView ? 'w-full' : ''}>
        <div
          className={
            isHeroView
              ? 'flex min-h-[calc(100svh-5rem)] flex-col items-center justify-center px-4 pb-8 pt-4 text-center sm:px-6 lg:min-h-screen lg:px-4 lg:py-8'
              : ''
          }
        >
          <div className={isHeroView ? 'flex w-full flex-col items-center' : ''}>
            {isHeroView && (
              <>
                <h1 className="text-5xl font-bold leading-tight text-white sm:text-6xl">
                  <span>
                    Free <span className="text-[#00D17F]">Imposter Game Generator</span>
                  </span>{' '}
                  <span className="block">for Mobile Parties</span>
                </h1>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
                  Create a room, reveal secret roles, and start fast social deduction rounds
                  on any phone. Play online with friends or offline with one shared device.
                </p>
              </>
            )}

            <div className={isHeroView ? 'mt-9 w-full max-w-[480px]' : ''}>
              <ImposterGamePanel
                entryLayout="embedded"
                isLoginModalOpen={isLoginModalOpen}
                onScreenChange={setCurrentScreen}
                onRequestSignIn={openLoginModal}
                user={user}
              />
              <p className="mt-4 text-sm font-semibold text-slate-300">
                No app install · No signup required · Works on any phone
              </p>
            </div>
          </div>

          {isHeroView && (
            <Image
              src="/images/hero-imposter-party.webp"
              alt="Friends playing an imposter party game on their phones"
              className="hero-illustration mx-auto mt-9"
              width={836}
              height={471}
              priority
            />
          )}
        </div>
      </section>

      {isHeroView && (
        <div className="mt-12">
          <SeoContent />
        </div>
      )}

      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-modal-title"
            className="relative flex w-full max-w-sm flex-col items-center rounded-[2.5rem] border border-white/10 bg-[#0B101B]/95 p-8 shadow-2xl"
          >
            <button
              type="button"
              aria-label="Close sign in modal"
              className="absolute right-5 top-5 text-slate-400 transition-colors hover:text-white"
              onClick={closeLoginModal}
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#00D17F]/20 bg-[#00D17F]/10 text-[#00D17F]">
              <LockKeyhole size={24} strokeWidth={2.2} />
            </div>

            <h2 id="login-modal-title" className="mt-4 text-2xl font-bold text-white">
              Unlock Extra Packs
            </h2>

            <p className="mb-8 mt-2 text-center text-sm leading-6 text-slate-400">
              Sign in with your Google account to access premium topic packs and host
              larger parties. It&apos;s completely free.
            </p>

            {authErrorMessage && (
              <div className="mb-6 w-full rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm leading-6 text-rose-200">
                {authErrorMessage}
              </div>
            )}

            <button
              type="button"
              className={[
                'flex w-full items-center justify-center gap-3 rounded-full bg-white py-3.5 font-bold text-black transition-colors',
                isLoggingIn ? 'cursor-not-allowed opacity-70' : 'hover:bg-slate-200',
              ].join(' ')}
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
            >
              <svg
                aria-hidden="true"
                width="18"
                height="18"
                viewBox="0 0 48 48"
                className="shrink-0"
              >
                <path
                  fill="#FFC107"
                  d="M43.611 20.083H42V20H24v8h11.303C33.655 32.657 29.215 36 24 36c-6.627 0-12-5.373-12-12S17.373 12 24 12c3.059 0 5.842 1.154 7.958 3.042l5.657-5.657C34.047 6.053 29.277 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917Z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306 14.691 12.88 19.51C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.958 3.042l5.657-5.657C34.047 6.053 29.277 4 24 4c-7.682 0-14.347 4.337-17.694 10.691Z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.177 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.147 35.091 26.671 36 24 36c-5.194 0-9.625-3.326-11.285-7.946l-6.522 5.025C9.5 39.556 16.227 44 24 44Z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.084 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917Z"
                />
              </svg>
              <span>{isLoggingIn ? 'Redirecting...' : 'Continue with Google'}</span>
            </button>

            <button
              type="button"
              className="mt-4 cursor-pointer text-sm text-slate-500 transition-colors hover:text-slate-300"
              onClick={closeLoginModal}
            >
              Maybe later
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
