import React from 'react'
import styles from './Profile.module.css'

const Profile: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>👤 个人资料</h1>
        <p>管理你的个人资料和统计数据</p>
      </div>
      
      <div className={styles.comingSoon}>
        <div className={styles.comingSoonIcon}>🔧</div>
        <h2>功能开发中</h2>
        <p>个人资料功能正在开发中...</p>
        <p>敬请期待！</p>
      </div>
    </div>
  )
}

export default Profile