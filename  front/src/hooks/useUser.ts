import { useState, useCallback } from 'react'
import { api } from '../services/api'
import { User } from '../types/user'

export const useUser = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createUser = useCallback(async (username: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const userData = await api.post<{ user_id: string; username: string }>('/api/users', { username })
      
      const user: User = {
        user_id: userData.user_id,
        username: userData.username,
        join_date: new Date().toISOString(),
        achievements: [],
        stats: {
          total_games: 0,
          completed_games: 0,
          total_score: 0,
          average_path_length: 0.0,
          total_path_length: 0
        }
      }
      setCurrentUser(user)
      return user
    } catch (err: any) {
      const errorMessage = err.message || '创建用户失败'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getUserStats = useCallback(async (userId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const stats = await api.get(`/api/users/${userId}`)
      return stats
    } catch (err: any) {
      const errorMessage = err.message || '获取用户统计失败'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const clearUser = useCallback(() => {
    setCurrentUser(null)
    setError(null)
  }, [])

  return {
    currentUser,
    loading,
    error,
    createUser,
    getUserStats,
    clearUser,
  }
}
