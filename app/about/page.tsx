import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us — Imposter Game Generator',
  description:
    'Why we built the Imposter Game Generator — a free, browser-based social deduction game for remote friends and virtual game nights.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Us — Imposter Game Generator',
    description:
      'Why we built the Imposter Game Generator — a free, browser-based social deduction game for remote friends and virtual game nights.',
    url: '/about',
    siteName: 'Imposter Game Generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us — Imposter Game Generator',
    description:
      'Why we built the Imposter Game Generator — a free, browser-based social deduction game for remote friends and virtual game nights.',
  },
};

const HOME_ROUTE = '/';
const RULES_ROUTE = '/rules';
const HOW_TO_PLAY_ROUTE = '/how-to-play';

type StorySection = {
  id: string;
  title: string;
  paragraphs: string[];
};

const proseSectionClass = 'border-l-2 border-[#00D17F]/30 pl-6 md:pl-8';

const introParagraph =
  'Welcome to the story behind our platform. If you are reading this, you probably understand how hard it is to find a truly reliable social deduction game that works right in the browser. The journey to building this platform started with a simple realization: every remote game night needs a seamless way to play without forcing everyone to download heavy apps or create complicated accounts. We wanted to create an experience that stripped away the friction, leaving only the pure, adrenaline-pumping fun of bluffing, deducing, and catching the outsider.';

const storySections: StorySection[] = [
  {
    id: 'the-spark',
    title: 'The Spark',
    paragraphs: [
      'It all began during a virtual hangout with friends scattered across different time zones. We were sitting in a group video call, desperately looking for something to play together. We needed a fast, browser-based party game that everyone could join instantly through a simple link. However, the existing options were either bloated with intrusive ads, required tedious sign-ups, or completely lacked a high-quality vocabulary database. That exact night, the idea for the Imposter Game Generator was born. We decided to build a dedicated tool designed specifically for seamless real-time syncing — no downloads, no accounts, just pure fun.',
    ],
  },
  {
    id: 'the-philosophy',
    title: 'Our Philosophy',
    paragraphs: [
      'What separates a mediocre party game from an unforgettable one? It all comes down to the word pairs and the lack of latency. The heart of any social deduction round is the subtle psychological difference between the majority word and the outsider word. If the words are too similar, the game ends in endless arguments and frustration. If they are too obviously different, all suspense vanishes in five seconds. We have spent countless hours curating, testing, and manually refining our database to ensure every single round feels perfectly balanced and fair, no matter where your friends are located.',
    ],
  },
  {
    id: 'built-for-remote-players',
    title: 'Built for Remote Players',
    paragraphs: [
      'We know that hosting a group game needs to be incredibly flexible and universally accessible. You might be playing over a lively Discord call, a professional Zoom meeting, or a casual weekend Google Meet. That is precisely why we built the Imposter Game Generator with a sleek, modern dark-mode interface that looks great on any desktop, tablet, or mobile device. The real-time synchronization under the hood ensures that everyone in the room receives their secret identity instantly. Your group can generate a room code, share the link, and jump into a fresh round in less than ten seconds.',
    ],
  },
  {
    id: 'our-mission',
    title: 'Our Mission: Bringing Distant Friends Together',
    paragraphs: [
      'In a world where we often feel disconnected despite being digital, a genuinely great social deduction game forces us to look at our screens and truly engage with each other. It challenges us to read subtle digital body language, analyze speech patterns over a microphone, and listen closely to our friends. Ultimately, our core mission is simple: we want to provide the best browser-based party game available anywhere on the internet — the kind of experience that makes your distant friends stay in the voice channel an hour later than they originally planned.',
      'Thank you for choosing our platform for your virtual game nights. Every time you share a room code and start a new session, you are helping to validate the late nights and hard work we have poured into this indie project. Gather your friends, drop the link in your chat, and get ready to enjoy the absolute chaos.',
    ],
  },
] as const;

function StoryCard({ id, title, paragraphs }: StorySection) {
  return (
    <section aria-labelledby={id} className={proseSectionClass}>
      <h2 id={id} className="text-3xl font-semibold tracking-tight text-[#00D17F] md:text-4xl">
        {title}
      </h2>

      <div className="mt-6 space-y-5">
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-base leading-8 text-slate-300 md:text-lg">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Imposter Game Generator',
  url: 'https://www.impostergame-generator.com',
  description:
    'A free, browser-based social deduction party game. No app install required — play online or offline on any device.',
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://www.impostergame-generator.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'About',
      item: 'https://www.impostergame-generator.com/about',
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    <main className="relative min-h-screen overflow-hidden bg-[#0B101B] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[#00D17F]/10 blur-[140px]" />
        <div className="absolute left-[-6rem] top-72 h-72 w-72 rounded-full bg-cyan-400/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#00D17F]/[0.08] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-16 md:px-8 lg:px-10">
        <section aria-labelledby="about-page-title" className="relative pb-10 pt-6 text-center md:pb-16 md:pt-10">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 -z-10 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-[#00D17F]/10 blur-[150px]"
          />
          <h1
            id="about-page-title"
            className="mx-auto mb-6 max-w-5xl text-5xl font-extrabold leading-[1.02] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-[#00D17F] md:text-6xl"
          >
            About Us — The Story Behind Imposter Game Generator
          </h1>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-white/70">
            {introParagraph}
          </p>
        </section>

        <div className="mt-8 space-y-16 md:space-y-20">
          {storySections.map((section) => (
            <StoryCard
              key={section.title}
              id={section.id}
              title={section.title}
              paragraphs={section.paragraphs}
            />
          ))}
        </div>

        <section className="relative mx-auto mt-20 max-w-4xl overflow-hidden rounded-[2rem] border border-white/[0.06] bg-white/[0.03] p-8 text-center shadow-[0_30px_100px_rgba(0,0,0,0.38)] backdrop-blur-xl md:p-10">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 h-40 w-72 -translate-x-1/2 rounded-full bg-[#00D17F]/10 blur-[100px]"
          />
          <h2 className="relative text-3xl font-black tracking-tight text-white md:text-4xl">
            Keep the Room Moving
          </h2>

          <div className="relative mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href={HOME_ROUTE}
              className="inline-flex items-center justify-center rounded-full bg-[#00D17F] px-6 py-3.5 text-sm font-bold text-[#04130D] transition-all duration-300 hover:scale-105 hover:bg-[#14E38D]"
            >
              Start a Game
            </Link>
            <Link
              href={HOW_TO_PLAY_ROUTE}
              className="inline-flex items-center justify-center rounded-full border border-white/[0.15] bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:border-white/30 hover:bg-white/[0.08]"
            >
              How to Play
            </Link>
            <Link
              href={RULES_ROUTE}
              className="inline-flex items-center justify-center rounded-full border border-white/[0.15] bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:border-white/30 hover:bg-white/[0.08]"
            >
              Read the Rules
            </Link>
          </div>
        </section>
      </div>
    </main>
    </>
  );
}
