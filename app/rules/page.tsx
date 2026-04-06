import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Complete Imposter Game Rules: How to Play and Win',
  description:
    'Master the Imposter Game. Learn the official rules, setup phases, voting mechanics, and ultimate strategies for winning this social deduction party game.',
};

const START_ROUTE = '/imposter-game-generator';
const HOME_ROUTE = '/';

const quickGuideCards = [
  {
    title: '1. Set Up the Game',
    text:
      'Choose a category, pick the difficulty, and set the player count. The Imposter Game Generator assigns one outsider and gives everyone else the same secret word.',
  },
  {
    title: '2. Reveal and Give Clues',
    text:
      'Pass the device around so each player privately reveals their role. Then go in order and give one short clue related to the word without saying it directly.',
  },
  {
    title: '3. Discuss, Vote, and Win',
    text:
      'After all clues are shared, discuss suspicious answers and vote for the outsider. If the outsider gets caught, they still have one last chance to guess the word and steal the win.',
  },
] as const;

const examplePlayers = [
  'Player 1: “Burger”',
  'Player 2: “Burger”',
  'Player 3: “Pizza”',
  'Player 4: “Burger”',
  'Player 5: “Burger”',
] as const;

const benefitCards = [
  {
    title: 'Fast to Set Up',
    text: 'You can launch a round in seconds with almost no explanation.',
  },
  {
    title: 'Easy to Learn',
    text:
      'New players understand the rules quickly, even in casual group settings.',
  },
  {
    title: 'Highly Replayable',
    text: 'Different words, clues, and personalities make every round feel different.',
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

export default function RulesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0B101B] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[#00D17F]/10 blur-[140px]" />
        <div className="absolute right-0 top-28 h-72 w-72 rounded-full bg-cyan-400/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 py-16 md:px-8">
        <section aria-labelledby="rules-page-title" className="relative pb-12 pt-6 text-center md:pb-16">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 -z-10 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-[#00D17F]/10 blur-[140px]"
          />
          <h1
            id="rules-page-title"
            className="mx-auto mb-6 max-w-4xl text-5xl font-extrabold leading-[1.02] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-[#00D17F] md:text-6xl"
          >
            Complete Imposter Game Rules: How to Play and Win
          </h1>
          <p className="mx-auto max-w-2xl text-xl leading-relaxed text-white/70">
            Use the Imposter Game Generator to start a fast social deduction round in
            seconds. Reveal secret roles, give clever clues, spot the outsider, and vote
            before they guess the word.
          </p>
        </section>

        <section aria-labelledby="how-it-works" className="mt-4">
          <SectionHeading id="how-it-works" title="How It Works" />

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {quickGuideCards.map((card) => (
              <article key={card.title} className={glassCardClass}>
                <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                <p className="mt-4 text-base leading-8 text-slate-300">{card.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="example-round" className="mt-16">
          <SectionHeading id="example-round" title="Example Round" />

          <div className="mt-8 rounded-2xl border border-[#00D17F]/20 bg-[rgba(26,32,44,0.88)] p-7 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-md md:p-9">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="inline-flex rounded-lg border border-red-400/30 bg-red-500/[0.08] px-4 py-2 text-sm font-medium uppercase tracking-[0.22em] text-red-300 shadow-[0_0_30px_rgba(248,113,113,0.08)]">
                  Secret Word: Pizza
                </p>
                <p className="mt-3 max-w-xl text-base leading-7 text-white/65">
                  5 players are in the room. The Imposter Game Generator secretly selects
                  Player 3 as the Imposter.
                </p>
              </div>
            </div>

            <ul className="mt-6 space-y-3">
              {examplePlayers.map((player, index) => {
                const [playerLabel, ...clueParts] = player.split(': ');
                const clue = clueParts.join(': ');
                const isImposter = playerLabel === 'Player 3';

                return (
                  <li
                    key={player}
                    className={[
                      'flex items-center justify-between rounded-xl border px-4 py-3',
                      isImposter
                        ? 'border-red-400/25 bg-red-500/[0.08]'
                        : 'border-white/10 bg-white/[0.04]',
                    ].join(' ')}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={[
                          'flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium',
                          isImposter ? 'bg-red-500/15 text-red-300' : 'bg-white/10 text-white/55',
                        ].join(' ')}
                      >
                        {`P${index + 1}`}
                      </span>
                      <span
                        className={[
                          'text-sm font-medium md:text-base',
                          isImposter ? 'font-semibold text-red-300' : 'text-white/80',
                        ].join(' ')}
                      >
                        {playerLabel}
                      </span>
                    </div>
                    <span
                      className={[
                        'text-sm font-semibold md:text-base',
                        isImposter ? 'text-red-300' : 'text-white',
                      ].join(' ')}
                    >
                      {clue}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 rounded-xl border-l-4 border-[#00D17F] bg-black/25 p-5">
              <p className="text-sm leading-7 text-white/70 md:text-base">
                “Pizza” is safe, but it is also more generic than the other clues. That is
                where the tension begins: was it smart bluffing, or a weak Imposter
                guess?
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="why-players-love-it" className="mt-16">
          <SectionHeading id="why-players-love-it" title="Why Players Love It" />

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {benefitCards.map((card) => (
              <article key={card.title} className={glassCardClass}>
                <div className="mb-4 h-2 w-16 rounded-full bg-[#00D17F]" />
                <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                <p className="mt-4 text-base leading-8 text-slate-300">{card.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="relative mx-auto mt-20 max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-md md:p-10">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 h-40 w-72 -translate-x-1/2 rounded-full bg-[#00D17F]/10 blur-[100px]"
          />
          <h2 className="relative text-3xl font-black tracking-tight text-white md:text-4xl">
            Ready to Start a Round?
          </h2>
          <p className="relative mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
            Open the Imposter Game Generator and test your bluffing skills now.
          </p>

          <div className="relative mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href={START_ROUTE}
              className="inline-flex items-center justify-center rounded-full bg-[#00D17F] px-6 py-3.5 text-sm font-bold text-[#04130D] transition-all duration-300 hover:scale-105 hover:bg-[#14E38D]"
            >
              Start a Game
            </Link>
            <Link
              href={HOME_ROUTE}
              className="inline-flex items-center justify-center rounded-full border border-white/[0.15] bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:border-white/30 hover:bg-white/[0.08]"
            >
              Back to Home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
