export interface GameRequest {
  start: string;
  end: string;
  user_id?: string;
}

export interface GameResponse {
  game_id: string;
  status: string;
  path?: string[];
  message?: string;
  score?: number;
  achievements?: string[];
  start?: string;
  end?: string;
  search_time?: number;
}

export interface GameState {
  gameId: string;
  status: 'idle' | 'pending' | 'completed' | 'failed';
  path: string[];
  start: string;
  end: string;
  score: number;
  searchTime: number;
  message?: string;
}
