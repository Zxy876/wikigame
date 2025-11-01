import React from 'react'
import { Header } from './components/common/Header'
import { LoadingSpinner } from './components/common/LoadingSpinner'
import { Home } from './pages/Home'
import { Game } from './pages/Game'
import { Leaderboard } from './pages/Leaderboard'
import { Profile } from './pages/Profile'
import { Achievements } from './pages/Achievements'
import { About } from './pages/About'
console.log('🚀 开始测试所有导入...')
try {
  console.log('✅ Common 组件:', { 
    Header: typeof Header,
    LoadingSpinner: typeof LoadingSpinner
  })
} catch (error) {
  console.error('❌ Common 组件导入失败:', error)
}
try {
  console.log('✅ 页面组件:', {
    Home: typeof Home,
    Game: typeof Game, 
    Leaderboard: typeof Leaderboard,
    Profile: typeof Profile,
    Achievements: typeof Achievements,
    About: typeof About
  })
} catch (error) {
  console.error('❌ 页面组件导入失败:', error)
}
console.log('🎉 导入测试完成！')
const TestComponent: React.FC = () => {
  return (
    <div style={{ padding: '20px', background: '#f0f8ff', borderRadius: '8px', margin: '20px 0' }}>
      <h3>🧪 导入测试组件</h3>
      <p>如果看到这个组件，说明所有导入都正常工作！</p>
      <LoadingSpinner message="测试加载中..." />
    </div>
  )
}
export default TestComponent
