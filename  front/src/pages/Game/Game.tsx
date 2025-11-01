import React, { useState, useEffect } from 'react'
import { useGame } from '../../hooks/useGame'
import { GameForm } from '../../components/game/GameForm/GameForm'
import { GameResult } from '../../components/game/GameResult/GameResult'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import styles from './Game.module.css'

interface GameProps {
  navigate?: (path: string) => void
}

const Game: React.FC<GameProps> = ({ navigate }) => {
  const [showResult, setShowResult] = useState(false)
  const { currentGame, loading, error, createGame, resetGame } = useGame()

  useEffect(() => {
    if (error) {
      alert(`错误: ${error}`)
    }
  }, [error])

  const handleGameStart = async (start: string, end: string) => {
    try {
      console.log('🎮 开始游戏:', { start, end })
      await createGame({ start, end })
      setShowResult(true)
      alert('路径搜索完成！')
    } catch (err) {
      console.error('游戏创建失败:', err)
    }
  }

  const handleNewGame = () => {
    setShowResult(false)
    resetGame()
    alert('开始新游戏！')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>🎮 Wiki Racer 游戏</h1>
        <p>在两个维基百科页面之间找到最短的点击路径</p>
      </div>

      {loading && (
        <div className={styles.loadingContainer}>
          <LoadingSpinner 
            size="large" 
            message="正在使用双向BFS算法搜索最短路径..." 
          />
          <p className={styles.loadingTip}>
            💡 提示：这可能需要几秒钟时间，请耐心等待...
          </p>
        </div>
      )}

      {!showResult && !loading && (
        <GameForm onGameStart={handleGameStart} loading={loading} />
      )}

      {showResult && currentGame && (
        <GameResult 
          game={currentGame} 
          onNewGame={handleNewGame}
        />
      )}

      {!loading && (
        <div className={styles.instructions}>
          <h3>🎯 游戏规则</h3>
          <ul>
            <li>输入两个维基百科页面的标题（英文）</li>
            <li>系统会使用智能算法寻找它们之间的最短路径</li>
            <li>路径越短，得分越高</li>
            <li>完成游戏可以解锁成就</li>
          </ul>
          
          <h3>📝 页面标题格式</h3>
          <ul>
            <li>使用下划线代替空格：<code>Artificial_intelligence</code></li>
            <li>保持大小写敏感</li>
            <li>特殊字符需要URL编码</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default Game
