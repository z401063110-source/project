import Link from 'next/link';
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
    title: 'Set players and roles',
    description: 'Adjust the imposter count and difficulty level.',
  },
  {
    title: 'Reveal secret identities',
    description: 'Hold to peek at your hidden word.',
  },
  {
    title: 'Discuss and bluff',
    description: 'Use verbal clues to find the imposter or hide your identity.',
  },
  {
    title: 'Vote and resolve the round',
    description: 'Eliminate a player and check win conditions automatically.',
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
    { href: '/about', label: 'About' },
  ],
  topics: [
    { href: '/best-imposter-game-topics', label: 'Best Imposter Game Topics' },
    { href: '/imposter-game-theme-packs', label: 'Fun Theme Packs' },
    { href: '/difficulty', label: 'Customizable Difficulty' },
  ],
  perfectFor: [
    { href: '/face-to-face-parties', label: 'Face-to-Face Parties' },
    { href: '/imposter-game-for-team-building', label: 'Team Building' },
    { href: '/ice-breakers', label: 'Ice Breakers' },
    { href: '/family-gatherings', label: 'Family Gatherings' },
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

          <div className="mx-auto mt-3 max-w-3xl text-center text-base leading-7 text-slate-300 md:text-lg">
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
        </section>

        <section id="how-to-play" className={appCardClassName}>
          <SectionHeading
            badge="📘 How to Play"
            title="6-Step Round Guide"
            subtitle="Use this quick guide to get a party round running fast without overexplaining the rules."
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
        </section>

        <section id="game-rules" className={appCardClassName}>
          <SectionHeading
            badge="🏆 Rules & Tips"
            title="Game Rules, Win Conditions, and Strategy Tips"
            subtitle="Keep it simple: find the imposter if you are a civilian, and stay hidden if you are not."
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

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                Pro Tips for Players
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className={mutedPanelClassName}>
                  <h3 className="text-xl font-bold text-white">If you are not the imposter</h3>
                  <p className="mt-3 text-base leading-7 text-gray-400">
                    Give clear clues, listen for weird wording, and compare how confident people sound from round to round.
                  </p>
                </div>
                <div className={[mutedPanelClassName, 'border-[#39FF14]/15'].join(' ')}>
                  <h3 className="text-xl font-bold text-white">If you are the imposter</h3>
                  <p className="mt-3 text-base leading-7 text-gray-400">
                    Keep your clues short, stay close to the topic, and do not panic when the table starts testing you.
                  </p>
                </div>
              </div>
            </div>
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
                <p key={link.href}>
                  {link.label}
                </p>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-base font-bold text-white">Perfect For</h3>
            <div className="flex flex-col space-y-2 text-sm text-gray-400">
              {footerColumns.perfectFor.map((link) => (
                <p key={link.href}>
                  {link.label}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-gray-500 md:flex-row">
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
