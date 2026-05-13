import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

const appCardClassName =
  'w-full max-w-5xl rounded-[40px] border border-white/10 bg-[#0B101B]/80 p-6 shadow-[0_30px_80px_rgba(2,6,23,0.35)] backdrop-blur-md md:p-10 lg:p-12';
const compactAppCardClassName =
  'w-full max-w-5xl rounded-[40px] border border-white/10 bg-[#0B101B]/80 p-5 shadow-[0_30px_80px_rgba(2,6,23,0.35)] backdrop-blur-md md:p-8 lg:p-10';

const mutedPanelClassName =
  'rounded-3xl border border-white/10 bg-[#161B26] p-5';

const valuePoints = [
  {
    title: 'No paper slips or card decks',
    description: 'Start a round without printing roles, shuffling cards, or explaining setup twice.',
  },
  {
    title: 'Works online or with one shared phone',
    description: 'Play across multiple devices or pass one phone around the table for offline rounds.',
  },
  {
    title: 'Fast setup for real-world parties',
    description: 'Create a room, reveal secret words, and keep the round moving in just a few taps.',
  },
] as const;

const modeComparison = [
  {
    mode: 'Online Room',
    bestFor: 'Friends on separate phones or remote groups on a call',
    playersNeed: 'Each player uses their own browser',
    start: 'Host creates a room and shares the code',
  },
  {
    mode: 'Join by Code',
    bestFor: 'Guests who need the fastest way into an existing game',
    playersNeed: 'A phone, tablet, or desktop browser',
    start: 'Player enters the 4-digit room code',
  },
  {
    mode: 'Pass & Play Offline',
    bestFor: 'In-person groups, travel, classrooms, and low-signal rooms',
    playersNeed: 'One shared phone for the whole table',
    start: 'Host starts offline mode and passes the device around',
  },
] as const;

const stats = [
  { label: 'Players', value: '4-10' },
  { label: 'Duration', value: '15-30 mins' },
  { label: 'Age Range', value: '10+' },
] as const;

const guideSteps = [
  {
    title: 'Create or join a room',
    description: 'Start a party or enter a 4-digit code.',
  },
  {
    title: 'Choose online or offline play',
    description: 'Sync multiple phones or pass one device around.',
  },
  {
    title: 'Reveal secret identities',
    description: 'Hold to peek at your hidden word.',
  },
  {
    title: 'Discuss, bluff, and vote',
    description: 'Use verbal clues to find the imposter or hide your identity, then vote.',
  },
] as const;

const winTips = [
  {
    title: 'Civilian clue strategy',
    description:
      'Give a clue that proves you know the word without making the word obvious to the imposter.',
  },
  {
    title: 'Imposter bluff strategy',
    description:
      'Listen for the safest category, mirror the group tone, and avoid overexplaining your clue.',
  },
  {
    title: 'Voting strategy',
    description:
      'Ask players to explain vague clues before voting. A rushed vote often helps the imposter.',
  },
] as const;

const faqItems = [
  {
    question: 'What is an Imposter Game Generator?',
    answer:
      'It is a browser-based party tool that assigns secret roles, reveals hidden words, and helps groups run fast social deduction rounds without paper slips or app installs.',
  },
  {
    question: 'How many players can use this Imposter Game Generator?',
    answer:
      'It runs from 4 to 10 players, but most groups feel best with 5 to 8 because the clues stay lively and the voting stays sharp.',
  },
  {
    question: 'Can I play this Imposter Game Generator offline?',
    answer:
      'Yes. Pass & Play mode lets your group use one device with no internet, which is handy for travel, classrooms, or casual party setups.',
  },
  {
    question: 'Do all players need their own phone?',
    answer:
      'No. If your group wants the live room experience, each player can join on their own phone. If not, one phone is enough in offline mode.',
  },
  {
    question: 'How do players reveal secret roles?',
    answer:
      'Players use the hold-to-peek screen to check their secret role and word without flashing it to the rest of the group.',
  },
  {
    question: 'What happens if the outsider is caught?',
    answer:
      'If the group catches the outsider, that player gets one final chance to guess the secret word. A correct guess can steal the round, and a wrong guess gives the win to the rest of the table.',
  },
] as const;

