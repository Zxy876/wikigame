import { api } from './api';
import { UserStats, LeaderboardEntry } from '../types/user';

export const userService = {
  createUser: async (username: string): Promise<{ user_id: string; username: string }> => {
    const response = await api.post<{ user_id: string; username: string }>('/api/users', { username });
    return response;
  },

  getUserStats: async (userId: string): Promise<UserStats> => {
    const response = await api.get<UserStats>(`/api/users/${userId}`);
    return response;
  },

  getLeaderboard: async (limit: number = 10): Promise<{ leaderboard: LeaderboardEntry[] }> => {
    const response = await api.get<{ leaderboard: LeaderboardEntry[] }>(`/api/leaderboard?limit=${limit}`);
    return response;
  },

  getAchievements: async (): Promise<any> => {
    const response = await api.get('/api/achievements');
    return response;
  },
};
