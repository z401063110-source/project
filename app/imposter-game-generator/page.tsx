import type { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';

export const metadata: Metadata = {
  robots: 'noindex, nofollow',
};

export default function ImposterGameGeneratorPage() {
  permanentRedirect('/');
}
