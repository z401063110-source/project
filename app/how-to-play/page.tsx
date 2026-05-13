import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How to Play Using the Imposter Game Generator',
  description:
    'Learn how to set up, reveal roles, give clues, discuss, vote, and win with the Imposter Game Generator. A complete guide for new and experienced players.',
  alternates: {
    canonical: '/how-to-play',
  },
  openGraph: {
    title: 'How to Play Using the Imposter Game Generator',
    description:
      'Learn how to set up, reveal roles, give clues, discuss, vote, and win with the Imposter Game Generator. A complete guide for new and experienced players.',
    url: '/how-to-play',
    siteName: 'Imposter Game Generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Play Using the Imposter Game Generator',
    description:
      'Learn how to set up, reveal roles, give clues, discuss, vote, and win with the Imposter Game Generator. A complete guide for new and experienced players.',
  },
};

const HOME_ROUTE = '/';
const RULES_ROUTE = '/rules';
const WORDS_ROUTE = '/imposter-game-words';
const TOPICS_ROUTE = '/imposter-game-topics';

type SetupStep = {
  title: string;
  text: string;
  proTip?: string;
};

const setupSteps: SetupStep[] = [
  {
    title: 'Gather Your Group',
    text:
      'Get your smartest friends together. This experience works best with 4 to 10 players. You can sit around a campfire, gather at a dinner table, or chill on the couch. Make sure one person has their phone or tablet open to the Imposter Game Generator.',
    proTip:
      'Pro tip: If you have more than 10 players, consider splitting into two groups and running separate matches side by side using the Imposter Game Generator to keep everyone fully engaged.',
  },
  {
    title: 'Choose Your Game Settings',
    text:
      'Open the lobby menu in the Imposter Game Generator and pick your category. If you are playing with family, start with the Easy difficulty and choose familiar topics. For a brutal psychological challenge with adults, switch the Imposter Game Generator to Hard mode and select abstract concepts.',
  },
  {
    title: 'Set the Player Count',
    text:
      'Use the simple plus and minus buttons to match the exact number of people in the room. The Imposter Game Generator will silently calculate the odds and randomly assign one person as the odd one out. Everyone else receives the identical standard word.',
  },
  {
    title: 'Start and Reveal',
    text:
      'Press start. Pass the device around the circle. Each player taps and holds the screen on the Imposter Game Generator to reveal their secret identity. When they let go, the word vanishes, making it perfectly safe to hand to the next person. Guard your screen carefully!',
  },
  {
    title: 'Take Turns Giving Clues',
    text:
      'Once the Imposter Game Generator has distributed the words, the tension begins. Going clockwise, each player says exactly one word or short phrase that relates to their secret word. The clue cannot be the word itself.',
  },
  {
    title: 'Discuss and Defend',
    text:
      'After everyone gives a clue, open the floor for discussion. Ask suspicious players to explain their clue choices. This is where the Imposter Game Generator becomes a true social deduction battle, as confident bluffing and sharp observation collide.',
  },
  {
    title: 'Vote and Reveal',
    text:
      'When the discussion ends, each player votes for the person they believe is the outsider. Reveal the result. If the group catches the outsider, give them one final chance to guess the secret word. If they guess correctly, they steal the win. If they fail, the group wins the round.',
  },
] as const;

const examplePlayers = [
  'Player 1: "Burger"',
  'Player 2: "Burger"',
  'Player 3 (The Imposter): "Pizza"',
  'Player 4: "Burger"',
  'Player 5: "Burger"',
] as const;

const groupTips = [
  {
    title: 'Playing with Kids',
    text:
      'Stick to Easy mode on the Imposter Game Generator. Use highly familiar categories like Animals or Food. Allow them to use two-word clues if they get stuck. Keep the atmosphere light and focus entirely on the fun.',
  },
  {
    title: 'Playing with Adults',
    text:
      'Crank the Imposter Game Generator up to Hard difficulty. Try abstract categories. Introduce a strict 10-second timer for giving clues to force panic mistakes and increase the pressure in the room.',
  },
] as const;

const commonMistakes = [
  {
    title: 'Giving the word away immediately',
    text:
      'If your clue is too obvious, the outsider will instantly figure out the secret word, blending in perfectly for the rest of the round. The Imposter Game Generator rewards subtle thinkers.',
  },
  {
    title: 'The outsider panicking',
    text:
      'New players often freeze up when the Imposter Game Generator hands them the odd word. Take a breath, listen to what the person before you said, and pick a safe, adaptable direction.',
  },
  {
    title: 'Voting too quickly',
    text:
      'Give everyone a chance to defend themselves before casting your final vote. The discussion phase is where the best psychological deductions happen.',
  },
] as const;

type StepCardProps = {
  number: number;
  title: string;
  text: string;
  proTip?: string;
};

type InfoCardProps = {
  title: string;
  text: string;
};

