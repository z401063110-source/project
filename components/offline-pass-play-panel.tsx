'use client';

import type { User as SupabaseUser } from '@supabase/supabase-js';
import { useEffect, useState, type PointerEvent as ReactPointerEvent } from 'react';
import wordLibrary from '@/data/wordLibrary.json';
import {
  clearAuthReturnState,
  readAuthReturnState,
  saveAuthReturnState,
} from '@/lib/auth-return-state';

type TopicPack = 'Animals' | 'Food' | 'School' | 'Office' | 'Movies' | 'Travel';
type Difficulty = 'Easy' | 'Medium' | 'Hard';
type PairType = 'concrete' | 'abstract';
type Role = 'Civilian' | 'Imposter';

type WordPair = {
  civilian: string;
  imposter: string;
  type: PairType;
};

type WordPack = {
  id: string;
  name: string;
  pairs: WordPair[];
};

type WordLibrary = {
  packs: WordPack[];
};

type OfflinePlayer = {
  id: number;
  name: string;
  role: Role;
  word: string;
};

type OfflineRound = {
  players: OfflinePlayer[];
  topicPack: TopicPack;
  difficulty: Difficulty;
};

type OfflinePhase = 'setup' | 'handoff' | 'reveal' | 'voting' | 'resolution';

const freeTopicPacks: TopicPack[] = ['Animals', 'Food', 'School', 'Office'];
const premiumTopicPacks: TopicPack[] = ['Movies', 'Travel'];
const topicPacks: TopicPack[] = [...freeTopicPacks, ...premiumTopicPacks];
const difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard'];
const packIdByTopicPack: Record<TopicPack, string> = {
  Animals: 'pack_animals',
  Food: 'pack_food',
  School: 'pack_school',
  Office: 'pack_office',
  Movies: 'pack_movies',
  Travel: 'pack_travel',
};
const library = wordLibrary as WordLibrary;

function getPlayerLabel(index: number) {
  return `Player ${index + 1}`;
}

function clampImposterCount(imposterCount: number, playerCount: number) {
  return Math.max(1, Math.min(Math.floor(imposterCount), Math.max(1, playerCount - 1)));
}

function isPremiumTopicPack(topicPack: TopicPack) {
  return premiumTopicPacks.includes(topicPack);
}

function isTopicPack(value: unknown): value is TopicPack {
  return topicPacks.includes(value as TopicPack);
}

function isDifficulty(value: unknown): value is Difficulty {
  return difficulties.includes(value as Difficulty);
}

function optionButtonStyles(isActive: boolean) {
  return [
    'rounded-3xl border px-4 py-4 text-sm font-semibold tracking-wide',
    isActive
      ? 'border-emerald-400 bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/20'
      : 'border-white/10 bg-slate-950/45 text-slate-200 hover:border-white/20 hover:bg-slate-900',
  ].join(' ');
}

function pickRandomItem<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffleArray<T>(items: T[]) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

function getPack(topicPack: TopicPack) {
  return library.packs.find((pack) => pack.id === packIdByTopicPack[topicPack]) ?? null;
}

function pickWordPair(topicPack: TopicPack, difficulty: Difficulty) {
  const selectedPack = getPack(topicPack);

  if (!selectedPack) {
    return null;
  }

  const filteredPairs =
    difficulty === 'Easy'
      ? selectedPack.pairs.filter((pair) => pair.type === 'concrete')
      : difficulty === 'Hard'
        ? selectedPack.pairs.filter((pair) => pair.type === 'abstract')
        : selectedPack.pairs;
  const availablePairs = filteredPairs.length > 0 ? filteredPairs : selectedPack.pairs;

  return pickRandomItem(availablePairs);
}

function createOfflineRound(
  topicPack: TopicPack,
  difficulty: Difficulty,
  playerCount: number,
  imposterCount: number,
) {
  const selectedPair = pickWordPair(topicPack, difficulty);

  if (!selectedPair) {
    return null;
  }

  const nextImposterCount = clampImposterCount(imposterCount, playerCount);
  const imposterIndexes = new Set(
    shuffleArray(Array.from({ length: playerCount }, (_, index) => index)).slice(
      0,
      nextImposterCount,
    ),
  );

  return {
    topicPack,
    difficulty,
    players: Array.from({ length: playerCount }, (_, index) => ({
      id: index + 1,
      name: getPlayerLabel(index),
      role: imposterIndexes.has(index) ? 'Imposter' : 'Civilian',
      word: imposterIndexes.has(index) ? selectedPair.imposter : selectedPair.civilian,
    })),
  } satisfies OfflineRound;
}

