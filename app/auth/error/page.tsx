import Link from 'next/link';
import { AuthErrorCleanup } from '@/components/auth-error-cleanup';

function getSafeNextPath(rawNextPath: string | string[] | undefined) {
  const nextPath = Array.isArray(rawNextPath) ? rawNextPath[0] : rawNextPath;

  if (!nextPath || !nextPath.startsWith('/') || nextPath.startsWith('//')) {
    return '/';
  }

  return nextPath;
}

function getMessage(rawMessage: string | string[] | undefined) {
  const message = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;

  return message ?? 'We could not complete your Google sign-in. Please try again.';
}

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const nextPath = getSafeNextPath(resolvedSearchParams.next);
  const message = getMessage(resolvedSearchParams.message);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0B101B] px-4 text-white">
      <AuthErrorCleanup />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[#00D17F]/10 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-400/5 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md rounded-[2rem] border border-white/10 bg-[#0B101B]/85 p-8 text-center shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-300">
          Sign-In Error
        </p>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-white">
          Google login needs another try
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-300">{message}</p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href={nextPath}
            className="rounded-full bg-white px-5 py-3 text-sm font-bold text-black transition-colors hover:bg-slate-200"
          >
            Back to the game
          </Link>
          <Link
            href="/"
            className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