const glassCardClass =
  'group rounded-3xl border border-white/[0.05] bg-white/[0.02] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.08] hover:bg-white/[0.04] md:p-10';
const sectionAccentClass = 'border-l-2 border-[#00D17F]/30 pl-6 md:pl-8';

function SectionHeading({ id, title }: { id: string; title: string }) {
  return (
    <div className={sectionAccentClass}>
      <h2 id={id} className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
        {title}
      </h2>
    </div>
  );
}

function StepCard({ number, title, text, proTip }: StepCardProps) {
  return (
    <li className={glassCardClass}>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#00D17F] text-lg font-black text-[#04130D] shadow-[0_0_35px_rgba(0,209,127,0.28)]">
          {number}
        </div>

        <div className="flex-1">
          <h3 className="text-2xl font-semibold text-white">{title}</h3>
          <p className="mt-4 text-base leading-8 text-slate-300">{text}</p>

          {proTip ? (
            <div className="mt-6 rounded-2xl border border-[#00D17F]/15 bg-[#00D17F]/[0.06] p-5">
              <p className="text-sm leading-7 text-slate-100 md:text-base">{proTip}</p>
            </div>
          ) : null}
        </div>
      </div>
    </li>
  );
}

function InfoCard({ title, text }: InfoCardProps) {
  return (
    <div className={glassCardClass}>
      <h3 className="text-2xl font-semibold text-white">{title}</h3>
      <p className="mt-4 text-base leading-8 text-slate-300">{text}</p>
    </div>
  );
}

function WarningCard({ title, text }: InfoCardProps) {
  return (
    <div className="group rounded-3xl border border-red-500/10 bg-red-500/[0.02] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-red-400/20 hover:bg-red-500/[0.04] md:p-10">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-4 text-base leading-8 text-slate-300">{text}</p>
    </div>
  );
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Play Using the Imposter Game Generator',
  description:
    'A complete step-by-step guide to setting up, playing, and winning rounds with the Imposter Game Generator.',
  totalTime: 'PT5M',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Gather Your Group',
      text: 'Get 4 to 10 players together around a table or online. Make sure one person has their phone or tablet open to the Imposter Game Generator.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Choose Your Game Settings',
      text: 'Open the lobby menu and pick your category and difficulty level. Easy mode works great for families; Hard mode adds abstract concepts for a deeper challenge.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Set the Player Count',
      text: 'Use the plus and minus buttons to match the exact number of people in the room. The generator will randomly assign one person as the outsider.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Start and Reveal',
      text: 'Press start. Pass the device around so each player taps and holds the screen to reveal their secret identity. When they let go, the word vanishes.',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Take Turns Giving Clues',
      text: 'Going clockwise, each player says exactly one word or short phrase that relates to their secret word — but cannot be the word itself.',
    },
    {
      '@type': 'HowToStep',
      position: 6,
      name: 'Discuss and Defend',
      text: 'After everyone gives a clue, open the floor for discussion. Ask suspicious players to explain their clue choices.',
    },
    {
      '@type': 'HowToStep',
      position: 7,
      name: 'Vote and Reveal',
      text: 'Each player votes for the person they believe is the outsider. If caught, the outsider gets one final chance to guess the secret word and steal the win.',
    },
  ],
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
      name: 'How to Play',
      item: 'https://www.impostergame-generator.com/how-to-play',
    },
  ],
};

