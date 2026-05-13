import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Complete Imposter Game Rules: Setup, Clues, Voting, and Win Conditions',
  description:
    'Read the complete Imposter Game rules: quick summary, setup table, civilian and imposter win conditions, voting example, common mistakes, and optional house rules.',
  alternates: {
    canonical: '/rules',
  },
  openGraph: {
    title: 'Complete Imposter Game Rules: Setup, Clues, Voting, and Win Conditions',
    description:
      'Read the complete Imposter Game rules: quick summary, setup table, civilian and imposter win conditions, voting example, common mistakes, and optional house rules.',
    url: '/rules',
    siteName: SITE_NAME,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Complete Imposter Game Rules: Setup, Clues, Voting, and Win Conditions',
    description:
      'Read the complete Imposter Game rules: quick summary, setup table, civilian and imposter win conditions, voting example, common mistakes, and optional house rules.',
  },
};

const HOME_ROUTE = '/';
const HOW_TO_PLAY_ROUTE = '/how-to-play';
const WORDS_ROUTE = '/imposter-game-words';
const TOPICS_ROUTE = '/imposter-game-topics';

const ruleSummary = [
  'Choose a topic pack, difficulty, player count, and mode.',
  'Each player privately checks their role and secret word.',
  'Most players receive the same civilian word; the imposter receives a related but different word.',
  'Players give short clues without saying their own secret word.',
  'The group discusses clues, votes for the suspected imposter, and resolves the win condition.',
] as const;

const setupRows = [
  {
    setting: 'Players',
    recommendation: '4 to 10 players',
    notes: '5 to 8 players is the easiest range for quick clues and fair voting.',
  },
  {
    setting: 'Imposters',
    recommendation: '1 imposter by default',
    notes: 'Use 2 imposters only for larger or experienced groups.',
  },
  {
    setting: 'Round length',
    recommendation: '10 to 20 minutes',
    notes: 'Use shorter clue timers for experienced players and longer discussion for new groups.',
  },
  {
    setting: 'Difficulty',
    recommendation: 'Easy, Medium, or Hard',
    notes: 'Easy uses concrete words. Hard uses abstract or close word pairs that demand better bluffing.',
  },
  {
    setting: 'Mode',
    recommendation: 'Online Room or Pass & Play Offline',
    notes: 'Online Room works across phones. Pass & Play works with one shared phone.',
  },
] as const;

const winConditions = [
  {
    side: 'Civilians',
    goal: 'Find the imposter through clues and discussion.',
    win:
      'Civilians win when they vote out the imposter and the imposter fails the final word guess.',
  },
  {
    side: 'Imposter',
    goal: 'Blend in without knowing the civilian word.',
    win:
      'The imposter wins by surviving the vote or by correctly guessing the civilian word after being caught.',
  },
] as const;

const votingExample = [
  {
    phase: 'Secret words',
    detail: 'Four players receive "Coffee"; one imposter receives "Tea".',
  },
  {
    phase: 'Clues',
    detail: 'Players say "morning", "caffeine", "mug", "hot", and "breakfast".',
  },
  {
    phase: 'Discussion',
    detail:
      'The group questions "breakfast" because it is broad enough to fit many drinks and meals.',
  },
  {
    phase: 'Vote',
    detail: 'Three players vote for the breakfast clue. That player is revealed as the imposter.',
  },
  {
    phase: 'Final guess',
    detail:
      'The imposter guesses "Coffee". If correct, the imposter steals the round. If wrong, civilians win.',
  },
] as const;

const commonMistakes = [
  {
    title: 'Giving a clue that is too obvious',
    text:
      'A clue like "espresso" for Coffee can reveal the word to the imposter immediately. Use clues that prove knowledge without handing over the answer.',
  },
  {
    title: 'Letting the imposter copy the first clue',
    text:
      'If the imposter speaks late every round, they can borrow the safest category. Rotate the first speaker each round.',
  },
  {
    title: 'Voting before everyone explains',
    text:
      'Fast votes feel efficient but remove the best deduction phase. Ask each suspicious player to defend their clue first.',
  },
  {
    title: 'Using word pairs that are too far apart',
    text:
      'If the words are unrelated, the imposter is obvious. Pick pairs that share a category but differ enough to create suspicious clues.',
  },
] as const;