const footerColumns = {
  resources: [
    { href: '/how-to-play', label: 'How to Play' },
    { href: '/rules', label: 'Rules' },
    { href: '/imposter-game-words', label: 'Word Ideas' },
    { href: '/imposter-game-topics', label: 'Topic Packs' },
    { href: '/about', label: 'About' },
  ],
  topics: [
    { href: '/imposter-game-topics', label: 'Best Imposter Game Topics' },
    { href: '/imposter-game-topics', label: 'Fun Theme Packs' },
    { href: '/imposter-game-words', label: 'Word Pair Ideas' },
  ],
  perfectFor: [
    'Face-to-Face Parties',
    'Team Building',
    'Ice Breakers',
    'Family Gatherings',
  ],
} as const;

type HeadingProps = {
  badge?: string;
  title: string;
  subtitle?: string;
};

function SectionHeading({ badge, title, subtitle }: HeadingProps) {
  const normalizedBadge = badge?.trim() ?? '';
  const hasBadge = normalizedBadge.length > 0;
  const [badgeIcon, ...badgeWords] = normalizedBadge.split(' ');
  const badgeLabel = badgeWords.join(' ');

  return (
    <div className="text-center">
      {hasBadge && (
        <p className="font-sans text-2xl font-bold tracking-wide text-slate-100 transition-colors duration-200 hover:text-[#00D17F]">
          <span className="inline-flex items-center justify-center gap-3">
            {badgeLabel ? <span aria-hidden="true">{badgeIcon}</span> : null}
            <span>{badgeLabel || normalizedBadge}</span>
          </span>
        </p>
      )}
      <h2
        className={[
          'text-3xl font-black tracking-tight text-white md:text-4xl',
          hasBadge ? 'mt-4' : '',
        ].join(' ')}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-gray-400 md:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function SeoContent() {
  return (
    <section aria-labelledby="seo-content-title" className="px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
      <div className="mx-auto flex w-full flex-col items-center space-y-8">
        <section id="about-us" className={compactAppCardClassName}>
          <SectionHeading title="What Is the Imposter Game Generator?" />

          <div className="mt-6">
            <div>
              <div className="mx-auto max-w-3xl rounded-3xl border border-[#00D17F]/20 bg-[#00D17F]/[0.06] p-5 text-left">
                <h3 className="text-base font-bold text-[#00D17F]">
                  Quick Answer: What is an imposter game generator?
                </h3>
                <p className="mt-3 text-base leading-7 text-slate-200 md:text-lg">
                  An imposter game generator is a browser tool that assigns hidden roles,
                  gives most players the same secret word, gives the imposter a different
                  word, and helps the group run clue, discussion, and voting rounds without
                  cards, paper, signup, or app installs.
                </p>
              </div>

              <div className="mx-auto max-w-3xl text-center text-base leading-7 text-slate-300 md:text-lg">
                <p>
                  The Imposter Game Generator is a free browser-based party tool that handles
                  secret roles, fast setup, and smooth rounds whether your group is playing
                  online or gathered around one shared phone.
                </p>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {valuePoints.map((point) => (
                  <div
                    key={point.title}
                    className="rounded-3xl border border-white/10 bg-[#161B26] p-5 text-left"
                  >
                    <h3 className="text-lg font-bold text-white">{point.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-gray-400 md:text-base">
                      {point.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-3xl border border-white/10 bg-[#161B26] p-5 text-center"
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                      {stat.label}
                    </p>
                    <p className="mt-3 text-3xl font-black text-white">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#161B26]">
                <div className="border-b border-white/10 px-5 py-4">
                  <h3 className="text-xl font-bold text-white">
                    Online Room vs Join by Code vs Pass &amp; Play Offline
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-400">
                    Choose the mode based on where your players are and how many devices
                    your group wants to use.
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left text-sm">
                    <thead className="bg-white/[0.04] text-xs uppercase text-slate-400">
                      <tr>
                        <th scope="col" className="px-5 py-3 font-semibold">
                          Mode
                        </th>
                        <th scope="col" className="px-5 py-3 font-semibold">
                          Best for
                        </th>
                        <th scope="col" className="px-5 py-3 font-semibold">
                          Players need
                        </th>
                        <th scope="col" className="px-5 py-3 font-semibold">
                          How it starts
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-slate-300">
                      {modeComparison.map((mode) => (
                        <tr key={mode.mode}>
                          <th scope="row" className="px-5 py-4 font-bold text-white">
                            {mode.mode}
                          </th>
                          <td className="px-5 py-4 leading-6">{mode.bestFor}</td>
                          <td className="px-5 py-4 leading-6">{mode.playersNeed}</td>
                          <td className="px-5 py-4 leading-6">{mode.start}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <Image
              src="/images/game-role-cards.webp"
              alt="Secret word, civilian role, imposter role, and discussion cards"
              className="intro-illustration mx-auto mt-8"
              width={768}
              height={512}
              loading="lazy"
            />
          </div>
        </section>

        <section id="quick-start" className={appCardClassName}>
          <SectionHeading
            badge="📘 Quick Start"
            title="Get a Round Running in Seconds"
            subtitle="A quick overview to get started. For the full walkthrough, visit our how to play guide."
          />

          <ol className="mt-8 space-y-4">
            {guideSteps.map((step, index) => (
              <li
                key={step.title}
                className="flex gap-4 rounded-3xl border border-white/10 bg-[#161B26] p-5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#39FF14]/30 bg-[#39FF14]/10 text-lg font-black text-[#39FF14]">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-gray-400 md:text-base">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-6 text-center">
            <Link
              href="/how-to-play"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#00D17F] underline underline-offset-4 transition-colors hover:text-[#14E38D]"
            >
              See the full step-by-step guide
            </Link>
          </div>
        </section>

        <section id="win-conditions" className={appCardClassName}>
          <SectionHeading
            badge="🏆 Win Conditions"
            title="How to Win"
            subtitle="Find the imposter if you are a civilian, and stay hidden if you are not."
          />

          <div className="mt-8 space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                How to Win
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className={[mutedPanelClassName, 'border-[#39FF14]/15'].join(' ')}>
                  <h3 className="text-xl font-bold text-white">Civilians</h3>
                  <p className="mt-3 text-base leading-7 text-gray-400">
                    Catch the imposter before the alive imposters match or outnumber the alive civilians.
                  </p>
                </div>
                <div className={mutedPanelClassName}>
                  <h3 className="text-xl font-bold text-white">Imposters</h3>
                  <p className="mt-3 text-base leading-7 text-gray-400">
                    Stay hidden, survive the vote, and push the game until the civilians lose the numbers.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {winTips.map((tip) => (
                <div key={tip.title} className={mutedPanelClassName}>
                  <h3 className="text-lg font-bold text-white">{tip.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-400 md:text-base">
                    {tip.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/rules"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#00D17F] underline underline-offset-4 transition-colors hover:text-[#14E38D]"
            >
              Read the complete rules and strategy tips
            </Link>
          </div>

        </section>

        <section className={appCardClassName}>
          <SectionHeading
            badge="💡 FAQ"
            title="Imposter Game Generator FAQ"
            subtitle="Tap a question to open the answer."
          />

          <div className="mt-8 space-y-3">
            {faqItems.map((item) => (
              <details
                key={item.question}
                className="group rounded-3xl border border-white/10 bg-[#161B26] px-5 py-4 open:border-[#39FF14]/35"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-white marker:hidden">
                  <span>{item.question}</span>
                  <span className="shrink-0 text-white transition-transform duration-150 group-open:rotate-180">
                    <ChevronDown size={18} strokeWidth={2.5} />
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-gray-400 md:text-base">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>

      <footer className="mx-auto mt-12 max-w-5xl rounded-[40px] border border-white/10 bg-[#0B101B]/80 px-6 py-8 shadow-[0_30px_80px_rgba(2,6,23,0.35)] backdrop-blur-md md:px-10 md:py-8 lg:px-12 lg:py-10">
        <div className="grid grid-cols-1 gap-8 pb-6 md:grid-cols-4">
          <div>
            <h2 className="text-lg font-bold text-white">🕵️ Imposter Game Generator</h2>
            <p className="mt-4 text-sm leading-7 text-gray-400">
              A free, browser-based social deduction party game. Find the imposter using
              your phones—zero app installs required.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-base font-bold text-white">Game Resources</h3>
            <div className="flex flex-col space-y-2 text-sm text-gray-400">
              {footerColumns.resources.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition-colors hover:text-[#00D17F]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-base font-bold text-white">Topics &amp; Features</h3>
            <div className="flex flex-col space-y-2 text-sm text-gray-400">
              {footerColumns.topics.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="transition-colors hover:text-[#00D17F]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-base font-bold text-white">Perfect For</h3>
            <div className="flex flex-col space-y-2 text-sm text-gray-400">
              {footerColumns.perfectFor.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 border-t border-white/10 pt-6">
          <a
            href="https://turbo0.com/item/imposter-game-generator"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            <img
              src="https://img.turbo0.com/badge-listed-light.svg"
              alt="Listed on Turbo0"
              style={{ height: 54, width: 'auto' }}
            />
          </a>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-4 text-sm text-gray-500 md:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:justify-start">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>Contact</span>
          </div>
          <p>© 2026 Imposter Game Generator. All rights reserved.</p>
        </div>
      </footer>
    </section>
  );
}