export default function HowToPlayPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
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
        <section
          aria-labelledby="how-to-play-title"
          className="relative pb-10 pt-6 text-center md:pb-16 md:pt-10"
        >
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 -z-10 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-[#00D17F]/10 blur-[150px]"
          />
          <h1
            id="how-to-play-title"
            className="mx-auto mb-6 max-w-5xl text-5xl font-extrabold leading-[1.02] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-[#00D17F] md:text-6xl"
          >
            How to Play Using the Imposter Game Generator
          </h1>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-white/70">
            Are you ready to test your friendships and your poker face? Welcome to the
            ultimate guide on setting up your next party. Whether you are completely new to
            social deduction or looking for ways to level up your deception strategy, this
            guide covers everything you need to know about mastering the Imposter Game
            Generator.
          </p>
        </section>

        <section aria-labelledby="step-by-step-setup" className="mt-8">
          <SectionHeading id="step-by-step-setup" title="Step-by-Step Setup" />

          <ol className="mt-8 space-y-6">
            {setupSteps.map((step, index) => (
              <StepCard
                key={step.title}
                number={index + 1}
                title={step.title}
                text={step.text}
                proTip={step.proTip}
              />
            ))}
          </ol>
        </section>

        <p className="mt-6 text-base leading-8 text-slate-300">
          Want the quick-reference version? See our{' '}
          <Link href={RULES_ROUTE} className="font-medium text-[#00D17F] underline underline-offset-4 transition-colors hover:text-[#14E38D]">
            complete rules overview
          </Link>{' '}
          for a condensed breakdown of every phase. You can also browse{' '}
          <Link href={WORDS_ROUTE} className="font-medium text-[#00D17F] underline underline-offset-4 transition-colors hover:text-[#14E38D]">
            imposter game word ideas
          </Link>{' '}
          and{' '}
          <Link href={TOPICS_ROUTE} className="font-medium text-[#00D17F] underline underline-offset-4 transition-colors hover:text-[#14E38D]">
            topic packs
          </Link>{' '}
          before choosing your settings.
        </p>

        <section aria-labelledby="example-round" className="mt-16">
          <SectionHeading id="example-round" title="Example Round" />

          <div className="mt-8 rounded-[2rem] border border-[#00D17F]/20 bg-white/[0.03] p-8 shadow-[0_28px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="text-sm font-medium uppercase tracking-[0.24em] text-white/45">
                  Secret Word:
                </h3>
                <span className="mt-4 inline-block rounded-full border border-[#00D17F]/30 bg-[#00D17F]/15 px-4 py-1.5 text-lg font-bold text-[#00D17F] shadow-[0_0_30px_rgba(0,209,127,0.15)]">
                  Burger
                </span>
              </div>

              <p className="max-w-sm text-sm leading-7 text-white/60 md:text-right">
                Players: 5 players. The Imposter Game Generator has secretly chosen
                Player 3 as the imposter.
              </p>
            </div>

            <ul className="mt-8 flex flex-col gap-3">
              {examplePlayers.map((player, index) => {
                const [playerLabel, ...clueParts] = player.split(': ');
                const clue = clueParts.join(': ');
                const isImposter = playerLabel === 'Player 3 (The Imposter)';

                return (
                  <li
                    key={player}
                    className={[
                      'flex items-center justify-between gap-4 rounded-xl border p-4 transition-colors',
                      isImposter
                        ? 'border-[#00D17F]/40 bg-[#00D17F]/10'
                        : 'border-white/[0.05] bg-white/[0.03] hover:bg-white/[0.05]',
                    ].join(' ')}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs text-white/50">
                        {`P${index + 1}`}
                      </span>
                      <span
                        className={[
                          'truncate text-sm md:text-base',
                          isImposter ? 'font-bold text-[#00D17F]' : 'text-white/80',
                        ].join(' ')}
                      >
                        {playerLabel}
                      </span>
                    </div>

                    <span
                      className={[
                        'shrink-0 text-right text-sm font-medium md:text-base',
                        isImposter ? 'font-bold text-[#00D17F]' : 'text-white',
                      ].join(' ')}
                    >
                      {clue}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 rounded-xl border-l-4 border-[#00D17F] bg-black/30 p-5 text-sm leading-relaxed text-white/70">
              In this scenario set up by the Imposter Game Generator, Player 3 is holding
              Pizza while the rest of the table is working from Burger. The group might
              pick up on the mismatch during the discussion phase, which is exactly what
              makes the Imposter Game Generator so endlessly replayable.
            </div>
          </div>
        </section>

        <section aria-labelledby="tips-for-different-groups" className="mt-16">
          <SectionHeading
            id="tips-for-different-groups"
            title="Tips for Different Groups"
          />

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {groupTips.map((tip) => (
              <InfoCard key={tip.title} title={tip.title} text={tip.text} />
            ))}
          </div>
        </section>

        <section aria-labelledby="common-mistakes-to-avoid" className="mt-16">
          <SectionHeading
            id="common-mistakes-to-avoid"
            title="Common Mistakes to Avoid"
          />

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {commonMistakes.map((mistake) => (
              <WarningCard
                key={mistake.title}
                title={mistake.title}
                text={mistake.text}
              />
            ))}
          </div>
        </section>

        <section className="relative mx-auto mt-20 max-w-4xl overflow-hidden rounded-[2rem] border border-white/[0.06] bg-white/[0.03] p-8 text-center shadow-[0_30px_100px_rgba(0,0,0,0.38)] backdrop-blur-xl md:p-10">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 h-40 w-72 -translate-x-1/2 rounded-full bg-[#00D17F]/10 blur-[100px]"
          />
          <h2 className="relative text-3xl font-black tracking-tight text-white md:text-4xl">
            Ready to Put These Strategies to the Test?
          </h2>
          <p className="relative mx-auto mt-4 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
            Start a match right now and try out the tactics you just learned.
          </p>

          <div className="relative mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href={HOME_ROUTE}
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
            <Link
              href={WORDS_ROUTE}
              className="inline-flex items-center justify-center rounded-full border border-white/[0.15] bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:border-white/30 hover:bg-white/[0.08]"
            >
              Word Ideas
            </Link>
            <Link
              href={TOPICS_ROUTE}
              className="inline-flex items-center justify-center rounded-full border border-white/[0.15] bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:border-white/30 hover:bg-white/[0.08]"
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
