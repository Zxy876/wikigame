export interface User {
  user_id: string;
  username: string;
  join_date: string;
  achievements: string[];
  stats: UserStats;
}

export interface UserStats {
  total_games: number;
  completed_games: number;
  total_score: number;
  average_path_length: number;
  total_path_length: number;
}

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  total_score: number;
  rank: number;
}
