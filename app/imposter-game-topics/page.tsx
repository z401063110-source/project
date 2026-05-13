import type { Metadata } from 'next';
import Link from 'next/link';
import { SeoSectionHeading as SectionHeading } from '@/components/seo-section-heading';
import { topicPacks } from '@/lib/imposter-seo-data';
import { SITE_NAME, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Imposter Game Topics: Theme Packs for Parties and Groups',
  description:
    'Compare imposter game topics and theme packs by difficulty, best group type, sample word pairs, and tips for choosing the right topic.',
  alternates: {
    canonical: '/imposter-game-topics',
  },
  openGraph: {
    title: 'Imposter Game Topics: Theme Packs for Parties and Groups',
    description:
      'Compare imposter game topics and theme packs by difficulty, best group type, sample word pairs, and tips for choosing the right topic.',
    url: '/imposter-game-topics',
    siteName: SITE_NAME,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Imposter Game Topics: Theme Packs for Parties and Groups',
    description:
      'Compare imposter game topics and theme packs by difficulty, best group type, sample word pairs, and tips for choosing the right topic.',
  },
};

const HOME_ROUTE = '/';
const HOW_TO_PLAY_ROUTE = '/how-to-play';
const RULES_ROUTE = '/rules';
const WORDS_ROUTE = '/imposter-game-words';

const choosingRules = [
  {
    title: 'Start concrete for new players',
    text: 'Food, animals, school, and office objects help beginners understand clue discipline quickly.',
  },
  {
    title: 'Use shared context',
    text: 'Pick topics your group already understands. Coworkers usually enjoy office packs; film fans enjoy movies.',
  },
  {
    title: 'Raise difficulty gradually',
    text: 'Move from visible objects to abstract words only after the group has played a few rounds.',
  },
  {
    title: 'Avoid private inside jokes',
    text: 'Inside jokes can be funny, but they often make clues unfair for guests who do not know the reference.',
  },
] as const;

const faqItems = [
  {
    question: 'What are the best imposter game topics?',
    answer:
      'The best imposter game topics are familiar categories with many related word pairs, such as Food & Drink, Animals, School Life, Office & Career, Movies, and Travel.',
  },
  {
    question: 'Which topic should beginners choose?',
    answer:
      'Beginners should choose Food & Drink or Animals because the words are concrete, familiar, and easy to clue without long explanations.',
  },
  {
    question: 'Which topics are best for adults?',
    answer:
      'Adults often enjoy Office & Career, Movies, Travel, and harder abstract pairs because they create better bluffing and discussion.',
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
      name: 'Imposter Game Topics',
      item: `${SITE_URL}/imposter-game-topics`,
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
  name: 'Imposter Game Topic Packs',
  itemListElement: topicPacks.map((pack, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: pack.topic,
    description: `${pack.difficulty} topic best for ${pack.bestGroup}. ${pack.whyItWorks}`,
  })),
};

export default function ImposterGameTopicsPage() {
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
          <div className="absolute left-[-4rem] top-64 h-80 w-80 rounded-full bg-cyan-400/5 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-16 md:px-8 lg:px-10">
          <section aria-labelledby="topics-page-title" className="pb-12 pt-6 text-center md:pb-16">
            <h1
              id="topics-page-title"
              className="mx-auto mb-6 max-w-5xl bg-gradient-to-r from-white via-white/90 to-[#00D17F] bg-clip-text text-5xl font-extrabold leading-[1.02] tracking-tight text-transparent md:text-6xl"
            >
              Imposter Game Topics: Theme Packs for Parties and Groups
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-white/70">
              Pick a topic that matches your group. Concrete themes are better for first
              rounds; abstract or close-match themes are better for confident bluffers.
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
              What topics work best for the Imposter Game?
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-200 md:text-lg">
              The best imposter game topics are broad categories with many related word
              pairs: Food &amp; Drink, Animals, School Life, Office &amp; Career, Movies,
              and Travel. Choose easy topics for new players and harder abstract topics
              when the group wants more deduction.
            </p>
          </section>

          <section aria-labelledby="topic-table" className="mt-16">
            <SectionHeading id="topic-table" title="Topic and Theme Pack Ideas" />

            <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] text-left text-sm">
                  <thead className="bg-white/[0.04] text-xs uppercase text-slate-400">
                    <tr>
                      <th scope="col" className="px-5 py-3 font-semibold">
                        Topic
                      </th>
                      <th scope="col" className="px-5 py-3 font-semibold">
                        Difficulty
                      </th>
                      <th scope="col" className="px-5 py-3 font-semibold">
                        Best group type
                      </th>
                      <th scope="col" className="px-5 py-3 font-semibold">
                        Sample pairs
                      </th>
                      <th scope="col" className="px-5 py-3 font-semibold">
                        Why it works
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-slate-300">
                    {topicPacks.map((pack) => (
                      <tr key={pack.topic}>
                        <th scope="row" className="px-5 py-4 font-bold text-white">
                          {pack.topic}
                        </th>
                        <td className="px-5 py-4">{pack.difficulty}</td>
                        <td className="px-5 py-4 leading-6">{pack.bestGroup}</td>
                        <td className="px-5 py-4 leading-6">{pack.samplePairs}</td>
                        <td className="px-5 py-4 leading-6">{pack.whyItWorks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section aria-labelledby="choose-topics" className="mt-16">
            <SectionHeading id="choose-topics" title="How to Choose Topics" />

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {choosingRules.map((rule) => (
                <article
                  key={rule.title}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
                >
                  <h3 className="text-xl font-semibold text-white">{rule.title}</h3>
                  <p className="mt-4 text-base leading-8 text-slate-300">{rule.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="topics-faq" className="mt-16">
            <SectionHeading id="topics-faq" title="Topic Packs FAQ" />

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
              Start With a Topic Pack
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
              Open the generator to play with built-in topics, or browse word pairs when
              you want extra ideas for custom rounds.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-center">
              <Link
                href={HOME_ROUTE}
                className="inline-flex items-center justify-center rounded-full bg-[#00D17F] px-6 py-3.5 text-sm font-bold text-[#04130D] transition-colors hover:bg-[#14E38D]"
              >
                Start a Game
              </Link>
              <Link
                href={WORDS_ROUTE}
                className="inline-flex items-center justify-center rounded-full border border-white/[0.15] bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/30 hover:bg-white/[0.08]"
              >
                Word Ideas
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
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
