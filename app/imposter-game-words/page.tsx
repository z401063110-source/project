import type { Metadata } from 'next';
import Link from 'next/link';
import { SeoSectionHeading as SectionHeading } from '@/components/seo-section-heading';
import { wordPairs } from '@/lib/imposter-seo-data';
import { SITE_NAME, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Imposter Game Words: Word Pair Ideas by Difficulty',
  description:
    'Browse imposter game word pairs by difficulty, best group type, and clue strategy. Use these word ideas in online rooms or pass-and-play party rounds.',
  alternates: {
    canonical: '/imposter-game-words',
  },
  openGraph: {
    title: 'Imposter Game Words: Word Pair Ideas by Difficulty',
    description:
      'Browse imposter game word pairs by difficulty, best group type, and clue strategy. Use these word ideas in online rooms or pass-and-play party rounds.',
    url: '/imposter-game-words',
    siteName: SITE_NAME,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Imposter Game Words: Word Pair Ideas by Difficulty',
    description:
      'Browse imposter game word pairs by difficulty, best group type, and clue strategy. Use these word ideas in online rooms or pass-and-play party rounds.',
  },
};

const HOME_ROUTE = '/';
const HOW_TO_PLAY_ROUTE = '/how-to-play';
const RULES_ROUTE = '/rules';
const TOPICS_ROUTE = '/imposter-game-topics';

const usageSteps = [
  'Pick word pairs that share a category so the imposter has a fair chance to bluff.',
  'Use easy concrete pairs for new players and hard abstract pairs for experienced groups.',
  'Tell players they cannot say, spell, translate, or directly describe their own secret word.',
  'Rotate the first clue giver each round so one player does not always set the safest direction.',
] as const;

const faqItems = [
  {
    question: 'What are good imposter game words?',
    answer:
      'Good imposter game words are close enough to share clues but different enough to create suspicion, such as Pizza/Pasta, Coffee/Tea, Laptop/Tablet, or Sequel/Prequel.',
  },
  {
    question: 'Should the imposter word be very different?',
    answer:
      'No. If the imposter word is too different, the outsider is exposed too quickly. The best pairs share a category but differ in details.',
  },
  {
    question: 'How do you make harder word pairs?',
    answer:
      'Use abstract concepts, near-synonyms, or words with overlapping contexts. Hard pairs force players to use precise clues and better bluffing.',
  },
] as const;

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: SITE_URL,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Imposter Game Words',
      item: `${SITE_URL}/imposter-game-words`,
    },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Imposter Game Word Pair Ideas',
  itemListElement: wordPairs.map((pair, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: `${pair.civilian} / ${pair.imposter}`,
    description: `${pair.difficulty} pair best for ${pair.bestFor}. ${pair.tip}`,
  })),
};

