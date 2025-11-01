import React from 'react'
import styles from './Leaderboard.module.css'

interface LeaderboardProps {
  navigate?: (path: string) => void
}

const Leaderboard: React.FC<LeaderboardProps> = ({ navigate }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>🏆 排行榜</h1>
        <p>看看谁是最强的 Wiki Racer！</p>
      </div>
      
      <div className={styles.comingSoon}>
        <div className={styles.comingSoonIcon}>🚧</div>
        <h2>功能开发中</h2>
        <p>排行榜功能正在紧锣密鼓地开发中...</p>
        <p>敬请期待！</p>
      </div>
    </div>
  )
}

export default Leaderboard
