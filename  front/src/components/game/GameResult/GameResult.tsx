import React from 'react'
import styles from './GameResult.module.css'

// 内联类型定义
interface GameResponse {
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

// 临时内联 formatScore 函数
const formatScore = (score: number): string => {
  return score.toLocaleString();
};

interface GameResultProps {
  game: GameResponse
  onNewGame: () => void
}

export const GameResult: React.FC<GameResultProps> = ({ game, onNewGame }) => {
  const hasPath = game.path && game.path.length > 0
  const pathLength = game.path ? game.path.length - 1 : 0
  const startPage = game.start || '未知起始页面'
  const endPage = game.end || '未知目标页面'

  const handleWikiLink = (pageTitle: string) => {
    window.open(`https://en.wikipedia.org/wiki/${pageTitle}`, '_blank')
  }

  return (
    <div className={styles.container}>
      <div className={styles.resultHeader}>
        <h2>🎯 搜索结果</h2>
        <div className={styles.gameInfo}>
          <span>从 <strong>{startPage}</strong> 到 <strong>{endPage}</strong></span>
        </div>
      </div>

      {hasPath ? (
        <div className={styles.successResult}>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statValue}>{pathLength}</div>
              <div className={styles.statLabel}>跳转次数</div>
            </div>
            {game.score && (
              <div className={styles.stat}>
                <div className={styles.statValue}>{formatScore(game.score)}</div>
                <div className={styles.statLabel}>得分</div>
              </div>
            )}
            <div className={styles.stat}>
              <div className={styles.statValue}>{game.path?.length || 0}</div>
              <div className={styles.statLabel}>总页面数</div>
            </div>
          </div>

          <div className={styles.pathSection}>
            <h3>📋 找到的路径：</h3>
            <div className={styles.path}>
              {game.path!.map((page, index) => (
                <div key={index} className={styles.pathStep}>
                  <div className={styles.stepNumber}>{index + 1}</div>
                  <button
                    className={styles.pageTitle}
                    onClick={() => handleWikiLink(page)}
                    title={`查看 ${page} 页面`}
                  >
                    {page}
                  </button>
                  {index < game.path!.length - 1 && (
                    <div className={styles.arrow}>→</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {game.achievements && game.achievements.length > 0 && (
            <div className={styles.achievements}>
              <h3>🏆 解锁成就！</h3>
              <div className={styles.achievementList}>
                {game.achievements.map((achievement, index) => (
                  <div key={index} className={styles.achievement}>
                    ✨ {achievement}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.actions}>
            <button onClick={onNewGame} className={styles.newGameButton}>
              🎮 开始新游戏
            </button>
            <button 
              onClick={() => handleWikiLink(startPage)}
              className={styles.wikiButton}
            >
              📖 查看起始页面
            </button>
            <button 
              onClick={() => handleWikiLink(endPage)}
              className={styles.wikiButton}
            >
              📖 查看目标页面
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.noPathResult}>
          <div className={styles.noPathIcon}>❌</div>
          <h3>未找到路径</h3>
          <p>在指定的搜索深度内未找到从 <strong>{startPage}</strong> 到 <strong>{endPage}</strong> 的路径。</p>
          <p>请尝试：</p>
          <ul>
            <li>使用更常见的页面标题</li>
            <li>检查拼写是否正确</li>
            <li>尝试不同的页面组合</li>
            <li>确保页面存在于英文维基百科</li>
          </ul>
          
          <div className={styles.actions}>
            <button onClick={onNewGame} className={styles.newGameButton}>
              🔄 重新尝试
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GameResult
