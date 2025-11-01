export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  TIMEOUT: 10000,
};

export const GAME_CONFIG = {
  MAX_DEPTH: 6,
  MAX_SEARCH_TIME: 300,
};

export const ACHIEVEMENTS = {
  FIRST_WIN: 'first_win',
  SPEED_DEMON: 'speed_demon',
  LONG_JOURNEY: 'long_journey',
  SHORTCUT_MASTER: 'shortcut_master',
  EXPLORER: 'explorer',
  VETERAN: 'veteran',
  PERFECT_PATH: 'perfect_path',
};
