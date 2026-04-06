'use client';

import type { RealtimeChannel, User as SupabaseUser } from '@supabase/supabase-js';
import { ArrowRight, Gamepad2, Plus } from 'lucide-react';
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { OfflinePassPlayPanel } from '@/components/offline-pass-play-panel';
import wordLibrary from '@/data/wordLibrary.json';
import { supabase } from '@/lib/supabase';

export type ImposterPanelScreen =
  | 'entry'
  | 'join'
  | 'lobby'
  | 'identity'
  | 'voting'
  | 'resolution'
  | 'offline';

type Screen = ImposterPanelScreen;
type DeviceRole = 'host' | 'guest';
type RoomStatus = 'waiting' | 'discussion' | 'playing' | 'voting' | 'tie_break' | 'finished';
type TopicPack = 'Animals' | 'Food' | 'School' | 'Office' | 'Movies' | 'Travel';
type Difficulty = 'Easy' | 'Medium' | 'Hard';
type PairType = 'concrete' | 'abstract';
type Role = 'Civilian' | 'Imposter';
type VoteRecord = Record<string, string | null>;

type WordPair = {
  civilian: string;
  imposter: string;
  type: PairType;
};

type WordPack = {
  id: string;
  name: string;
  description: string;
  pairs: WordPair[];
};

type WordLibrary = {
  version: string;
  total_pairs: number;
  last_updated: string;
  packs: WordPack[];
};

type LocalPlayer = {
  id: string;
  name: string;
  isHost: boolean;
};

type ImposterGamePanelProps = {
  entryLayout?: 'standalone' | 'embedded';
  onScreenChange?: (screen: ImposterPanelScreen) => void;
  onRequestSignIn?: () => void;
  user?: SupabaseUser | null;
  isLoginModalOpen?: boolean;
};

type RoomPlayer = {
  id: string;
  name: string;
  isHost: boolean;
  isReady: boolean;
  isAlive: boolean;
  hasVoted: boolean;
  role: Role | null;
  word: string | null;
};

type RoomData = {
  roomCode: string;
  status: RoomStatus;
  topicPack: TopicPack;
  packId: string;
  packName: string;
  difficulty: Difficulty;
  selectedPair: WordPair | null;
  players: RoomPlayer[];
  imposterCount: number;
  gameData: GameData;
};

type RoomRow = Record<string, unknown> & {
  room_code?: string;
  status?: string | null;
  imposter_count?: number | null;
  players?: unknown;
  game_data?: unknown;
};

type PlayerAssignment = {
  role: Role;
  word: string;
};

type GameResolution = {
  eliminatedPlayerId: string;
  civiliansWon: boolean;
  tally: Record<string, number>;
};

type GameAnnouncement = {
  id: string;
  message: string;
};

type GameData = {
  roundNumber?: number;
  tieBreakCount?: number;
  topicPack?: TopicPack;
  difficulty?: Difficulty;
  imposterCount?: number;
  packName?: string;
  packId?: string;
  selectedPair?: WordPair | null;
  votes?: VoteRecord;
  candidates?: string[];
  voteEndsAt?: string | null;
  announcement?: GameAnnouncement | null;
  resolution?: GameResolution | null;
};

const freeTopicPacks: TopicPack[] = ['Animals', 'Food', 'School', 'Office'];
const premiumTopicPacks: TopicPack[] = ['Movies', 'Travel'];
const topicPacks: TopicPack[] = [...freeTopicPacks, ...premiumTopicPacks];
const difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard'];
const keypadLayout = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'back'];
const DEFAULT_TOPIC_PACK: TopicPack = 'Animals';
const DEFAULT_DIFFICULTY: Difficulty = 'Medium';
const VOTING_DURATION_MS = 15_000;
const COUNTDOWN_TICK_MS = 200;
const library = wordLibrary as WordLibrary;

const packIdByTopicPack: Record<TopicPack, string> = {
  Animals: 'pack_animals',
  Food: 'pack_food',
  School: 'pack_school',
  Office: 'pack_office',
  Movies: 'pack_movies',
  Travel: 'pack_travel',
};

function generateNumericRoomCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function generatePlayerId() {
  return `player-${crypto.randomUUID()}`;
}

function normalizeRoomStatus(status: string | null | undefined): RoomStatus {
  if (
    status === 'discussion' ||
    status === 'playing' ||
    status === 'voting' ||
    status === 'tie_break' ||
    status === 'finished'
  ) {
    return status === 'playing' ? 'discussion' : status;
  }

  return 'waiting';
}

function shuffleArray<T>(items: T[]) {
  const shuffledItems = [...items];

  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));

    [shuffledItems[index], shuffledItems[randomIndex]] = [
      shuffledItems[randomIndex],
      shuffledItems[index],
    ];
  }

  return shuffledItems;
}

function pickRandomItem<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function getPlayerLabel(index: number) {
  return `Player ${index + 1}`;
}

function clampImposterCount(imposterCount: number, playerCount: number) {
  return Math.max(1, Math.min(Math.floor(imposterCount), Math.max(1, playerCount - 1)));
}

function parseImposterCount(rawValue: unknown) {
  if (typeof rawValue !== 'number' || !Number.isFinite(rawValue)) {
    return undefined;
  }

  return Math.max(1, Math.floor(rawValue));
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

  return {
    selectedPack,
    selectedPair: pickRandomItem(availablePairs),
  };
}

function optionButtonStyles(isActive: boolean) {
  return [
    'rounded-3xl border px-4 py-4 text-sm font-semibold tracking-wide',
    isActive
      ? 'border-emerald-400 bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/20'
      : 'border-white/10 bg-slate-950/45 text-slate-200 hover:border-white/20 hover:bg-slate-900',
  ].join(' ');
}

function isTopicPack(value: unknown): value is TopicPack {
  return topicPacks.includes(value as TopicPack);
}

function isPremiumTopicPack(topicPack: TopicPack) {
  return premiumTopicPacks.includes(topicPack);
}

function isDifficulty(value: unknown): value is Difficulty {
  return difficulties.includes(value as Difficulty);
}

function parseWordPair(rawValue: unknown): WordPair | null {
  if (!rawValue || typeof rawValue !== 'object') {
    return null;
  }

  const value = rawValue as Record<string, unknown>;

  if (
    typeof value.civilian !== 'string' ||
    typeof value.imposter !== 'string' ||
    (value.type !== 'concrete' && value.type !== 'abstract')
  ) {
    return null;
  }

  return {
    civilian: value.civilian,
    imposter: value.imposter,
    type: value.type,
  };
}

function parseVotes(rawVotes: unknown) {
  if (!rawVotes || typeof rawVotes !== 'object' || Array.isArray(rawVotes)) {
    return {} as VoteRecord;
  }

  return Object.fromEntries(
    Object.entries(rawVotes as Record<string, unknown>).filter(
      ([voterId, targetId]) =>
        voterId.length > 0 && (typeof targetId === 'string' || targetId === null),
    ),
  ) as VoteRecord;
}

function parseTally(rawTally: unknown) {
  if (!rawTally || typeof rawTally !== 'object' || Array.isArray(rawTally)) {
    return {} as Record<string, number>;
  }

  return Object.fromEntries(
    Object.entries(rawTally as Record<string, unknown>).filter(
      ([playerId, votes]) => playerId.length > 0 && typeof votes === 'number',
    ),
  ) as Record<string, number>;
}

function parseResolution(rawResolution: unknown): GameResolution | null {
  if (!rawResolution || typeof rawResolution !== 'object') {
    return null;
  }

  const resolution = rawResolution as Record<string, unknown>;

  if (
    typeof resolution.eliminatedPlayerId !== 'string' ||
    typeof resolution.civiliansWon !== 'boolean'
  ) {
    return null;
  }

  return {
    eliminatedPlayerId: resolution.eliminatedPlayerId,
    civiliansWon: resolution.civiliansWon,
    tally: parseTally(resolution.tally),
  };
}

function parseAnnouncement(rawAnnouncement: unknown): GameAnnouncement | null {
  if (!rawAnnouncement || typeof rawAnnouncement !== 'object') {
    return null;
  }

  const announcement = rawAnnouncement as Record<string, unknown>;

  if (typeof announcement.id !== 'string' || typeof announcement.message !== 'string') {
    return null;
  }

  return {
    id: announcement.id,
    message: announcement.message,
  };
}

function parseVoteEndsAt(rawVoteEndsAt: unknown) {
  if (typeof rawVoteEndsAt !== 'string') {
    return undefined;
  }

  return Number.isFinite(Date.parse(rawVoteEndsAt)) ? rawVoteEndsAt : undefined;
}

