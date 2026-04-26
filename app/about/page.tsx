import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us: The Story Behind the Ultimate Imposter Game Online',
  description:
    'Discover why we built the ultimate imposter game online. A seamless, web-based social deduction experience designed for remote friends, Discord calls, and virtual game nights.',
  alternates: {
    canonical: '/about',
  },
};

const HOME_ROUTE = '/';
const RULES_ROUTE = '/rules';

type StorySection = {
  id: string;
  title: string;
  paragraphs: string[];
};

const proseSectionClass = 'border-l-2 border-[#00D17F]/30 pl-6 md:pl-8';

const introParagraph =
  'Welcome to the story behind our platform. If you are reading this, you probably understand how hard it is to find a truly reliable imposter game online. The journey to building this platform started with a simple realization: every remote game night needs a seamless way to play an imposter game online without forcing everyone to download heavy apps or create complicated accounts. We wanted to create an experience that stripped away the friction, leaving only the pure, adrenaline-pumping fun of playing an imposter game online.';

const storySections: StorySection[] = [
  {
    id: 'the-spark',
    title: 'The Spark: Redefining the Imposter Game Online',
    paragraphs: [
      'It all began during a virtual hangout with friends scattered across different time zones. We were sitting in a group video call, desperately looking for something to play together. We needed a fast, web-based imposter game online that everyone could join instantly through a simple browser link. However, the existing options for an imposter game online were either bloated with intrusive ads, required tedious sign-ups, or completely lacked a high-quality vocabulary database. That exact night, the idea for our custom imposter game online was born. We decided to build a dedicated tool that would serve as the ultimate destination to host an imposter game online, designed specifically for seamless real-time syncing.',
    ],
  },
  {
    id: 'the-philosophy',
    title: 'The Philosophy Behind a Great Imposter Game Online',
    paragraphs: [
      'So, what separates a mediocre website from a truly unforgettable imposter game online? It all comes down to the word pairs and the lack of latency. The heart of any imposter game online is the subtle psychological difference between the majority word and the outsider word. If the words are too similar, your imposter game online ends in endless arguments and frustration. If they are too obviously different, the imposter game online loses all its suspense and ends in five seconds. We have spent countless hours curating, testing, and manually refining our database to ensure every single round of our imposter game online feels perfectly balanced and fair, no matter where your friends are currently located.',
    ],
  },
  {
    id: 'built-for-remote-players',
    title: 'Built Specifically for Remote Players',
    paragraphs: [
      'We know that hosting an imposter game online needs to be incredibly flexible and universally accessible. You might be playing our imposter game online over a lively Discord call, a professional Zoom meeting, or a casual weekend Google Meet. That is precisely why we built our imposter game online with a sleek, modern dark-mode interface that looks incredible on any desktop, tablet, or mobile device. The sophisticated real-time synchronization under the hood ensures that when you host an imposter game online using our generator, everyone in the room receives their secret identity instantly. Your group can generate a room code, share the link, and jump into a fresh imposter game online in less than ten seconds.',
    ],
  },
  {
    id: 'our-mission',
    title: 'Our Mission: Bringing Distant Friends Together',
    paragraphs: [
      'In a world where we often feel disconnected despite being digital, a genuinely great imposter game online forces us to look at our screens and truly engage with each other. It challenges us to read subtle digital body language, analyze speech patterns over a microphone, and listen closely to our friends. Ultimately, our core mission is extremely simple: we want to provide the absolute best imposter game online available anywhere on the internet today. We want our imposter game online to be the exact reason your distant friends decide to stay in the voice channel an hour later than they originally planned.',
      'Thank you for choosing our platform for your virtual game nights. Every time you share a room code and start a new session of this imposter game online, you are helping to validate the late nights and hard work we have poured into this indie project. Gather your friends, drop the link in your chat, and get ready to enjoy the absolute chaos of the ultimate imposter game online.',
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

export default function AboutPage() {
  return (
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
            About Us: The Story Behind the Ultimate Imposter Game Online
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
              href={RULES_ROUTE}
              className="inline-flex items-center justify-center rounded-full border border-white/[0.15] bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:border-white/30 hover:bg-white/[0.08]"
            >
              Read the Rules
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
