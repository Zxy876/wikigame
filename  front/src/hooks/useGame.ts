import { useState, useCallback } from 'react'
import { api } from '../services/api'
import { GameRequest, GameResponse } from '../types/game'

export const useGame = () => {
  const [currentGame, setCurrentGame] = useState<GameResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createGame = useCallback(async (request: GameRequest) => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('🔄 发送游戏请求:', request)
      const game = await api.post<GameResponse>('/api/game', request)
      console.log('✅ 游戏响应:', game)
      setCurrentGame(game)
      return game
    } catch (err: any) {
      console.error('❌ 创建游戏失败:', err)
      const errorMessage = err.message || '创建游戏失败'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createGameAsync = useCallback(async (request: GameRequest) => {
    setLoading(true)
    setError(null)
    
    try {
      const game = await api.post<GameResponse>('/api/game/async', request)
      setCurrentGame(game)
      return game
    } catch (err: any) {
      const errorMessage = err.message || '创建异步游戏失败'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const checkGameStatus = useCallback(async (gameId: string) => {
    try {
      const status = await api.get<GameResponse>(`/api/game/${gameId}`)
      setCurrentGame(status)
      return status
    } catch (err: any) {
      const errorMessage = err.message || '获取游戏状态失败'
      setError(errorMessage)
      throw err
    }
  }, [])

  const resetGame = useCallback(() => {
    setCurrentGame(null)
    setError(null)
    setLoading(false)
  }, [])

  return {
    currentGame,
    loading,
    error,
    createGame,
    createGameAsync,
    checkGameStatus,
    resetGame,
  }
}