type OfflinePassPlayPanelProps = {
  onBack: () => void;
  onRequestSignIn?: () => void;
  user?: SupabaseUser | null;
  isLoginModalOpen?: boolean;
};

export function OfflinePassPlayPanel({
  onBack,
  onRequestSignIn,
  user = null,
  isLoginModalOpen = false,
}: OfflinePassPlayPanelProps) {
  const [phase, setPhase] = useState<OfflinePhase>('setup');
  const [topicPack, setTopicPack] = useState<TopicPack>('Animals');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [playerCount, setPlayerCount] = useState(6);
  const [imposterCount, setImposterCount] = useState(1);
  const [round, setRound] = useState<OfflineRound | null>(null);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isPeeking, setIsPeeking] = useState(false);
  const [selectedVoteIndex, setSelectedVoteIndex] = useState<number | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const hasUnlockedPremiumPacks = Boolean(user);

  const currentPlayer = round?.players[currentPlayerIndex] ?? null;
  const eliminatedPlayer =
    selectedVoteIndex !== null && round ? round.players[selectedVoteIndex] : null;
  const isRevealVisible = phase === 'reveal' && isPeeking;

  useEffect(() => {
    if (!hasUnlockedPremiumPacks && isPremiumTopicPack(topicPack)) {
      setTopicPack('Animals');
    }
  }, [hasUnlockedPremiumPacks, topicPack]);

  useEffect(() => {
    if (!hasUnlockedPremiumPacks) {
      return;
    }

    const authReturnState = readAuthReturnState();

    if (!authReturnState || authReturnState.kind !== 'offline') {
      return;
    }

    const nextTopicPack = isTopicPack(authReturnState.topicPack)
      ? authReturnState.topicPack
      : 'Animals';
    const nextDifficulty = isDifficulty(authReturnState.difficulty)
      ? authReturnState.difficulty
      : 'Medium';
    const nextPlayerCount = Math.max(3, Math.min(12, Math.floor(authReturnState.playerCount)));
    const nextImposterCount = clampImposterCount(authReturnState.imposterCount, nextPlayerCount);

    setPhase('setup');
    setTopicPack(nextTopicPack);
    setDifficulty(nextDifficulty);
    setPlayerCount(nextPlayerCount);
    setImposterCount(nextImposterCount);
    setRound(null);
    setCurrentPlayerIndex(0);
    setSelectedVoteIndex(null);
    setIsPeeking(false);
    setLocalError(null);
    clearAuthReturnState();
  }, [hasUnlockedPremiumPacks]);

  useEffect(() => {
    if (phase !== 'reveal') {
      setIsPeeking(false);
    }
  }, [currentPlayerIndex, phase]);

  const handlePeekPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setIsPeeking(true);
  };

  const handlePeekPointerEnd = (event?: ReactPointerEvent<HTMLButtonElement>) => {
    if (event && event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setIsPeeking(false);
  };

  const handleTopicPackSelect = (nextTopicPack: TopicPack) => {
    if (!hasUnlockedPremiumPacks && isPremiumTopicPack(nextTopicPack)) {
      if (onRequestSignIn) {
        saveAuthReturnState({
          kind: 'offline',
          topicPack: nextTopicPack,
          difficulty,
          playerCount,
          imposterCount,
        });
        onRequestSignIn();
      } else {
        setLocalError('Sign in with Google to unlock extra topic packs.');
      }

      return;
    }

    setLocalError(null);
    setTopicPack(nextTopicPack);
  };

  const handleCreateRound = () => {
    setLocalError(null);

    const nextRound = createOfflineRound(topicPack, difficulty, playerCount, imposterCount);

    if (!nextRound) {
      setLocalError('Unable to create an offline round right now.');
      return;
    }

    setRound(nextRound);
    setCurrentPlayerIndex(0);
    setSelectedVoteIndex(null);
    setIsPeeking(false);
    setPhase('handoff');
  };

  const handleNextRevealStep = () => {
    if (!round) {
      return;
    }

    setIsPeeking(false);

    if (currentPlayerIndex >= round.players.length - 1) {
      setPhase('voting');
      return;
    }

    setCurrentPlayerIndex((currentIndex) => currentIndex + 1);
    setPhase('handoff');
  };

  const handleRevealImposter = () => {
    if (!round) {
      return;
    }

    const imposterIndex = round.players.findIndex((player) => player.role === 'Imposter');
    setSelectedVoteIndex(imposterIndex >= 0 ? imposterIndex : 0);
    setPhase('resolution');
  };

  const handlePlayAgain = () => {
    setPhase('setup');
    setRound(null);
    setCurrentPlayerIndex(0);
    setSelectedVoteIndex(null);
    setIsPeeking(false);
    setLocalError(null);
  };

  return (
    <div className="flex min-h-[calc(100svh-1.5rem)] flex-col gap-5">
      {localError && (
        <div className="rounded-[24px] border border-rose-400/20 bg-rose-500/10 px-4 py-4 text-sm font-medium text-rose-200">
          {localError}
        </div>
      )}

      {phase === 'setup' && (
        <>
          <div className="rounded-[28px] border border-white/10 bg-slate-950/45 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
              Pass & Play
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
              Offline one-phone mode
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-300">
              Set up a local round and pass the same device around the table. No room
              code or internet required.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-5">
            <div>
              <p className="mb-3 text-sm font-medium text-slate-400">Topic Pack</p>
              <div className="grid grid-cols-2 gap-3">
                {topicPacks.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={topicPack === option}
                    aria-haspopup={
                      !hasUnlockedPremiumPacks && isPremiumTopicPack(option)
                        ? 'dialog'
                        : undefined
                    }
                    aria-expanded={
                      !hasUnlockedPremiumPacks && isPremiumTopicPack(option)
                        ? isLoginModalOpen
                        : undefined
                    }
                    className={
                      !hasUnlockedPremiumPacks && isPremiumTopicPack(option)
                        ? 'rounded-3xl border border-white/10 bg-slate-950/35 px-4 py-4 text-sm font-semibold tracking-wide text-slate-400 opacity-80 hover:border-white/15 hover:bg-slate-900/70'
                        : optionButtonStyles(topicPack === option)
                    }
                    onClick={() => handleTopicPackSelect(option)}
                  >
                    {!hasUnlockedPremiumPacks && isPremiumTopicPack(option)
                      ? `${option} 🔒`
                      : option}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              {!hasUnlockedPremiumPacks && (
                <p className="mt-6 mb-2 text-sm text-slate-400">
                  Free to play now. Sign in with Google to unlock extra topic packs.
                </p>
              )}
              <p className="mb-3 text-sm font-medium text-slate-400">Difficulty</p>
              <div className="grid grid-cols-3 gap-3">
                {difficulties.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={difficulty === option}
                    className={optionButtonStyles(difficulty === option)}
                    onClick={() => setDifficulty(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-3 text-sm font-medium text-slate-400">Players</p>
              <div className="flex items-center gap-3 rounded-[24px] border border-white/10 bg-slate-950/60 p-3">
                <button
                  type="button"
                  className="flex h-14 w-14 items-center justify-center rounded-[18px] border border-white/10 bg-slate-900 text-3xl font-black text-white hover:bg-slate-800"
                  onClick={() => setPlayerCount((count) => Math.max(3, count - 1))}
                >
                  -
                </button>
                <div className="flex min-h-[56px] flex-1 items-center justify-center rounded-[18px] border border-white/10 bg-slate-900 px-4 text-2xl font-black text-white tabular-nums">
                  {playerCount}
                </div>
                <button
                  type="button"
                  className="flex h-14 w-14 items-center justify-center rounded-[18px] border border-white/10 bg-slate-900 text-3xl font-black text-white hover:bg-slate-800"
                  onClick={() => setPlayerCount((count) => Math.min(12, count + 1))}
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-3 text-sm font-medium text-slate-400">Imposters</p>
              <div className="flex items-center gap-3 rounded-[24px] border border-white/10 bg-slate-950/60 p-3">
                <button
                  type="button"
                  className="flex h-14 w-14 items-center justify-center rounded-[18px] border border-white/10 bg-slate-900 text-3xl font-black text-white hover:bg-slate-800"
                  onClick={() =>
                    setImposterCount((count) => clampImposterCount(count - 1, playerCount))
                  }
                >
                  -
                </button>
                <div className="flex min-h-[56px] flex-1 items-center justify-center rounded-[18px] border border-white/10 bg-slate-900 px-4 text-2xl font-black text-white tabular-nums">
                  {clampImposterCount(imposterCount, playerCount)}
                </div>
                <button
                  type="button"
                  className="flex h-14 w-14 items-center justify-center rounded-[18px] border border-white/10 bg-slate-900 text-3xl font-black text-white hover:bg-slate-800"
                  onClick={() =>
                    setImposterCount((count) => clampImposterCount(count + 1, playerCount))
                  }
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="mt-auto grid gap-3">
            <button
              type="button"
              className="inline-flex min-h-[88px] w-full items-center justify-center rounded-[28px] bg-emerald-500 text-xl font-bold text-slate-950 shadow-lg shadow-emerald-950/30 hover:bg-emerald-400"
              onClick={handleCreateRound}
            >
              Start Offline Round
            </button>
            <button
              type="button"
              className="inline-flex min-h-[72px] w-full items-center justify-center rounded-[24px] border border-white/10 bg-slate-900 text-base font-semibold text-white hover:bg-slate-800"
              onClick={onBack}
            >
              Back to Online Entry
            </button>
          </div>
        </>
      )}

      {phase === 'handoff' && currentPlayer && (
        <>
          <div className="rounded-[28px] border border-white/10 bg-slate-950/45 p-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
              Offline Handoff
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-white">
              Pass the phone to {currentPlayer.name}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-300">
              Make sure no one else is looking before this player reveals their role.
            </p>
          </div>

          <button
            type="button"
            className="mt-auto inline-flex min-h-[88px] w-full items-center justify-center rounded-[28px] bg-emerald-500 text-xl font-bold text-slate-950 shadow-lg shadow-emerald-950/30 hover:bg-emerald-400"
            onClick={() => setPhase('reveal')}
          >
            I Am {currentPlayer.name}
          </button>
        </>
      )}

      {phase === 'reveal' && currentPlayer && (
        <>
          <div className="rounded-[28px] border border-white/10 bg-slate-950/45 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
              Private Identity
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
              Hold to peek
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-300">
              Release to hide before handing the phone to the next player.
            </p>
          </div>

          <button
            type="button"
            aria-pressed={isRevealVisible}
            aria-label={
              isRevealVisible
                ? 'Release to hide your private role and word'
                : 'Press and hold to reveal your private role and word'
            }
            className="flex min-h-[380px] w-full touch-none flex-col items-center justify-center rounded-[28px] border border-white/10 bg-slate-950/80 p-6 text-center"
            onPointerDown={handlePeekPointerDown}
            onPointerUp={handlePeekPointerEnd}
            onPointerLeave={handlePeekPointerEnd}
            onPointerCancel={handlePeekPointerEnd}
            onLostPointerCapture={() => handlePeekPointerEnd()}
            onBlur={() => handlePeekPointerEnd()}
            onContextMenu={(event) => event.preventDefault()}
          >
            <div className="max-w-md">
              <div
                className={[
                  'inline-flex rounded-full px-4 py-2 text-sm font-bold uppercase tracking-[0.18em]',
                  isRevealVisible && currentPlayer.role === 'Imposter'
                    ? 'bg-rose-500/15 text-rose-300'
                    : isRevealVisible
                      ? 'bg-cyan-500/15 text-cyan-300'
                      : 'bg-white/5 text-slate-300',
                ].join(' ')}
              >
                {isRevealVisible ? currentPlayer.role : 'Identity Hidden'}
              </div>
              <p className="mt-8 text-sm uppercase tracking-[0.18em] text-slate-400">
                {isRevealVisible ? 'Assigned Word' : 'Secret Word'}
              </p>
              <p
                className={[
                  'mt-4 text-5xl font-black leading-tight',
                  isRevealVisible ? 'text-white' : 'text-slate-500',
                ].join(' ')}
              >
                {isRevealVisible ? currentPlayer.word : 'Press and Hold'}
              </p>
              <p className="mt-5 text-sm leading-6 text-slate-400">
                {isRevealVisible
                  ? 'Release immediately to hide your role before you hand the phone over.'
                  : 'Your role and word stay hidden until you keep pressing this card.'}
              </p>
            </div>

            <div className="mt-8 rounded-full border border-white/10 bg-slate-900 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
              {isRevealVisible ? 'Release to Hide' : 'Hold to Peek'}
            </div>
          </button>

          <button
            type="button"
            className="mt-auto inline-flex min-h-[88px] w-full items-center justify-center rounded-[28px] bg-emerald-500 text-xl font-bold text-slate-950 shadow-lg shadow-emerald-950/30 hover:bg-emerald-400"
            onClick={handleNextRevealStep}
          >
            {round && currentPlayerIndex >= round.players.length - 1
              ? 'Start Group Vote'
              : 'Hide and Pass On'}
          </button>
        </>
      )}

      {phase === 'voting' && round && (
        <>
          <div className="rounded-[28px] border border-white/10 bg-slate-950/45 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
              Offline Vote
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-white">
              Who Is the Imposter?
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-300">
              Decide together, then tap one player name to reveal the truth.
            </p>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-2 text-center">
            <p className="max-w-md text-base leading-7 text-slate-400">
              Discuss face-to-face. Once the group has reached a verdict, tap below to
              reveal the truth.
            </p>

            <button
              type="button"
              className="inline-flex min-h-[88px] w-full items-center justify-center rounded-[28px] bg-[#00D17F] px-6 text-xl font-bold text-slate-950 shadow-lg shadow-emerald-950/30 hover:bg-[#0fe08c]"
              onClick={handleRevealImposter}
            >
              Reveal Imposter
            </button>
          </div>
        </>
      )}

      {phase === 'resolution' && round && eliminatedPlayer && (
        <>
          <div className="rounded-[28px] border border-white/10 bg-slate-950/45 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
              Offline Result
            </p>
            <h2
              className={[
                'mt-4 text-4xl font-black tracking-tight',
                eliminatedPlayer.role === 'Imposter' ? 'text-emerald-300' : 'text-rose-300',
              ].join(' ')}
            >
              {eliminatedPlayer.role === 'Imposter'
                ? 'Imposter Defeated! Civilians Win'
                : 'Civilian Eliminated! Imposter Wins'}
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-300">
              The group voted out {eliminatedPlayer.name}.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
              Reveal
            </p>
            <p className="mt-3 text-3xl font-bold text-white">{eliminatedPlayer.name}</p>
            <div
              className={[
                'mt-4 inline-flex rounded-full px-4 py-2 text-sm font-bold uppercase tracking-[0.18em]',
                eliminatedPlayer.role === 'Imposter'
                  ? 'bg-rose-500/15 text-rose-300'
                  : 'bg-cyan-500/15 text-cyan-300',
              ].join(' ')}
            >
              {eliminatedPlayer.role}
            </div>
            <div className="mt-5 rounded-[24px] border border-white/10 bg-slate-950/80 px-5 py-4">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Assigned Word</p>
              <p className="mt-3 text-4xl font-black leading-tight text-white">
                {eliminatedPlayer.word}
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
              Full Truth
            </p>
            <div className="mt-4 space-y-3">
              {round.players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between rounded-[24px] border border-white/10 bg-slate-950/60 px-4 py-4"
                >
                  <div>
                    <p className="text-lg font-semibold text-white">{player.name}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {player.role} • {player.word}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto grid gap-3">
            <button
              type="button"
              className="inline-flex min-h-[88px] w-full items-center justify-center rounded-[28px] bg-emerald-500 text-xl font-bold text-slate-950 shadow-lg shadow-emerald-950/30 hover:bg-emerald-400"
              onClick={handlePlayAgain}
            >
              Play Again
            </button>
            <button
              type="button"
              className="inline-flex min-h-[72px] w-full items-center justify-center rounded-[24px] border border-white/10 bg-slate-900 text-base font-semibold text-white hover:bg-slate-800"
              onClick={onBack}
            >
              Back to Online Entry
            </button>
          </div>
        </>
      )}
    </div>
  );
}