function parseGameData(rawGameData: unknown): GameData {
  if (!rawGameData || typeof rawGameData !== 'object' || Array.isArray(rawGameData)) {
    return {};
  }

  const gameData = rawGameData as Record<string, unknown>;

  return {
    roundNumber:
      typeof gameData.roundNumber === 'number' && Number.isFinite(gameData.roundNumber)
        ? gameData.roundNumber
        : undefined,
    tieBreakCount:
      typeof gameData.tieBreakCount === 'number' && Number.isFinite(gameData.tieBreakCount)
        ? gameData.tieBreakCount
        : undefined,
    topicPack: isTopicPack(gameData.topicPack) ? gameData.topicPack : undefined,
    difficulty: isDifficulty(gameData.difficulty) ? gameData.difficulty : undefined,
    imposterCount: parseImposterCount(gameData.imposterCount),
    packName: typeof gameData.packName === 'string' ? gameData.packName : undefined,
    packId: typeof gameData.packId === 'string' ? gameData.packId : undefined,
    selectedPair:
      'selectedPair' in gameData ? parseWordPair(gameData.selectedPair) : undefined,
    votes: parseVotes(gameData.votes),
    candidates: Array.isArray(gameData.candidates)
      ? gameData.candidates.filter((candidate): candidate is string => typeof candidate === 'string')
      : undefined,
    voteEndsAt: 'voteEndsAt' in gameData ? parseVoteEndsAt(gameData.voteEndsAt) : undefined,
    announcement:
      'announcement' in gameData ? parseAnnouncement(gameData.announcement) : undefined,
    resolution: 'resolution' in gameData ? parseResolution(gameData.resolution) : undefined,
  };
}

function parseRoomPlayers(rawPlayers: unknown) {
  if (!Array.isArray(rawPlayers)) {
    return [];
  }

  return rawPlayers.map((rawPlayer, index) => {
    const player = rawPlayer as Record<string, unknown>;
    const rawRole = player.role;

    return {
      id:
        typeof player.id === 'string' && player.id.length > 0
          ? player.id
          : `player-${index + 1}`,
      name:
        typeof player.name === 'string' && player.name.length > 0
          ? getPlayerLabel(index)
          : getPlayerLabel(index),
      isHost: Boolean(player.isHost),
      isReady: player.isReady === false ? false : true,
      isAlive: player.isAlive === false ? false : true,
      hasVoted: Boolean(player.hasVoted),
      role: rawRole === 'Civilian' || rawRole === 'Imposter' ? rawRole : null,
      word: typeof player.word === 'string' ? player.word : null,
    } satisfies RoomPlayer;
  });
}

function resetPlayersForNextStage(players: RoomPlayer[]) {
  return players.map((player) => ({
    ...player,
    hasVoted: false,
  }));
}

function resetPlayersForNewRound(players: RoomPlayer[]) {
  return players.map((player) => ({
    ...player,
    name: player.name,
    isAlive: true,
    hasVoted: false,
    role: null,
    word: null,
  }));
}

function getAlivePlayers(players: RoomPlayer[]) {
  return players.filter((player) => player.isAlive);
}

function getVotingCandidates(roomData: RoomData) {
  const alivePlayers = getAlivePlayers(roomData.players);

  if (roomData.status !== 'tie_break') {
    return alivePlayers;
  }

  const candidateIds = new Set(roomData.gameData.candidates ?? []);

  return alivePlayers.filter((player) => candidateIds.has(player.id));
}

function getValidVotes(roomData: RoomData) {
  const aliveVoterIds = new Set(getAlivePlayers(roomData.players).map((player) => player.id));
  const eligibleTargetIds = new Set(getVotingCandidates(roomData).map((player) => player.id));

  return Object.fromEntries(
    Object.entries(roomData.gameData.votes ?? {}).filter(
      ([voterId, targetId]) =>
        aliveVoterIds.has(voterId) &&
        (targetId === null || (typeof targetId === 'string' && eligibleTargetIds.has(targetId))),
    ),
  ) as VoteRecord;
}

function getVoteRoundKey(roomData: RoomData) {
  const voteEntries = Object.entries(getValidVotes(roomData)).sort(([leftId], [rightId]) =>
    leftId.localeCompare(rightId),
  );

  return [
    roomData.roomCode,
    roomData.status,
    roomData.gameData.roundNumber ?? 1,
    roomData.gameData.tieBreakCount ?? 0,
    roomData.gameData.voteEndsAt ?? 'no-deadline',
    voteEntries
      .map(([voterId, targetId]) => `${voterId}:${targetId ?? 'abstain'}`)
      .join('|'),
  ].join(':');
}

function getPlayerNameById(players: RoomPlayer[], playerId: string) {
  const playerIndex = players.findIndex((player) => player.id === playerId);

  return playerIndex >= 0 ? getPlayerLabel(playerIndex) : 'Player';
}

function roomDataFromRow(row: RoomRow, fallback?: RoomData | null): RoomData {
  const players = parseRoomPlayers(row.players);
  const gameData = parseGameData(row.game_data);
  const topicPack = gameData.topicPack ?? fallback?.topicPack ?? DEFAULT_TOPIC_PACK;
  const fallbackPack = getPack(topicPack);
  const imposterCountFromPlayers = players.filter((player) => player.role === 'Imposter').length;
  const rowImposterCount = parseImposterCount(row.imposter_count);

  return {
    roomCode:
      typeof row.room_code === 'string' && row.room_code.length > 0
        ? row.room_code
        : fallback?.roomCode ?? '',
    status: normalizeRoomStatus(
      typeof row.status === 'string' || row.status === null ? row.status : undefined,
    ),
    topicPack,
    packId:
      gameData.packId ??
      fallback?.packId ??
      fallbackPack?.id ??
      packIdByTopicPack[DEFAULT_TOPIC_PACK],
    packName: gameData.packName ?? fallback?.packName ?? fallbackPack?.name ?? DEFAULT_TOPIC_PACK,
    difficulty: gameData.difficulty ?? fallback?.difficulty ?? DEFAULT_DIFFICULTY,
    selectedPair:
      gameData.selectedPair !== undefined ? gameData.selectedPair : fallback?.selectedPair ?? null,
    players,
    imposterCount:
      gameData.imposterCount ??
      rowImposterCount ??
      (imposterCountFromPlayers > 0
        ? imposterCountFromPlayers
        : fallback?.imposterCount ?? 1),
    gameData: {
      roundNumber: gameData.roundNumber ?? fallback?.gameData.roundNumber ?? 1,
      tieBreakCount: gameData.tieBreakCount ?? fallback?.gameData.tieBreakCount ?? 0,
      topicPack,
      difficulty: gameData.difficulty ?? fallback?.difficulty ?? DEFAULT_DIFFICULTY,
      imposterCount:
        gameData.imposterCount ?? rowImposterCount ?? fallback?.gameData.imposterCount ?? 1,
      packName: gameData.packName ?? fallback?.packName ?? fallbackPack?.name ?? DEFAULT_TOPIC_PACK,
      packId:
        gameData.packId ??
        fallback?.packId ??
        fallbackPack?.id ??
        packIdByTopicPack[DEFAULT_TOPIC_PACK],
      selectedPair:
        gameData.selectedPair !== undefined ? gameData.selectedPair : fallback?.selectedPair ?? null,
      votes: gameData.votes ?? fallback?.gameData.votes ?? {},
      candidates: gameData.candidates ?? fallback?.gameData.candidates ?? [],
      voteEndsAt:
        gameData.voteEndsAt !== undefined ? gameData.voteEndsAt : fallback?.gameData.voteEndsAt ?? null,
      announcement:
        gameData.announcement !== undefined
          ? gameData.announcement
          : fallback?.gameData.announcement ?? null,
      resolution:
        gameData.resolution !== undefined ? gameData.resolution : fallback?.gameData.resolution ?? null,
    },
  };
}

function buildRoomSignature(roomData: RoomData | null) {
  if (!roomData) {
    return 'no-room';
  }

  return JSON.stringify({
    roomCode: roomData.roomCode,
    status: roomData.status,
    topicPack: roomData.topicPack,
    packId: roomData.packId,
    packName: roomData.packName,
    difficulty: roomData.difficulty,
    selectedPair: roomData.selectedPair,
    imposterCount: roomData.imposterCount,
    players: roomData.players,
    gameData: roomData.gameData,
  });
}

function activateRoom(roomData: RoomData): RoomData | null {
  const nextSelection = pickWordPair(roomData.topicPack, roomData.difficulty);

  if (!nextSelection) {
    return null;
  }

  const imposterCount = clampImposterCount(roomData.imposterCount, roomData.players.length);
  const imposterIds = new Set(
    shuffleArray(roomData.players.map((player) => player.id)).slice(0, imposterCount),
  );
  const nextPlayers: RoomPlayer[] = roomData.players.map((player) => {
    const isImposter = imposterIds.has(player.id);

    return {
      ...player,
      isAlive: true,
      hasVoted: false,
      role: isImposter ? 'Imposter' : 'Civilian',
      word: isImposter
        ? nextSelection.selectedPair.imposter
        : nextSelection.selectedPair.civilian,
    };
  });

  return {
    ...roomData,
    status: 'discussion',
    imposterCount,
    packId: nextSelection.selectedPack.id,
    packName: nextSelection.selectedPack.name,
    selectedPair: nextSelection.selectedPair,
    players: nextPlayers,
    gameData: {
      roundNumber: roomData.gameData.roundNumber ?? 1,
      tieBreakCount: 0,
      topicPack: roomData.topicPack,
      difficulty: roomData.difficulty,
      imposterCount,
      packName: nextSelection.selectedPack.name,
      packId: nextSelection.selectedPack.id,
      selectedPair: nextSelection.selectedPair,
      votes: {},
      candidates: [],
      voteEndsAt: null,
      announcement: null,
      resolution: null,
    },
  };
}

