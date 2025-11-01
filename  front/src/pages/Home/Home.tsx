import React from 'react'
import styles from './Home.module.css'

interface HomeProps {
  navigate?: (path: string) => void
}

const Home: React.FC<HomeProps> = ({ navigate }) => {
  const handleNavigate = (page: string) => {
    if (navigate) {
      navigate(page)
    } else {
      // 如果没有 navigate 函数，使用简单的页面跳转
      window.location.href = `/${page}`
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>🎯 Wiki Racer</h1>
        <p className={styles.subtitle}>在维基百科页面间寻找最短路径的趣味游戏</p>
        
        <div className={styles.features}>
          <div className={styles.featureCard}>
            <h3>🚀 快速搜索</h3>
            <p>使用双向BFS算法快速找到页面间的最短路径</p>
          </div>
          <div className={styles.featureCard}>
            <h3>🏆 成就系统</h3>
            <p>完成挑战解锁各种成就，提升你的排名</p>
          </div>
          <div className={styles.featureCard}>
            <h3>📊 实时统计</h3>
            <p>查看个人数据和全球排行榜</p>
          </div>
        </div>

        <div className={styles.actions}>
          <button 
            onClick={() => handleNavigate('game')} 
            className={styles.primaryButton}
          >
            开始游戏
          </button>
          <button 
            onClick={() => handleNavigate('leaderboard')} 
            className={styles.secondaryButton}
          >
            查看排行榜
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
