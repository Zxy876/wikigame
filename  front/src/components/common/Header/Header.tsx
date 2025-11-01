import React from 'react'
import styles from './Header.module.css'

interface HeaderProps {
  currentPage: string
  onNavigate: (page: string) => void
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const navItems = [
    { key: 'home', label: '首页', emoji: '🏠' },
    { key: 'game', label: '开始游戏', emoji: '🎮' },
    { key: 'leaderboard', label: '排行榜', emoji: '🏆' },
    { key: 'achievements', label: '成就', emoji: '🎖️' },
    { key: 'about', label: '关于', emoji: 'ℹ️' },
  ]

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div 
          className={styles.logo}
          onClick={() => onNavigate('home')}
          style={{ cursor: 'pointer' }}
        >
          🎯 Wiki Racer
        </div>
        
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`${styles.navLink} ${currentPage === item.key ? styles.active : ''}`}
              onClick={() => onNavigate(item.key)}
            >
              {item.emoji} {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header
