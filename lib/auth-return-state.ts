const AUTH_RETURN_STATE_STORAGE_KEY = 'imposter-game-generator:auth-return-state';
const AUTH_RETURN_STATE_TTL_MS = 30 * 60 * 1000;

type StoredAuthReturnStateBase = {
  savedAt: number;
};

export type StoredOnlineLobbyAuthReturnState = StoredAuthReturnStateBase & {
  kind: 'online-lobby';
  deviceRole: 'host' | 'guest';
  roomData: unknown;
  localPlayer: unknown;
};

export type StoredOfflineAuthReturnState = StoredAuthReturnStateBase & {
  kind: 'offline';
  topicPack: string;
  difficulty: string;
  playerCount: number;
  imposterCount: number;
};

export type StoredAuthReturnState =
  | StoredOnlineLobbyAuthReturnState
  | StoredOfflineAuthReturnState;

type StoredAuthReturnStateInput =
  | Omit<StoredOnlineLobbyAuthReturnState, 'savedAt'>
  | Omit<StoredOfflineAuthReturnState, 'savedAt'>;

function isBrowser() {
  return typeof window !== 'undefined';
}

export function getCurrentPath() {
  if (!isBrowser()) {
    return '/';
  }

  const { pathname, search, hash } = window.location;
  return `${pathname}${search}${hash}` || '/';
}

export function saveAuthReturnState(state: StoredAuthReturnStateInput) {
  if (!isBrowser()) {
    return;
  }

  const storedState = {
    ...state,
    savedAt: Date.now(),
  } as StoredAuthReturnState;

  window.localStorage.setItem(
    AUTH_RETURN_STATE_STORAGE_KEY,
    JSON.stringify(storedState),
  );
}

export function clearAuthReturnState() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(AUTH_RETURN_STATE_STORAGE_KEY);
}

export function readAuthReturnState(): StoredAuthReturnState | null {
  if (!isBrowser()) {
    return null;
  }

  const rawValue = window.localStorage.getItem(AUTH_RETURN_STATE_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<StoredAuthReturnState>;

    if (typeof parsedValue.savedAt !== 'number') {
      clearAuthReturnState();
      return null;
    }

    if (Date.now() - parsedValue.savedAt > AUTH_RETURN_STATE_TTL_MS) {
      clearAuthReturnState();
      return null;
    }

    if (
      parsedValue.kind === 'online-lobby' &&
      (parsedValue.deviceRole === 'host' || parsedValue.deviceRole === 'guest')
    ) {
      return parsedValue as StoredOnlineLobbyAuthReturnState;
    }

    if (
      parsedValue.kind === 'offline' &&
      typeof parsedValue.topicPack === 'string' &&
      typeof parsedValue.difficulty === 'string' &&
      typeof parsedValue.playerCount === 'number' &&
      typeof parsedValue.imposterCount === 'number'
    ) {
      return parsedValue as StoredOfflineAuthReturnState;
    }
  } catch {
    clearAuthReturnState();
    return null;
  }

  clearAuthReturnState();
  return null;
}