const houseRules = [
  {
    title: 'Two-clue opening',
    text: 'New groups can let every player give two short clues before discussion starts.',
  },
  {
    title: 'No repeats',
    text: 'Players cannot reuse a clue already spoken in the same round.',
  },
  {
    title: 'Timed defense',
    text: 'Give each accused player 20 seconds to explain their clue before voting.',
  },
  {
    title: 'Hard mode first speaker',
    text: 'The previous round winner gives the first clue in the next round.',
  },
] as const;

const faqItems = [
  {
    question: 'What are the basic Imposter Game rules?',
    answer:
      'One player is secretly assigned as the imposter and receives a related but different word. Everyone gives clues, discusses suspicious answers, votes, and then checks whether the imposter can survive or guess the civilian word.',
  },
  {
    question: 'How do civilians win the Imposter Game?',
    answer:
      'Civilians win by voting out the imposter and stopping the imposter from correctly guessing the civilian word during the final guess.',
  },
  {
    question: 'How does the imposter win?',
    answer:
      'The imposter wins by avoiding the vote or by correctly guessing the civilian word after being voted out.',
  },
  {
    question: 'Can players say the secret word as a clue?',
    answer:
      'No. A clue can relate to the secret word, but saying the word itself or spelling it out should invalidate the clue.',
  },
  {
    question: 'What is the best player count?',
    answer:
      'The game works with 4 to 10 players, but 5 to 8 players usually creates the best mix of clue variety, discussion, and voting pressure.',
  },
  {
    question: 'Should beginners use easy or hard topics?',
    answer:
      'Beginners should start with easy concrete topics such as food, animals, school, or office items. Hard topics are better once the group understands bluffing and clue discipline.',
  },
] as const;

const glassCardClass =
  'rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_70px_rgba(2,6,23,0.28)] backdrop-blur-md md:p-7';

function SectionHeading({ id, title }: { id: string; title: string }) {
  return (
    <div className="flex items-center gap-4">
      <span aria-hidden="true" className="h-10 w-px bg-[#00D17F]/30" />
      <h2 id={id} className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
        {title}
      </h2>
    </div>
  );
}

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
      name: 'Rules',
      item: `${SITE_URL}/rules`,
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