async function createUniqueRoomRecord(players: RoomPlayer[]) {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const roomCode = generateNumericRoomCode();
    const { error } = await supabase.from('rooms').insert({
      room_code: roomCode,
      status: 'waiting',
      imposter_count: 1,
      created_at: new Date().toISOString(),
      players,
      game_data: {
        roundNumber: 1,
        tieBreakCount: 0,
        topicPack: DEFAULT_TOPIC_PACK,
        difficulty: DEFAULT_DIFFICULTY,
        imposterCount: 1,
        packName: DEFAULT_TOPIC_PACK,
        packId: packIdByTopicPack[DEFAULT_TOPIC_PACK],
        votes: {},
        candidates: [],
        voteEndsAt: null,
        announcement: null,
        resolution: null,
      },
    });

    if (!error) {
      return roomCode;
    }

    if (error.code === '23505' || error.message.toLowerCase().includes('duplicate')) {
      continue;
    }

    throw new Error(error.message);
  }

  throw new Error('Unable to create a unique 4-digit room code.');
}

export function ImposterGamePanel({
  entryLayout = 'standalone',
  onScreenChange,
  onRequestSignIn,
  user = null,
  isLoginModalOpen = false,
}: ImposterGamePanelProps) {
  const [screen, setScreen] = useState<Screen>('entry');
  const [deviceRole, setDeviceRole] = useState<DeviceRole | null>(null);
  const [joinCode, setJoinCode] = useState('');
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [countdownNowMs, setCountdownNowMs] = useState(() => Date.now());
  const [localPlayer, setLocalPlayer] = useState<LocalPlayer | null>(null);
  const [isPeeking, setIsPeeking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [announcementMessage, setAnnouncementMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const roomDataRef = useRef<RoomData | null>(null);
  const roomSignatureRef = useRef(buildRoomSignature(null));
  const announcementTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const announcementIdRef = useRef<string | null>(null);
  const autoFinalizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoFinalizeKeyRef = useRef<string | null>(null);
  const autoAbstainKeyRef = useRef<string | null>(null);
  const hasUnlockedPremiumPacks = Boolean(user);

  const localPlayerState =
    roomData?.players.find((player) => player.id === localPlayer?.id) ?? null;
  const currentPlayerCount = roomData?.players.length ?? 0;
  const alivePlayers = roomData ? getAlivePlayers(roomData.players) : [];
  const alivePlayerCount = alivePlayers.length;
  const currentImposterCount = roomData?.imposterCount ?? 1;
  const canStartLobby = currentPlayerCount >= 3 && currentImposterCount < currentPlayerCount;
  const currentVotes = roomData ? getValidVotes(roomData) : {};
  const votesReceived = Object.keys(currentVotes).length;
  const currentVoteTargetId = localPlayer ? currentVotes[localPlayer.id] ?? null : null;
  const hasCurrentPlayerVoted = Boolean(localPlayerState?.isAlive && localPlayerState.hasVoted);
  const allVotesIn =
    roomData?.status === 'voting' && alivePlayerCount > 0 && votesReceived === alivePlayerCount;
  const currentResolution = roomData?.gameData.resolution ?? null;
  const eliminatedPlayer = currentResolution
    ? roomData?.players.find((player) => player.id === currentResolution.eliminatedPlayerId) ?? null
    : null;
  const votingPlayers = roomData?.players ?? [];
  const currentRoundNumber = roomData?.gameData.roundNumber ?? 1;
  const votingPhaseLabel = `Round ${currentRoundNumber}`;
  const verdictTitle = currentResolution?.civiliansWon
    ? 'Imposter Defeated! Civilians Win'
    : 'Civilian Eliminated! Imposter Wins';
  const currentVoteEndsAtMs = roomData?.gameData.voteEndsAt
    ? Date.parse(roomData.gameData.voteEndsAt)
    : Number.NaN;
  const hasVotingDeadline = Number.isFinite(currentVoteEndsAtMs);
  const votingTimeRemainingMs =
    roomData?.status === 'voting' && hasVotingDeadline
      ? Math.max(0, currentVoteEndsAtMs - countdownNowMs)
      : VOTING_DURATION_MS;
  const votingSecondsRemaining =
    roomData?.status === 'voting' && hasVotingDeadline
      ? Math.max(0, Math.ceil(votingTimeRemainingMs / 1000))
      : Math.ceil(VOTING_DURATION_MS / 1000);
  const votingProgressPercent =
    roomData?.status === 'voting' && hasVotingDeadline
      ? Math.max(0, Math.min(100, (votingTimeRemainingMs / VOTING_DURATION_MS) * 100))
      : 100;
  const isVotingTimerExpired = roomData?.status === 'voting' && votingTimeRemainingMs === 0;
  const isEntryScreen = screen === 'entry';
  const isEmbeddedEntry = isEntryScreen && entryLayout === 'embedded';
  const isIdentityVisible = Boolean(localPlayerState?.isAlive && isPeeking);
  const getDisplayedPlayerName = (player: RoomPlayer) => {
    const playerIndex = roomData?.players.findIndex((entry) => entry.id === player.id) ?? -1;
    const baseName = playerIndex >= 0 ? getPlayerLabel(playerIndex) : 'Player';

    if (player.isHost) {
      return player.id === localPlayer?.id ? 'Host (You)' : `${baseName} (Host)`;
    }

    if (player.id === localPlayer?.id) {
      return `${baseName} (You)`;
    }

    return baseName;
  };

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

  const commitRoomData = (nextRoomData: RoomData | null) => {
    const nextSignature = buildRoomSignature(nextRoomData);

    roomDataRef.current = nextRoomData;
    roomSignatureRef.current = nextSignature;

    setRoomData((currentRoomData) => {
      if (buildRoomSignature(currentRoomData) === nextSignature) {
        return currentRoomData;
      }

      return nextRoomData;
    });
  };

  useEffect(() => {
    roomDataRef.current = roomData;
    roomSignatureRef.current = buildRoomSignature(roomData);
  }, [roomData]);

  useEffect(() => {
    onScreenChange?.(screen);
  }, [onScreenChange, screen]);

  useEffect(() => {
    if (screen !== 'identity' || !localPlayerState?.isAlive) {
      setIsPeeking(false);
    }
  }, [localPlayerState?.id, localPlayerState?.isAlive, localPlayerState?.word, screen]);

  useEffect(() => {
    if (
      deviceRole !== 'host' ||
      !roomData ||
      roomData.status !== 'waiting' ||
      hasUnlockedPremiumPacks ||
      !isPremiumTopicPack(roomData.topicPack)
    ) {
      return;
    }

    void updateTopicPack(DEFAULT_TOPIC_PACK);
  }, [deviceRole, hasUnlockedPremiumPacks, roomData?.status, roomData?.topicPack]);

  useEffect(() => {
    if (roomData?.status !== 'voting' || !hasVotingDeadline) {
      setCountdownNowMs(Date.now());
      return;
    }

    setCountdownNowMs(Date.now());

    const intervalId = window.setInterval(() => {
      setCountdownNowMs(Date.now());
    }, COUNTDOWN_TICK_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [hasVotingDeadline, roomData?.gameData.voteEndsAt, roomData?.status]);

  useEffect(() => {
    return () => {
      if (announcementTimerRef.current) {
        clearTimeout(announcementTimerRef.current);
      }

      if (autoFinalizeTimerRef.current) {
        clearTimeout(autoFinalizeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!roomData?.roomCode) {
      setIsSubscribed(false);
      return;
    }

    const roomCode = roomData.roomCode;
    const channel = supabase.channel(`room-db:${roomCode}`);

    channelRef.current = channel;
    setIsSubscribed(false);

    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'rooms',
        filter: `room_code=eq.${roomCode}`,
      },
      (payload) => {
        const nextRow = payload.new as RoomRow;

        if (!nextRow || !nextRow.room_code) {
          return;
        }

        const nextRoomData = roomDataFromRow(nextRow, roomDataRef.current);
        commitRoomData(nextRoomData);
      },
    );

    channel.subscribe(async (status) => {
      if (status !== 'SUBSCRIBED') {
        return;
      }

      setIsSubscribed(true);

      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('room_code', roomCode)
        .maybeSingle();

      if (error || !data) {
        return;
      }

      const nextRoomData = roomDataFromRow(data as RoomRow, roomDataRef.current);
      commitRoomData(nextRoomData);
    });

    return () => {
      setIsSubscribed(false);
      void channel.unsubscribe();

      if (channelRef.current === channel) {
        channelRef.current = null;
      }
    };
  }, [roomData?.roomCode]);

  useEffect(() => {
    if (!roomData) {
      return;
    }

    if (roomData.status === 'waiting') {
      setIsPeeking(false);
      setScreen('lobby');
      return;
    }

    if (
      (roomData.status === 'discussion' || roomData.status === 'playing') &&
      localPlayerState?.role &&
      localPlayerState.word
    ) {
      setIsPeeking(false);
      setScreen('identity');
      return;
    }

    if (roomData.status === 'voting') {
      setIsPeeking(false);
      setScreen('voting');
      return;
    }

    if (roomData.status === 'finished' && currentResolution) {
      setIsPeeking(false);
      setScreen('resolution');
    }
  }, [
    currentResolution,
    localPlayerState?.role,
    localPlayerState?.word,
    roomData?.status,
  ]);

  useEffect(() => {
    const announcement = roomData?.gameData.announcement;

    if (!announcement) {
      return;
    }

    if (announcement.id === announcementIdRef.current) {
      return;
    }

    announcementIdRef.current = announcement.id;
    setAnnouncementMessage(announcement.message);

    if (announcementTimerRef.current) {
      clearTimeout(announcementTimerRef.current);
    }

    announcementTimerRef.current = setTimeout(() => {
      setAnnouncementMessage(null);
      announcementTimerRef.current = null;
    }, 2200);
  }, [roomData?.gameData.announcement]);

  useEffect(() => {
    const shouldScheduleAutoFinalize =
      Boolean(localPlayer?.isHost) &&
      Boolean(roomData) &&
      roomData?.status === 'voting' &&
      allVotesIn;

    if (!shouldScheduleAutoFinalize || !roomData) {
      if (autoFinalizeTimerRef.current) {
        clearTimeout(autoFinalizeTimerRef.current);
        autoFinalizeTimerRef.current = null;
      }

      autoFinalizeKeyRef.current = null;
      return;
    }

    const nextAutoFinalizeKey = getVoteRoundKey(roomData);

    if (
      autoFinalizeKeyRef.current === nextAutoFinalizeKey &&
      autoFinalizeTimerRef.current
    ) {
      return;
    }

    if (autoFinalizeTimerRef.current) {
      clearTimeout(autoFinalizeTimerRef.current);
    }

    autoFinalizeKeyRef.current = nextAutoFinalizeKey;
    autoFinalizeTimerRef.current = setTimeout(() => {
      autoFinalizeTimerRef.current = null;
      void handleFinalizeResults(nextAutoFinalizeKey);
    }, 1500);
  }, [
    allVotesIn,
    currentRoundNumber,
    localPlayer?.isHost,
    roomData,
  ]);

  useEffect(() => {
    const shouldAutoAbstainMissingPlayers =
      Boolean(localPlayer?.isHost) &&
      Boolean(roomData) &&
      roomData?.status === 'voting' &&
      isVotingTimerExpired &&
      votesReceived < alivePlayerCount;

    if (!shouldAutoAbstainMissingPlayers || !roomData) {
      if (roomData?.status !== 'voting') {
        autoAbstainKeyRef.current = null;
      }

      return;
    }

    const autoAbstainKey = [
      roomData.roomCode,
      roomData.gameData.roundNumber ?? 1,
      roomData.gameData.voteEndsAt ?? 'no-deadline',
      votesReceived,
    ].join(':');

    if (autoAbstainKeyRef.current === autoAbstainKey) {
      return;
    }

    autoAbstainKeyRef.current = autoAbstainKey;
    void handleAutoAbstainMissingVotes(getVoteRoundKey(roomData));
  }, [
    alivePlayerCount,
    isVotingTimerExpired,
    localPlayer?.isHost,
    roomData,
    votesReceived,
  ]);

  const resetSession = () => {
    if (announcementTimerRef.current) {
      clearTimeout(announcementTimerRef.current);
      announcementTimerRef.current = null;
    }

    if (autoFinalizeTimerRef.current) {
      clearTimeout(autoFinalizeTimerRef.current);
      autoFinalizeTimerRef.current = null;
    }

    announcementIdRef.current = null;
    autoFinalizeKeyRef.current = null;
    autoAbstainKeyRef.current = null;
    commitRoomData(null);
    setScreen('entry');
    setDeviceRole(null);
    setJoinCode('');
    setLocalPlayer(null);
    setCountdownNowMs(Date.now());
    setIsPeeking(false);
    setIsSubmitting(false);
    setIsSubscribed(false);
    setAnnouncementMessage(null);
    setErrorMessage(null);
  };

  const handleStartParty = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const selectedPack = getPack(DEFAULT_TOPIC_PACK);

      if (!selectedPack) {
        throw new Error('Default topic pack is unavailable.');
      }

      const hostPlayer: LocalPlayer = {
        id: generatePlayerId(),
        name: getPlayerLabel(0),
        isHost: true,
      };
      const initialPlayers: RoomPlayer[] = [
        {
          id: hostPlayer.id,
          name: hostPlayer.name,
          isHost: true,
          isReady: true,
          isAlive: true,
          hasVoted: false,
          role: null,
          word: null,
        },
      ];
      const roomCode = await createUniqueRoomRecord(initialPlayers);

      setDeviceRole('host');
      setLocalPlayer(hostPlayer);
      commitRoomData({
        roomCode,
        status: 'waiting',
        topicPack: DEFAULT_TOPIC_PACK,
        packId: selectedPack.id,
        packName: selectedPack.name,
        difficulty: DEFAULT_DIFFICULTY,
        selectedPair: null,
        players: initialPlayers,
        imposterCount: 1,
        gameData: {
          roundNumber: 1,
          tieBreakCount: 0,
          topicPack: DEFAULT_TOPIC_PACK,
          difficulty: DEFAULT_DIFFICULTY,
          imposterCount: 1,
          packName: selectedPack.name,
          packId: selectedPack.id,
          selectedPair: null,
          votes: {},
          candidates: [],
          voteEndsAt: null,
          announcement: null,
          resolution: null,
        },
      });
      setJoinCode('');
      setScreen('lobby');
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to create the room right now.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinPortal = () => {
    setErrorMessage(null);
    setJoinCode('');
    setScreen('join');
  };

  const handleOfflinePassPlay = () => {
    if (announcementTimerRef.current) {
      clearTimeout(announcementTimerRef.current);
      announcementTimerRef.current = null;
    }

    if (autoFinalizeTimerRef.current) {
      clearTimeout(autoFinalizeTimerRef.current);
      autoFinalizeTimerRef.current = null;
    }

    announcementIdRef.current = null;
    autoFinalizeKeyRef.current = null;
    autoAbstainKeyRef.current = null;
    commitRoomData(null);
    setDeviceRole(null);
    setJoinCode('');
    setLocalPlayer(null);
    setIsPeeking(false);
    setIsSubmitting(false);
    setIsSubscribed(false);
    setAnnouncementMessage(null);
    setErrorMessage(null);
    setScreen('offline');
  };

  const handleKeypadPress = (value: string) => {
    setErrorMessage(null);

    if (value === 'clear') {
      setJoinCode('');
      return;
    }

    if (value === 'back') {
      setJoinCode((currentCode) => currentCode.slice(0, -1));
      return;
    }

    setJoinCode((currentCode) => {
      if (currentCode.length >= 4) {
        return currentCode;
      }

      return `${currentCode}${value}`;
    });
  };

  const handleJoinRoom = async () => {
    if (joinCode.length !== 4) {
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('room_code', joinCode)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      const roomRow = data as RoomRow | null;

      if (!roomRow) {
        throw new Error('That room code does not exist.');
      }

      const existingRoomData = roomDataFromRow(roomRow);

      if (existingRoomData.status !== 'waiting') {
        throw new Error('That room is already locked and in progress.');
      }

      const guestPlayer: LocalPlayer = {
        id: generatePlayerId(),
        name: getPlayerLabel(existingRoomData.players.length),
        isHost: false,
      };
      const nextPlayers = [
        ...existingRoomData.players,
        {
          id: guestPlayer.id,
          name: guestPlayer.name,
          isHost: false,
          isReady: true,
          isAlive: true,
          hasVoted: false,
          role: null,
          word: null,
        },
      ];
      const { error: updateError } = await supabase
        .from('rooms')
        .update({
          players: nextPlayers,
        })
        .eq('room_code', joinCode);

      if (updateError) {
        throw new Error(updateError.message);
      }

      setDeviceRole('guest');
      setLocalPlayer(guestPlayer);
      commitRoomData({
        ...existingRoomData,
        roomCode: joinCode,
        players: nextPlayers,
      });
      setScreen('lobby');
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to join that room right now.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHostStart = async () => {
    if (!roomData || !localPlayer?.isHost) {
      return;
    }

    setErrorMessage(null);

    try {
      const activatedRoom = activateRoom(roomData);

      if (!activatedRoom) {
        throw new Error('Unable to prepare the round.');
      }

      const previousRoomData = roomData;
      const optimisticSignature = buildRoomSignature(activatedRoom);

      commitRoomData(activatedRoom);
      setIsPeeking(false);
      setScreen('identity');

      void (async () => {
        const { error } = await supabase
          .from('rooms')
          .update({
            status: 'discussion',
            imposter_count: activatedRoom.imposterCount,
            players: activatedRoom.players,
            game_data: activatedRoom.gameData,
          })
          .eq('room_code', roomData.roomCode);

        if (!error) {
          return;
        }

        setErrorMessage(error.message);

        if (roomSignatureRef.current === optimisticSignature) {
          commitRoomData(previousRoomData);
          setScreen('lobby');
        }
      })();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to start the room right now.',
      );
    }
  };

  const handleStartVoting = async () => {
    if (!roomData || !localPlayer?.isHost) {
      return;
    }

    setErrorMessage(null);

    try {
      const voteEndsAt = new Date(Date.now() + VOTING_DURATION_MS).toISOString();
      const resetPlayers = resetPlayersForNextStage(roomData.players);
      const nextGameData: GameData = {
        ...roomData.gameData,
        tieBreakCount: 0,
        votes: {},
        candidates: [],
        voteEndsAt,
        announcement: null,
        resolution: null,
      };
      const nextRoomData: RoomData = {
        ...roomData,
        status: 'voting',
        players: resetPlayers,
        gameData: nextGameData,
      };
      const optimisticSignature = buildRoomSignature(nextRoomData);

      commitRoomData(nextRoomData);
      setScreen('voting');

      void (async () => {
        const { error } = await supabase
          .from('rooms')
          .update({
            status: 'voting',
            players: resetPlayers,
            game_data: nextGameData,
          })
          .eq('room_code', roomData.roomCode);

        if (!error) {
          return;
        }

        setErrorMessage(error.message);

        if (roomSignatureRef.current === optimisticSignature) {
          commitRoomData(roomData);
          setScreen('identity');
        }
      })();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to switch to voting right now.',
      );
    }
  };

  const handleSubmitVote = async (targetPlayerId: string | null) => {
    if (!roomData || !localPlayer || hasCurrentPlayerVoted) {
      return;
    }

    if (!localPlayerState?.isAlive) {
      return;
    }

    if (roomData.status !== 'voting' || isVotingTimerExpired) {
      return;
    }

    if (
      targetPlayerId !== null &&
      !roomData.players.some((player) => player.id === targetPlayerId && player.isAlive)
    ) {
      return;
    }

    setErrorMessage(null);

    try {
      const nextPlayers = roomData.players.map((player) =>
        player.id === localPlayer.id
          ? {
              ...player,
              hasVoted: true,
            }
          : player,
      );
      const nextVotes = {
        ...(roomData.gameData.votes ?? {}),
        [localPlayer.id]: targetPlayerId,
      };
      const nextGameData: GameData = {
        ...roomData.gameData,
        votes: nextVotes,
      };
      const nextRoomData: RoomData = {
        ...roomData,
        players: nextPlayers,
        gameData: nextGameData,
      };
      const optimisticSignature = buildRoomSignature(nextRoomData);

      commitRoomData(nextRoomData);

      void (async () => {
        const { error } = await supabase
          .from('rooms')
          .update({
            players: nextPlayers,
            game_data: nextGameData,
          })
          .eq('room_code', roomData.roomCode);

        if (!error) {
          return;
        }

        setErrorMessage(error.message);

        if (roomSignatureRef.current === optimisticSignature) {
          commitRoomData(roomData);
        }
      })();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to submit your vote right now.',
      );
    }
  };

  const handleAutoAbstainMissingVotes = async (expectedVoteRoundKey?: string) => {
    const currentRoomData = roomDataRef.current;

    if (!currentRoomData || !localPlayer?.isHost || currentRoomData.status !== 'voting') {
      return;
    }

    if (expectedVoteRoundKey && getVoteRoundKey(currentRoomData) !== expectedVoteRoundKey) {
      return;
    }

    const validVotes = getValidVotes(currentRoomData);
    const missingAlivePlayers = getAlivePlayers(currentRoomData.players).filter(
      (player) => !(player.id in validVotes),
    );

    if (missingAlivePlayers.length === 0) {
      return;
    }

    const nextPlayers = currentRoomData.players.map((player) =>
      missingAlivePlayers.some((missingPlayer) => missingPlayer.id === player.id)
        ? {
            ...player,
            hasVoted: true,
          }
        : player,
    );
    const nextVotes = missingAlivePlayers.reduce<VoteRecord>(
      (accumulator, player) => {
        accumulator[player.id] = null;
        return accumulator;
      },
      { ...validVotes },
    );
    const nextGameData: GameData = {
      ...currentRoomData.gameData,
      votes: nextVotes,
    };
    const nextRoomData: RoomData = {
      ...currentRoomData,
      players: nextPlayers,
      gameData: nextGameData,
    };
    const optimisticSignature = buildRoomSignature(nextRoomData);

    commitRoomData(nextRoomData);

    void (async () => {
      const { error } = await supabase
        .from('rooms')
        .update({
          players: nextPlayers,
          game_data: nextGameData,
        })
        .eq('room_code', currentRoomData.roomCode);

      if (!error) {
        return;
      }

      setErrorMessage(error.message);

      if (roomSignatureRef.current === optimisticSignature) {
        commitRoomData(currentRoomData);
      }
    })();
  };

  const handleFinalizeResults = async (expectedVoteRoundKey?: string) => {
    const currentRoomData = roomDataRef.current;

    if (!currentRoomData || !localPlayer?.isHost || currentRoomData.status !== 'voting') {
      return;
    }

    const validVotes = getValidVotes(currentRoomData);
    const alivePlayersInRound = getAlivePlayers(currentRoomData.players);

    if (
      alivePlayersInRound.length === 0 ||
      Object.keys(validVotes).length !== alivePlayersInRound.length
    ) {
      return;
    }

    if (expectedVoteRoundKey && getVoteRoundKey(currentRoomData) !== expectedVoteRoundKey) {
      return;
    }

    setErrorMessage(null);

    try {
      const tally = Object.values(validVotes).reduce<Record<string, number>>(
        (accumulator, targetId) => {
          if (typeof targetId === 'string') {
            accumulator[targetId] = (accumulator[targetId] ?? 0) + 1;
          }

          return accumulator;
        },
        {},
      );
      const eligiblePlayers = getVotingCandidates(currentRoomData);
      const highestVoteCount = eligiblePlayers.reduce(
        (currentHighest, player) => Math.max(currentHighest, tally[player.id] ?? 0),
        0,
      );
      const mostVotedPlayers = eligiblePlayers.filter(
        (player) => (tally[player.id] ?? 0) === highestVoteCount,
      );

      const noEliminationThisRound =
        highestVoteCount === 0 || mostVotedPlayers.length !== 1;

      if (noEliminationThisRound) {
        const resetPlayers = resetPlayersForNextStage(currentRoomData.players);
        const nextGameData: GameData = {
          ...currentRoomData.gameData,
          roundNumber: (currentRoomData.gameData.roundNumber ?? 1) + 1,
          tieBreakCount: 0,
          votes: {},
          candidates: [],
          voteEndsAt: null,
          announcement: null,
          resolution: null,
        };
        const nextRoomData: RoomData = {
          ...currentRoomData,
          status: 'discussion',
          players: resetPlayers,
          gameData: nextGameData,
        };
        const optimisticSignature = buildRoomSignature(nextRoomData);

        commitRoomData(nextRoomData);
        setScreen('identity');

        void (async () => {
          const { error } = await supabase
            .from('rooms')
            .update({
              status: 'discussion',
              players: resetPlayers,
              game_data: nextGameData,
            })
            .eq('room_code', currentRoomData.roomCode);

          if (!error) {
            return;
          }

          setErrorMessage(error.message);

          if (roomSignatureRef.current === optimisticSignature) {
            commitRoomData(currentRoomData);
            setScreen('voting');
          }
        })();
        return;
      }

      const eliminatedPlayerInRound = mostVotedPlayers[0];
      const nextPlayers = currentRoomData.players.map((player) =>
        player.id === eliminatedPlayerInRound.id
          ? {
              ...player,
              isAlive: false,
              hasVoted: false,
            }
          : {
              ...player,
              hasVoted: false,
            },
      );
      const aliveImposters = nextPlayers.filter(
        (player) => player.isAlive && player.role === 'Imposter',
      ).length;
      const aliveCivilians = nextPlayers.filter(
        (player) => player.isAlive && player.role === 'Civilian',
      ).length;
      const eliminationAnnouncement: GameAnnouncement = {
        id: crypto.randomUUID(),
        message: `${getPlayerNameById(currentRoomData.players, eliminatedPlayerInRound.id)} was eliminated.`,
      };
      const civiliansWon = aliveImposters === 0;
      const impostersWon = aliveImposters >= aliveCivilians;

      const nextGameData: GameData =
        civiliansWon || impostersWon
          ? {
              ...currentRoomData.gameData,
              votes: {},
              candidates: [],
              voteEndsAt: null,
              announcement: eliminationAnnouncement,
              resolution: {
                eliminatedPlayerId: eliminatedPlayerInRound.id,
                civiliansWon,
                tally,
              },
            }
          : {
              ...currentRoomData.gameData,
              roundNumber: (currentRoomData.gameData.roundNumber ?? 1) + 1,
              tieBreakCount: 0,
              votes: {},
              candidates: [],
              voteEndsAt: null,
              announcement: eliminationAnnouncement,
              resolution: null,
            };
      const nextRoomData: RoomData =
        civiliansWon || impostersWon
          ? {
              ...currentRoomData,
              status: 'finished',
              players: nextPlayers,
              gameData: nextGameData,
            }
          : {
              ...currentRoomData,
              status: 'discussion',
              players: nextPlayers,
              gameData: nextGameData,
            };
      const optimisticSignature = buildRoomSignature(nextRoomData);

      commitRoomData(nextRoomData);
      setScreen(civiliansWon || impostersWon ? 'resolution' : 'identity');

      void (async () => {
        const { error } = await supabase
          .from('rooms')
          .update({
            status: civiliansWon || impostersWon ? 'finished' : 'discussion',
            players: nextPlayers,
            game_data: nextGameData,
          })
          .eq('room_code', currentRoomData.roomCode);

        if (!error) {
          return;
        }

        setErrorMessage(error.message);

        if (roomSignatureRef.current === optimisticSignature) {
          commitRoomData(currentRoomData);
          setScreen(currentRoomData.status === 'finished' ? 'resolution' : 'voting');
        }
      })();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to finalize the round right now.',
      );
    }
  };

  const handlePlayAnotherRound = async () => {
    if (!roomData || !localPlayer?.isHost) {
      return;
    }

    setErrorMessage(null);

    try {
      const nextPlayers = resetPlayersForNewRound(roomData.players);
      const nextGameData: GameData = {
        ...roomData.gameData,
        roundNumber: (roomData.gameData.roundNumber ?? 1) + 1,
        tieBreakCount: 0,
        imposterCount: roomData.imposterCount,
        selectedPair: null,
        votes: {},
        candidates: [],
        voteEndsAt: null,
        announcement: null,
        resolution: null,
      };
      const nextRoomData: RoomData = {
        ...roomData,
        status: 'waiting',
        players: nextPlayers,
        selectedPair: null,
        gameData: nextGameData,
      };
      const optimisticSignature = buildRoomSignature(nextRoomData);

      commitRoomData(nextRoomData);
      setScreen('lobby');

      void (async () => {
        const { error } = await supabase
          .from('rooms')
          .update({
            status: 'waiting',
            imposter_count: roomData.imposterCount,
            players: nextPlayers,
            game_data: nextGameData,
          })
          .eq('room_code', roomData.roomCode);

        if (!error) {
          return;
        }

        setErrorMessage(error.message);

        if (roomSignatureRef.current === optimisticSignature) {
          commitRoomData(roomData);
          setScreen('resolution');
        }
      })();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to prepare the next round right now.',
      );
    }
  };

  const updateTopicPack = async (nextTopicPack: TopicPack) => {
    if (!roomData || roomData.status !== 'waiting') {
      return;
    }

    const selectedPack = getPack(nextTopicPack);

    if (!selectedPack) {
      return;
    }

    const nextGameData: GameData = {
      ...roomData.gameData,
      topicPack: nextTopicPack,
      packId: selectedPack.id,
      packName: selectedPack.name,
    };
    const nextRoomData: RoomData = {
      ...roomData,
      topicPack: nextTopicPack,
      packId: selectedPack.id,
      packName: selectedPack.name,
      gameData: nextGameData,
    };

    commitRoomData(nextRoomData);

    const { error } = await supabase
      .from('rooms')
      .update({
        game_data: nextGameData,
      })
      .eq('room_code', roomData.roomCode);

    if (error) {
      setErrorMessage(error.message);
    }
  };

  const updateDifficulty = async (nextDifficulty: Difficulty) => {
    if (!roomData || roomData.status !== 'waiting') {
      return;
    }

    const nextGameData: GameData = {
      ...roomData.gameData,
      difficulty: nextDifficulty,
    };
    const nextRoomData: RoomData = {
      ...roomData,
      difficulty: nextDifficulty,
      gameData: nextGameData,
    };

    commitRoomData(nextRoomData);

    const { error } = await supabase
      .from('rooms')
      .update({
        game_data: nextGameData,
      })
      .eq('room_code', roomData.roomCode);

    if (error) {
      setErrorMessage(error.message);
    }
  };

  const updateImposterCount = async (nextImposterCount: number) => {
    if (!roomData || roomData.status !== 'waiting') {
      return;
    }

    const clampedImposterCount = clampImposterCount(nextImposterCount, currentPlayerCount);
    const nextGameData: GameData = {
      ...roomData.gameData,
      imposterCount: clampedImposterCount,
    };
    const nextRoomData: RoomData = {
      ...roomData,
      imposterCount: clampedImposterCount,
      gameData: nextGameData,
    };

    commitRoomData(nextRoomData);

    const { error } = await supabase
      .from('rooms')
      .update({
        game_data: nextGameData,
      })
      .eq('room_code', roomData.roomCode);

    if (error) {
      setErrorMessage(error.message);
    }
  };

  const handleLockedPackClick = () => {
    if (onRequestSignIn) {
      onRequestSignIn();
      return;
    }

    setErrorMessage('Sign in with Google to unlock extra topic packs.');
  };

  return (
    <section
      className={
        isEmbeddedEntry
          ? 'w-full'
          : isEntryScreen
          ? 'mx-auto w-full max-w-md px-3 pb-6 pt-4 sm:px-4 sm:pb-8 sm:pt-6'
          : 'mx-auto flex min-h-[100svh] w-full max-w-md items-stretch px-3 py-3 sm:px-4 sm:py-4'
      }
    >
      <div
        className={
          isEmbeddedEntry
            ? 'w-full'
            : isEntryScreen
              ? 'flex min-h-[100svh] w-full flex-col'
            : 'flex min-h-full w-full flex-col rounded-[32px] border border-white/10 bg-[rgba(7,12,24,0.92)] p-4 shadow-[0_30px_80px_rgba(2,6,23,0.55)] backdrop-blur-xl sm:p-5'
        }
      >
        {screen !== 'offline' && announcementMessage && (
          <div className="mb-4 rounded-[24px] border border-amber-300/20 bg-amber-400/10 px-4 py-4 text-sm font-medium text-amber-100">
            {announcementMessage}
          </div>
        )}

        {screen !== 'offline' && errorMessage && (
          <div className="mb-4 rounded-[24px] border border-rose-400/20 bg-rose-500/10 px-4 py-4 text-sm font-medium text-rose-200">
            {errorMessage}
          </div>
        )}

        {screen === 'offline' && (
          <OfflinePassPlayPanel
            onBack={resetSession}
            onRequestSignIn={onRequestSignIn}
            user={user}
            isLoginModalOpen={isLoginModalOpen}
          />
        )}

        {screen === 'entry' && (
          <div className={isEmbeddedEntry ? 'w-full' : 'flex min-h-[calc(100svh-2rem)] flex-col gap-6'}>
            {!isEmbeddedEntry && (
              <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#39FF14]">
                  Online &amp; Offline Party Play
                </p>
                <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
                  <span className="text-[#39FF14]">Free Imposter Game Generator</span>
                  <span className="block text-3xl text-white sm:text-4xl">for Mobile Parties</span>
                </h1>
                <p className="mx-auto mt-4 max-w-[620px] text-lg leading-8 text-gray-300">
                  Use this Imposter Game Generator to create a room, reveal secret roles,
                  and start fast social deduction rounds on any phone. Play online with
                  friends or offline with one shared device.
                </p>
              </div>
            )}

            <div
              className={[
                'border shadow-[0_30px_80px_rgba(2,6,23,0.45)]',
                isEmbeddedEntry
                  ? 'mx-auto w-full max-w-[480px] rounded-[40px] border-white/10 bg-[#0B101B]/80 p-7 backdrop-blur-md md:p-8'
                  : 'rounded-[32px] border-white/10 bg-gray-900/80 p-4 backdrop-blur-xl sm:p-5',
              ].join(' ')}
            >
              <div className={isEmbeddedEntry ? 'space-y-4' : 'grid gap-4'}>
                <button
                  type="button"
                  className={[
                    isEmbeddedEntry
                      ? 'flex h-20 w-full items-center justify-between rounded-3xl bg-[#00D17F] px-6 text-left text-black shadow-lg shadow-emerald-950/20 hover:bg-[#0fe08c]'
                      : 'inline-flex min-h-[96px] w-full items-center justify-between rounded-[28px] border border-gray-800 bg-gray-900/80 p-6 text-left shadow-lg shadow-slate-950/20 hover:border-[#39FF14]/30 hover:bg-gray-900',
                    isSubmitting
                      ? 'cursor-wait opacity-80'
                      : '',
                  ].join(' ')}
                  onClick={handleStartParty}
                  disabled={isSubmitting}
                >
                  <div>
                    <p className={isEmbeddedEntry ? 'text-xl font-bold text-black' : 'text-2xl font-bold text-white'}>
                      Start a Party
                    </p>
                    <p
                      className={
                        isEmbeddedEntry
                          ? 'mt-1 text-sm font-medium text-black/70'
                          : 'mt-1 text-sm font-medium text-slate-400'
                      }
                    >
                      Create a live room and host the round.
                    </p>
                  </div>
                  <span
                    className={
                      isEmbeddedEntry
                        ? 'flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-[#00D17F]'
                        : 'flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#39FF14]/25 bg-[#39FF14]/10 text-[#39FF14]'
                    }
                  >
                    <Plus size={28} strokeWidth={2.5} />
                  </span>
                </button>

                <button
                  type="button"
                  className={[
                    isEmbeddedEntry
                      ? 'flex h-24 w-full items-center justify-between rounded-3xl border border-white/5 bg-[#161B26] px-6 text-left text-white shadow-lg shadow-slate-950/20 hover:border-white/10 hover:bg-[#1b2230]'
                      : 'inline-flex min-h-[96px] w-full items-center justify-between rounded-[28px] border border-gray-800 bg-gray-900/80 p-6 text-left shadow-lg shadow-slate-950/20 hover:border-[#39FF14]/30 hover:bg-gray-900',
                  ].join(' ')}
                  onClick={handleJoinPortal}
                >
                  <div>
                    <p className="text-2xl font-bold text-white">Join Friends</p>
                    <p className="mt-1 text-sm font-medium text-slate-400">
                      Enter a room code and join instantly.
                    </p>
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black/35 text-[#00D17F]">
                    <ArrowRight size={28} strokeWidth={2.5} />
                  </span>
                </button>

                <button
                  type="button"
                  className={[
                    isEmbeddedEntry
                      ? 'flex h-24 w-full items-center justify-between rounded-3xl border border-white/5 bg-[#161B26] px-6 text-left text-white shadow-lg shadow-slate-950/20 hover:border-white/10 hover:bg-[#1b2230]'
                      : 'inline-flex min-h-[88px] w-full items-center justify-between rounded-[28px] border border-gray-800 bg-gray-900/80 p-6 text-left shadow-lg shadow-slate-950/20 hover:border-[#39FF14]/30 hover:bg-gray-900',
                  ].join(' ')}
                  onClick={handleOfflinePassPlay}
                >
                  <div>
                    <p className="text-xl font-bold text-white">Pass &amp; Play Offline</p>
                    <p className="mt-1 text-sm font-medium text-slate-400">
                      Use one shared phone around the table.
                    </p>
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black/35 text-[#00D17F]">
                    <Gamepad2 size={28} strokeWidth={2.5} />
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {screen === 'join' && (
          <div className="flex min-h-[calc(100svh-1.5rem)] flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-300">
                  Join Friends
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
                  Enter the 4-digit room code
                </h2>
              </div>
              <button
                type="button"
                className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                onClick={resetSession}
              >
                Back
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }, (_, index) => (
                <div
                  key={`code-slot-${index}`}
                  className="flex h-20 items-center justify-center rounded-[24px] border border-white/10 bg-slate-950/60 text-4xl font-black tabular-nums text-white"
                >
                  {joinCode[index] ?? ''}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {keypadLayout.map((keyValue) => (
                <button
                  key={keyValue}
                  type="button"
                  className={[
                    'flex h-20 items-center justify-center rounded-[24px] border text-2xl font-black shadow-lg shadow-slate-950/20',
                    keyValue === 'clear' || keyValue === 'back'
                      ? 'border-white/10 bg-slate-900 text-slate-300 hover:bg-slate-800'
                      : 'border-white/10 bg-slate-950/60 text-white hover:bg-slate-900',
                  ].join(' ')}
                  onClick={() => handleKeypadPress(keyValue)}
                >
                  {keyValue === 'clear'
                    ? 'Clear'
                    : keyValue === 'back'
                      ? 'Delete'
                      : keyValue}
                </button>
              ))}
            </div>

            <button
              type="button"
              className={[
                'mt-auto inline-flex min-h-[88px] w-full items-center justify-center rounded-[28px] text-xl font-bold shadow-lg',
                joinCode.length === 4 && !isSubmitting
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-950/30 hover:bg-emerald-400'
                  : 'cursor-not-allowed bg-slate-800 text-slate-400 shadow-slate-950/20',
              ].join(' ')}
              onClick={handleJoinRoom}
              disabled={joinCode.length !== 4 || isSubmitting}
            >
              {isSubmitting ? 'Joining...' : 'Join Room'}
            </button>
          </div>
        )}

        {screen === 'lobby' && roomData && (
          <div className="flex min-h-[calc(100svh-1.5rem)] flex-col gap-5">
            <div className="rounded-[28px] border border-white/10 bg-slate-950/45 p-5 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
                Waiting Room
              </p>
              <p className="mt-3 text-sm text-slate-400">Share this code across the table</p>
              <div className="mx-auto mt-4 grid max-w-[min(100%,22rem)] grid-cols-4 gap-2 sm:gap-3">
                {Array.from({ length: 4 }, (_, index) => (
                  <div
                    key={`${roomData.roomCode}-${index}`}
                    className="flex min-w-0 items-center justify-center rounded-[22px] border border-white/10 bg-slate-950/80 px-2 py-4 shadow-[0_18px_50px_rgba(2,6,23,0.2)]"
                  >
                    <span className="block text-[clamp(2.5rem,11vw,4.5rem)] font-black leading-none tracking-[0.04em] text-white tabular-nums">
                      {roomData.roomCode[index] ?? '0'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 inline-flex rounded-full border border-white/10 bg-slate-900 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
                Round {currentRoundNumber}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Lobby
                  </p>
                  <p className="mt-2 text-base text-slate-300">
                    {currentPlayerCount} players connected
                  </p>
                </div>
                <div className="rounded-full border border-white/10 bg-slate-950 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
                  {currentImposterCount} {currentImposterCount === 1 ? 'Imposter' : 'Imposters'}
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {roomData.players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between gap-3 rounded-[24px] border border-white/10 bg-slate-950/60 px-4 py-4"
                  >
                    <div>
                      <p className="text-lg font-semibold text-white">{getDisplayedPlayerName(player)}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {player.isHost && (
                          <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
                            Host
                          </span>
                        )}
                        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                          Ready!
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Live
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {deviceRole === 'host' && (
              <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Party Setup
                  </p>
                  <span className="rounded-full border border-white/10 bg-slate-950 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                    {isSubscribed ? 'DB Live' : 'Connecting'}
                  </span>
                </div>

                <div>
                  <p className="mb-3 text-sm font-medium text-slate-400">Topic Pack</p>
                  <div className="grid grid-cols-2 gap-3">
                    {topicPacks.map((option) => (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={roomData.topicPack === option}
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
                            : optionButtonStyles(roomData.topicPack === option)
                        }
                        onClick={() =>
                          !hasUnlockedPremiumPacks && isPremiumTopicPack(option)
                            ? handleLockedPackClick()
                            : updateTopicPack(option)
                        }
                      >
                        {!hasUnlockedPremiumPacks && isPremiumTopicPack(option)
                          ? `${option} 🔒`
                          : option}
                      </button>
                    ))}
                  </div>
                </div>

                {!hasUnlockedPremiumPacks && (
                  <p className="mt-6 mb-2 text-sm text-slate-400">
                    Free to play now. Sign in with Google to unlock extra topic packs.
                  </p>
                )}

                <div className="mt-5">
                  <p className="mb-3 text-sm font-medium text-slate-400">Difficulty</p>
                  <div className="grid grid-cols-3 gap-3">
                    {difficulties.map((option) => (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={roomData.difficulty === option}
                        className={optionButtonStyles(roomData.difficulty === option)}
                        onClick={() => updateDifficulty(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <p className="mb-3 text-sm font-medium text-slate-400">Imposter Count</p>
                  <div className="flex items-center gap-3 rounded-[24px] border border-white/10 bg-slate-950/60 p-3">
                    <button
                      type="button"
                      className="flex h-14 w-14 items-center justify-center rounded-[18px] border border-white/10 bg-slate-900 text-3xl font-black text-white hover:bg-slate-800"
                      onClick={() => updateImposterCount(currentImposterCount - 1)}
                      disabled={currentImposterCount <= 1}
                    >
                      -
                    </button>
                    <div className="flex min-h-[56px] flex-1 items-center justify-center rounded-[18px] border border-white/10 bg-slate-900 px-4 text-2xl font-black text-white tabular-nums">
                      {currentImposterCount}
                    </div>
                    <button
                      type="button"
                      className="flex h-14 w-14 items-center justify-center rounded-[18px] border border-white/10 bg-slate-900 text-3xl font-black text-white hover:bg-slate-800"
                      onClick={() => updateImposterCount(currentImposterCount + 1)}
                      disabled={currentImposterCount >= Math.max(1, currentPlayerCount - 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}

            {deviceRole === 'guest' && (
              <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Room Sync
                </p>
                <div className="mt-4 rounded-[24px] border border-emerald-400/20 bg-emerald-500/10 px-4 py-4">
                  <p className="text-lg font-bold text-emerald-300">Ready!</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    This lobby is subscribed to the `rooms` table. Any change to the
                    `players` column updates this list instantly for everyone.
                  </p>
                </div>
              </div>
            )}

            <button
              type="button"
              className="rounded-[28px] border border-white/10 bg-slate-900 px-5 py-4 text-base font-semibold text-white hover:bg-slate-800"
              onClick={resetSession}
            >
              Leave Room
            </button>

            {deviceRole === 'host' && (
              <button
                type="button"
                className={[
                  'inline-flex min-h-[88px] w-full items-center justify-center rounded-[28px] text-xl font-bold shadow-lg',
                  canStartLobby && !isSubmitting
                    ? 'bg-emerald-500 text-slate-950 shadow-emerald-950/30 hover:bg-emerald-400'
                    : 'cursor-not-allowed bg-slate-800 text-slate-400 shadow-slate-950/20',
                ].join(' ')}
                onClick={handleHostStart}
                disabled={!canStartLobby || isSubmitting}
              >
                {isSubmitting ? 'Starting...' : 'Lock Room & Start'}
              </button>
            )}
          </div>
        )}

        {screen === 'identity' && roomData && localPlayerState && (
          <div className="flex min-h-[calc(100svh-1.5rem)] flex-col gap-5">
            <div className="rounded-[28px] border border-white/10 bg-slate-950/45 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
                {localPlayerState.isAlive ? 'Discussion Phase' : 'Spectator Mode'}
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
                {localPlayerState.isAlive
                  ? 'Hold to peek at your identity'
                  : 'You are out of this round'}
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-300">
                {localPlayerState.isAlive
                  ? 'Alive players can privately re-check their role and word before the next vote begins.'
                  : 'Stay here and watch the table. Dead players cannot peek, vote, or receive votes.'}
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                    {getDisplayedPlayerName(localPlayerState)}
                  </p>
                  <p className="mt-2 text-base text-slate-300">Room {roomData.roomCode}</p>
                </div>
                <div className="rounded-full border border-white/10 bg-slate-950 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
                  {localPlayerState.isAlive ? 'Private' : 'Spectating'}
                </div>
              </div>

              {localPlayerState.isAlive ? (
                <button
                  type="button"
                  aria-pressed={isIdentityVisible}
                  aria-label={
                    isIdentityVisible
                      ? 'Release to hide your private role and word'
                      : 'Press and hold to reveal your private role and word'
                  }
                  className="mt-5 flex min-h-[360px] w-full touch-none flex-col items-center justify-center rounded-[28px] border border-white/10 bg-slate-950/80 p-6 text-center"
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
                        isIdentityVisible && localPlayerState.role === 'Imposter'
                          ? 'bg-rose-500/15 text-rose-300'
                          : isIdentityVisible
                            ? 'bg-cyan-500/15 text-cyan-300'
                            : 'bg-white/5 text-slate-300',
                      ].join(' ')}
                    >
                      {isIdentityVisible ? localPlayerState.role ?? 'Confidential' : 'Identity Hidden'}
                    </div>
                    <p className="mt-8 text-sm uppercase tracking-[0.18em] text-slate-400">
                      {isIdentityVisible ? 'Assigned Word' : 'Secret Word'}
                    </p>
                    <p
                      className={[
                        'mt-4 text-5xl font-black leading-tight',
                        isIdentityVisible ? 'text-white' : 'text-slate-500',
                      ].join(' ')}
                    >
                      {isIdentityVisible ? localPlayerState.word ?? 'Confidential' : 'Press and Hold'}
                    </p>
                    <p className="mt-5 text-sm leading-6 text-slate-400">
                      {isIdentityVisible
                        ? 'Release immediately to hide your role before you pass the device.'
                        : 'Your role and word stay hidden until you keep pressing this card.'}
                    </p>
                  </div>

                  <div className="mt-8 rounded-full border border-white/10 bg-slate-900 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
                    {isIdentityVisible ? 'Release to Hide' : 'Hold to Peek'}
                  </div>
                </button>
              ) : (
                <div className="mt-5 flex min-h-[360px] w-full flex-col items-center justify-center rounded-[28px] border border-white/10 bg-slate-950/60 p-6 text-center">
                  <div className="rounded-full border border-white/10 bg-slate-900 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Spectator Mode
                  </div>
                  <p className="mt-8 text-4xl font-black tracking-tight text-white">
                    Discussion continues without you.
                  </p>
                  <p className="mt-4 max-w-sm text-base leading-7 text-slate-300">
                    Stay quiet, watch the round unfold, and wait for the host to open the next vote.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-auto rounded-[28px] border border-white/10 bg-slate-900/60 p-5">
              {localPlayer?.isHost ? (
                <>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Host Controls
                  </p>
                  <p className="mt-3 text-base leading-7 text-slate-300">
                    When the table finishes discussing, push every connected device into the timed vote.
                  </p>
                  <button
                    type="button"
                    className={[
                      'mt-5 inline-flex min-h-[80px] w-full items-center justify-center rounded-[28px] text-xl font-bold shadow-lg',
                      isSubmitting
                        ? 'cursor-wait bg-emerald-400 text-slate-950'
                        : 'bg-emerald-500 text-slate-950 shadow-emerald-950/30 hover:bg-emerald-400',
                    ].join(' ')}
                    onClick={handleStartVoting}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Switching...' : 'Start Voting'}
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                    {localPlayerState.isAlive ? 'Waiting for Host' : 'Round Locked'}
                  </p>
                  <p className="mt-3 text-base leading-7 text-slate-300">
                    {localPlayerState.isAlive
                      ? 'Stay on this private screen. As soon as the host starts voting, every connected device will move into the timed vote list.'
                      : 'You will stay in spectator mode while the alive players keep discussing and voting.'}
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {screen === 'voting' && roomData && localPlayer && (
          <div className="flex min-h-[calc(100svh-1.5rem)] flex-col gap-5">
            <div className="rounded-[28px] border border-white/10 bg-slate-950/45 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
                {!localPlayerState?.isAlive ? 'Spectator Mode' : 'Live Voting'}
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight text-white">
                {!localPlayerState?.isAlive ? 'Spectator Mode' : 'Who is the Imposter?'}
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-300">
                {!localPlayerState?.isAlive
                  ? 'You have been eliminated. Stay on this screen and watch the remaining players finish the round.'
                  : 'Tap one player name before the timer expires. If you do nothing, your vote becomes an abstain.'}
              </p>
              <div className="mt-4 inline-flex rounded-full border border-white/10 bg-slate-900 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
                {votingPhaseLabel}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Vote Timer
                </p>
                <span className="text-4xl font-black tabular-nums text-white">
                  {votingSecondsRemaining}s
                </span>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-950">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${votingProgressPercent}%` }}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {isVotingTimerExpired
                  ? 'Time is up. Any missing votes are automatically counted as abstain.'
                  : 'Voting closes automatically in 15 seconds.'}
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Vote Progress
                </p>
                <span className="rounded-full border border-white/10 bg-slate-950 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
                  {votesReceived} / {alivePlayerCount} Alive Players Have Voted
                </span>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-950">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{
                    width: `${alivePlayerCount === 0 ? 0 : (votesReceived / alivePlayerCount) * 100}%`,
                  }}
                />
              </div>

              {hasCurrentPlayerVoted && (
                <div className="mt-4 rounded-[24px] border border-emerald-400/20 bg-emerald-500/10 px-4 py-4">
                  <p className="text-lg font-bold text-emerald-300">
                    Vote Cast! Waiting for others...
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    {currentVoteTargetId === null ? (
                      <>You abstained from this vote.</>
                    ) : (
                      <>
                        You voted for{' '}
                        <span className="font-semibold text-white">
                          {roomData.players.find((player) => player.id === currentVoteTargetId)
                            ? getDisplayedPlayerName(
                                roomData.players.find(
                                  (player) => player.id === currentVoteTargetId,
                                )!,
                              )
                            : 'a player'}
                        </span>
                        .
                      </>
                    )}
                  </p>
                </div>
              )}
            </div>

            {!localPlayerState?.isAlive ? (
              <div className="mt-auto rounded-[28px] border border-white/10 bg-slate-900/60 p-6 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Spectator Mode
                </p>
                <p className="mt-4 text-3xl font-black tracking-tight text-white">
                  You are out for this game.
                </p>
                <p className="mt-3 text-base leading-7 text-slate-300">
                  Only alive players can vote now. Watch the round unfold and wait for
                  the final reveal.
                </p>
              </div>
            ) : (
              <div className="flex flex-1 flex-col gap-4">
                {votingPlayers.map((player) => {
                  const isSelected = currentVoteTargetId === player.id;
                  const isTargetAlive = player.isAlive;
                  const canVoteForPlayer =
                    isTargetAlive &&
                    !hasCurrentPlayerVoted &&
                    !isVotingTimerExpired &&
                    Boolean(localPlayerState?.isAlive);

                  return (
                    <button
                      key={player.id}
                      type="button"
                      className={[
                        'flex min-h-[92px] w-full items-center justify-between rounded-[28px] border px-6 text-left text-2xl font-bold shadow-lg',
                        !isTargetAlive
                          ? 'cursor-not-allowed border-white/10 bg-slate-950/40 text-slate-500 shadow-none'
                          : isSelected
                            ? 'border-emerald-400 bg-emerald-500 text-slate-950 shadow-emerald-950/20'
                            : 'border-white/10 bg-slate-900 text-white shadow-slate-950/20 hover:border-white/20 hover:bg-slate-800',
                      ].join(' ')}
                      onClick={() => handleSubmitVote(player.id)}
                      disabled={!canVoteForPlayer}
                    >
                      <span>{getDisplayedPlayerName(player)}</span>
                      <span className="text-base font-semibold uppercase tracking-[0.18em]">
                        {!isTargetAlive ? 'Eliminated' : isSelected ? 'Selected' : 'Vote'}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {screen === 'resolution' && roomData && currentResolution && eliminatedPlayer && (
          <div className="flex min-h-[calc(100svh-1.5rem)] flex-col gap-5">
            <div className="rounded-[28px] border border-white/10 bg-slate-950/45 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                Final Result
              </p>
              <div className="mt-3 inline-flex rounded-full border border-white/10 bg-slate-900 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
                Round {currentRoundNumber}
              </div>
              <h2
                className={[
                  'mt-4 text-4xl font-black tracking-tight',
                  currentResolution.civiliansWon ? 'text-emerald-300' : 'text-rose-300',
                ].join(' ')}
              >
                {verdictTitle}
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-300">
                The round resolved automatically as soon as the last valid vote landed.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                Eliminated Player
              </p>
              <p className="mt-3 text-3xl font-bold text-white">
                {getDisplayedPlayerName(eliminatedPlayer)}
              </p>
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
                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
                  Assigned Word
                </p>
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
                {roomData.players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between rounded-[24px] border border-white/10 bg-slate-950/60 px-4 py-4"
                  >
                    <div>
                      <p className="text-lg font-semibold text-white">
                        {getDisplayedPlayerName(player)}
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        {player.role} • {player.word}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-white">
                        {currentResolution.tally[player.id] ?? 0}
                      </p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {player.isAlive ? 'Alive' : 'Eliminated'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {localPlayer?.isHost && (
              <button
                type="button"
                className={[
                  'mt-auto inline-flex min-h-[88px] w-full items-center justify-center rounded-[28px] text-xl font-bold shadow-lg',
                  isSubmitting
                    ? 'cursor-wait bg-emerald-400 text-slate-950'
                    : 'bg-emerald-500 text-slate-950 shadow-emerald-950/30 hover:bg-emerald-400',
                ].join(' ')}
                onClick={handlePlayAnotherRound}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Preparing...' : 'Play Another Round'}
              </button>
            )}

            {!localPlayer?.isHost && (
              <div className="mt-auto rounded-[28px] border border-white/10 bg-slate-900/60 px-5 py-5 text-center text-base font-semibold text-slate-300">
                Waiting for the host to prepare the next round...
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
