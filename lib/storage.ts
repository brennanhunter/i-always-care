interface AppState {
  startDate: string;
  shownMessages: { [date: string]: number }; // date -> messageId
  claimedRewards: number[];
  redeemedRewards: number[]; // Track which rewards have been redeemed
  lastOpened: string;
  todayMessageId: number | null;
}

const STORAGE_KEY = 'iAlwaysCare';

export const getAppState = (): AppState | null => {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading app state:', error);
    return null;
  }
};

export const setAppState = (state: AppState): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving app state:', error);
  }
};

const getTodayDateKey = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

const isChristmas = (): boolean => {
  const now = new Date();
  return now.getMonth() === 11 && now.getDate() === 25; // December 25
};

const getRandomMessageId = (excludeIds: number[] = []): number => {
  const totalMessages = 45;
  const availableIds = Array.from({ length: totalMessages }, (_, i) => i + 1)
    .filter(id => !excludeIds.includes(id));
  
  if (availableIds.length === 0) {
    // All messages shown, start over
    return Math.floor(Math.random() * totalMessages) + 1;
  }
  
  return availableIds[Math.floor(Math.random() * availableIds.length)];
};

export const initializeApp = (): AppState => {
  const existing = getAppState();
  const todayKey = getTodayDateKey();
  
  if (existing) {
    // Ensure shownMessages exists (migration from old schema)
    if (!existing.shownMessages) {
      existing.shownMessages = {};
    }
    // Ensure redeemedRewards exists (migration)
    if (!existing.redeemedRewards) {
      existing.redeemedRewards = [];
    }
    
    // Check if today is Christmas - always show special message #1
    if (isChristmas()) {
      return {
        ...existing,
        todayMessageId: 1,
        lastOpened: new Date().toISOString(),
      };
    }
    
    // Check if we already have a message for today
    if (existing.shownMessages[todayKey]) {
      return {
        ...existing,
        todayMessageId: existing.shownMessages[todayKey],
        lastOpened: new Date().toISOString(),
      };
    }
    
    // Get recently shown messages (last 10 days) to avoid repetition
    const recentMessageIds = Object.values(existing.shownMessages).slice(-10);
    const newMessageId = getRandomMessageId(recentMessageIds);
    
    const updated: AppState = {
      ...existing,
      shownMessages: {
        ...existing.shownMessages,
        [todayKey]: newMessageId,
      },
      todayMessageId: newMessageId,
      lastOpened: new Date().toISOString(),
    };
    setAppState(updated);
    return updated;
  }
  
  // First time initialization - set start date to when you met
  // If it's Christmas, show the special message
  const firstMessageId = isChristmas() ? 1 : getRandomMessageId();
  const initialState: AppState = {
    startDate: '2015-10-07T00:00:00',
    redeemedRewards: [],
    shownMessages: {
      [todayKey]: firstMessageId,
    },
    claimedRewards: [],
    lastOpened: new Date().toISOString(),
    todayMessageId: firstMessageId,
  };
  setAppState(initialState);
  return initialState;
};

export const getDaysSinceStart = (startDate: string): number => {
  const start = new Date(startDate);
  const now = new Date();
  
  start.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  
  const diffTime = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays) + 1;
};

export const claimReward = (messageId: number): void => {
  const state = getAppState();
  if (!state) return;
  
  if (!state.claimedRewards.includes(messageId)) {
    state.claimedRewards.push(messageId);
    setAppState(state);
  }
};

export const isRewardClaimed = (messageId: number): boolean => {
  const state = getAppState();
  return state ? state.claimedRewards.includes(messageId) : false;
};

export const redeemReward = (messageId: number): void => {
  const state = getAppState();
  if (!state) return;
  
  if (!state.redeemedRewards) {
    state.redeemedRewards = [];
  }
  
  if (!state.redeemedRewards.includes(messageId)) {
    state.redeemedRewards.push(messageId);
    setAppState(state);
  }
};

export const isRewardRedeemed = (messageId: number): boolean => {
  const state = getAppState();
  return state && state.redeemedRewards ? state.redeemedRewards.includes(messageId) : false;
};

export const getUnredeemedRewards = (): number[] => {
  const state = getAppState();
  if (!state) return [];
  
  return state.claimedRewards.filter(id => !state.redeemedRewards?.includes(id));
};

export const getClaimedRewards = (): number[] => {
  const state = getAppState();
  return state ? state.claimedRewards : [];
};

export const resetApp = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};