export default function RulesPage() {
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
      <main className="relative min-h-screen overflow-hidden bg-[#0B101B] text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[#00D17F]/10 blur-[140px]" />
          <div className="absolute right-0 top-28 h-72 w-72 rounded-full bg-cyan-400/5 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 py-16 md:px-8">
          <section
            aria-labelledby="rules-page-title"
            className="relative pb-12 pt-6 text-center md:pb-16"
          >
            <h1
              id="rules-page-title"
              className="mx-auto mb-6 max-w-4xl bg-gradient-to-r from-white via-white/90 to-[#00D17F] bg-clip-text text-5xl font-extrabold leading-[1.02] tracking-tight text-transparent md:text-6xl"
            >
              Complete Imposter Game Rules: Setup, Clues, Voting, and Win Conditions
            </h1>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-white/70">
              Use this rules page as a quick reference before a round. It explains the
              setup, what each role is trying to do, how voting works, and which house
              rules keep the game fair.
            </p>
          </section>

          <section aria-labelledby="quick-answer" className={glassCardClass}>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#00D17F]">
              Quick Answer
            </p>
            <h2 id="quick-answer" className="mt-3 text-2xl font-bold text-white">
              How do you play the Imposter Game?
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-300 md:text-lg">
              To play the Imposter Game, the generator gives most players the same secret
              word and gives one imposter a related but different word. Players privately
              reveal roles, give clues without saying their word, discuss suspicious clues,
              and vote. Civilians win by catching the imposter and blocking the final guess;
              the imposter wins by surviving or guessing the civilian word.
            </p>
            <ul className="mt-6 grid gap-3 text-left text-sm leading-7 text-slate-300 md:grid-cols-2 md:text-base">
              {ruleSummary.map((rule) => (
                <li key={rule} className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                  {rule}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="setup-table" className="mt-16">
            <SectionHeading id="setup-table" title="Setup Table" />

            <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="bg-white/[0.04] text-xs uppercase text-slate-400">
                    <tr>
                      <th scope="col" className="px-5 py-3 font-semibold">
                        Setting
                      </th>
                      <th scope="col" className="px-5 py-3 font-semibold">
                        Recommended
                      </th>
                      <th scope="col" className="px-5 py-3 font-semibold">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-slate-300">
                    {setupRows.map((row) => (
                      <tr key={row.setting}>
                        <th scope="row" className="px-5 py-4 font-bold text-white">
                          {row.setting}
                        </th>
                        <td className="px-5 py-4 leading-6">{row.recommendation}</td>
                        <td className="px-5 py-4 leading-6">{row.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section aria-labelledby="win-conditions" className="mt-16">
            <SectionHeading id="win-conditions" title="Civilian vs Imposter Win Conditions" />

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {winConditions.map((condition) => (
                <article key={condition.side} className={glassCardClass}>
                  <h3 className="text-2xl font-semibold text-white">{condition.side}</h3>
                  <p className="mt-4 text-base leading-8 text-slate-300">
                    <span className="font-semibold text-white">Goal:</span> {condition.goal}
                  </p>
                  <p className="mt-3 text-base leading-8 text-slate-300">
                    <span className="font-semibold text-white">Win condition:</span>{' '}
                    {condition.win}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="example-vote" className="mt-16">
            <SectionHeading id="example-vote" title="Example Voting Round" />

            <ol className="mt-8 space-y-4">
              {votingExample.map((step, index) => (
                <li
                  key={step.phase}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00D17F] text-sm font-black text-[#04130D]">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{step.phase}</h3>
                    <p className="mt-2 text-base leading-7 text-slate-300">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="common-mistakes" className="mt-16">
            <SectionHeading id="common-mistakes" title="Common Mistakes" />

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {commonMistakes.map((mistake) => (
                <article key={mistake.title} className={glassCardClass}>
                  <h3 className="text-xl font-semibold text-white">{mistake.title}</h3>
                  <p className="mt-4 text-base leading-8 text-slate-300">{mistake.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="house-rules" className="mt-16">
            <SectionHeading id="house-rules" title="Optional House Rules" />

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {houseRules.map((rule) => (
                <article key={rule.title} className={glassCardClass}>
                  <h3 className="text-xl font-semibold text-white">{rule.title}</h3>
                  <p className="mt-4 text-base leading-8 text-slate-300">{rule.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="rules-faq" className="mt-16">
            <SectionHeading id="rules-faq" title="Rules FAQ" />

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

          <section className="relative mx-auto mt-20 max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-md md:p-10">
            <h2 className="relative text-3xl font-black tracking-tight text-white md:text-4xl">
              Ready to Start a Round?
            </h2>
            <p className="relative mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
              Open the generator, choose a topic pack, and use these rules as your quick
              reference while the group learns.
            </p>

            <div className="relative mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-center">
              <Link
                href={HOME_ROUTE}
                className="inline-flex items-center justify-center rounded-full bg-[#00D17F] px-6 py-3.5 text-sm font-bold text-[#04130D] transition-all duration-300 hover:bg-[#14E38D]"
              >
                Start a Game
              </Link>
              <Link
                href={HOW_TO_PLAY_ROUTE}
                className="inline-flex items-center justify-center rounded-full border border-white/[0.15] bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-white/30 hover:bg-white/[0.08]"
              >
                How to Play
              </Link>
              <Link
                href={WORDS_ROUTE}
                className="inline-flex items-center justify-center rounded-full border border-white/[0.15] bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-white/30 hover:bg-white/[0.08]"
              >
                Word Ideas
              </Link>
              <Link
                href={TOPICS_ROUTE}
                className="inline-flex items-center justify-center rounded-full border border-white/[0.15] bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-white/30 hover:bg-white/[0.08]"
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
