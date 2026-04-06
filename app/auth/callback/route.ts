import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.');
}

const requiredSupabaseUrl = supabaseUrl;
const requiredSupabaseAnonKey = supabaseAnonKey;

function getSafeNextPath(rawNextPath: string | null) {
  if (!rawNextPath || !rawNextPath.startsWith('/') || rawNextPath.startsWith('//')) {
    return '/';
  }

  return rawNextPath;
}

function buildAuthErrorUrl(request: NextRequest, nextPath: string, message: string) {
  const errorUrl = new URL('/auth/error', request.url);
  errorUrl.searchParams.set('next', nextPath);
  errorUrl.searchParams.set('message', message.replace(/\+/g, ' ').trim());
  return errorUrl;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const nextPath = getSafeNextPath(requestUrl.searchParams.get('next'));
  const oauthError =
    requestUrl.searchParams.get('error_description') ??
    requestUrl.searchParams.get('error');

  if (oauthError) {
    return NextResponse.redirect(buildAuthErrorUrl(request, nextPath, oauthError));
  }

  if (!code) {
    return NextResponse.redirect(
      buildAuthErrorUrl(request, nextPath, 'Google sign-in did not return an authorization code.'),
    );
  }

  const successRedirect = NextResponse.redirect(new URL(nextPath, request.url));

  const supabase = createServerClient(requiredSupabaseUrl, requiredSupabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          successRedirect.cookies.set(name, value, options);
        });
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(buildAuthErrorUrl(request, nextPath, error.message));
  }

  return successRedirect;
}
