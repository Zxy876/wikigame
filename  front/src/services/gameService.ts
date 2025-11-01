import { api } from './api';
import { GameRequest, GameResponse } from '../types/game';

export const gameService = {
  createGame: async (request: GameRequest): Promise<GameResponse> => {
    const response = await api.post<GameResponse>('/api/game', request);
    return response;
  },

  createGameAsync: async (request: GameRequest): Promise<GameResponse> => {
    const response = await api.post<GameResponse>('/api/game/async', request);
    return response;
  },

  getGameStatus: async (gameId: string): Promise<any> => {
    const response = await api.get(`/api/game/${gameId}`);
    return response;
  },

  testCrawl: async (pageTitle: string): Promise<any> => {
    const response = await api.get(`/test-crawl/${pageTitle}`);
    return response;
  },

  testPath: async (start: string, end: string): Promise<any> => {
    const response = await api.get(`/test-path/${start}/${end}`);
    return response;
  },
};
