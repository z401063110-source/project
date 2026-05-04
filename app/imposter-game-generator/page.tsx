import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  robots: 'noindex, nofollow',
};

export default function ImposterGameGeneratorPage() {
  redirect('/');
}