export default function ImposterGameWordsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <main className="relative min-h-screen overflow-hidden bg-[#0B101B] text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-[#00D17F]/10 blur-[140px]" />
          <div className="absolute right-[-4rem] top-60 h-80 w-80 rounded-full bg-cyan-400/5 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-16 md:px-8 lg:px-10">
          <section aria-labelledby="words-page-title" className="pb-12 pt-6 text-center md:pb-16">
            <h1
              id="words-page-title"
              className="mx-auto mb-6 max-w-5xl bg-gradient-to-r from-white via-white/90 to-[#00D17F] bg-clip-text text-5xl font-extrabold leading-[1.02] tracking-tight text-transparent md:text-6xl"
            >
              Imposter Game Words: Word Pair Ideas by Difficulty
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-white/70">
              Use these imposter game word pairs when you want balanced rounds with clear
              clue paths, believable bluffs, and enough overlap to keep voting interesting.
            </p>
          </section>

          <section
            aria-labelledby="quick-answer"
            className="rounded-3xl border border-[#00D17F]/20 bg-[#00D17F]/[0.06] p-6 md:p-8"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#00D17F]">
              Quick Answer
            </p>
            <h2 id="quick-answer" className="mt-3 text-2xl font-bold text-white">
              What are the best imposter game words?
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-200 md:text-lg">
              The best imposter game words are related pairs from the same category, such
              as Pizza/Pasta, Coffee/Tea, Lion/Tiger, Laptop/Tablet, or Sequel/Prequel.
              They should be similar enough for the imposter to bluff but different enough
              that careful clues reveal who has the wrong word.
            </p>
          </section>

          <section aria-labelledby="word-pair-table" className="mt-16">
            <SectionHeading id="word-pair-table" title="Word Pair Ideas" />

            <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] text-left text-sm">
                  <thead className="bg-white/[0.04] text-xs uppercase text-slate-400">
                    <tr>
                      <th scope="col" className="px-5 py-3 font-semibold">
                        Civilian Word
                      </th>
                      <th scope="col" className="px-5 py-3 font-semibold">
                        Imposter Word
                      </th>
                      <th scope="col" className="px-5 py-3 font-semibold">
                        Difficulty
                      </th>
                      <th scope="col" className="px-5 py-3 font-semibold">
                        Best for
                      </th>
                      <th scope="col" className="px-5 py-3 font-semibold">
                        How to use
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-slate-300">
                    {wordPairs.map((pair) => (
                      <tr key={`${pair.civilian}-${pair.imposter}`}>
                        <th scope="row" className="px-5 py-4 font-bold text-white">
                          {pair.civilian}
                        </th>
                        <td className="px-5 py-4 font-semibold text-white">{pair.imposter}</td>
                        <td className="px-5 py-4">{pair.difficulty}</td>
                        <td className="px-5 py-4 leading-6">{pair.bestFor}</td>
                        <td className="px-5 py-4 leading-6">{pair.tip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section aria-labelledby="how-to-use" className="mt-16">
            <SectionHeading id="how-to-use" title="How to Use Word Pairs" />

            <ol className="mt-8 grid gap-4 md:grid-cols-2">
              {usageSteps.map((step, index) => (
                <li
                  key={step}
                  className="flex gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00D17F] text-sm font-black text-[#04130D]">
                    {index + 1}
                  </span>
                  <p className="text-base leading-7 text-slate-300">{step}</p>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="words-faq" className="mt-16">
            <SectionHeading id="words-faq" title="Word Ideas FAQ" />

            <div className="mt-8 space-y-3">
              {faqItems.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 open:border-[#00D17F]/35"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-white marker:hidden">
                    <span>{item.question}</span>
                    <span
                      aria-hidden="true"
                      className="relative h-5 w-5 shrink-0 rounded-full border border-white/20 text-[#00D17F]"
                    >
                      <span className="absolute left-1/2 top-1/2 h-px w-2.5 -translate-x-1/2 -translate-y-1/2 bg-current" />
                      <span className="absolute left-1/2 top-1/2 h-2.5 w-px -translate-x-1/2 -translate-y-1/2 bg-current group-open:hidden" />
                    </span>
                  </summary>
                  <p className="mt-3 text-base leading-8 text-slate-300">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="mx-auto mt-20 max-w-4xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center md:p-10">
            <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">
              Use These Words in a Live Round
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
              Start the generator for automatic role assignment, or read the topic guide
              when you want complete theme packs.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-center">
              <Link
                href={HOME_ROUTE}
                className="inline-flex items-center justify-center rounded-full bg-[#00D17F] px-6 py-3.5 text-sm font-bold text-[#04130D] transition-colors hover:bg-[#14E38D]"
              >
                Start a Game
              </Link>
              <Link
                href={HOW_TO_PLAY_ROUTE}
                className="inline-flex items-center justify-center rounded-full border border-white/[0.15] bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/30 hover:bg-white/[0.08]"
              >
                How to Play
              </Link>
              <Link
                href={RULES_ROUTE}
                className="inline-flex items-center justify-center rounded-full border border-white/[0.15] bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/30 hover:bg-white/[0.08]"
              >
                Rules
              </Link>
              <Link
                href={TOPICS_ROUTE}
                className="inline-flex items-center justify-center rounded-full border border-white/[0.15] bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/30 hover:bg-white/[0.08]"
              >
                Topic Packs
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
