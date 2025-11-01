import React, { useState, useEffect } from 'react'
import Header from './components/common/Header/Header'
import Home from './pages/Home/Home'
import Game from './pages/Game/Game'
import Leaderboard from './pages/Leaderboard/Leaderboard'
import Achievements from './pages/Achievements/Achievements'
import About from './pages/About/About'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  const navigate = (page: string) => {
    setCurrentPage(page)
    // 更新 URL 但不刷新页面
    window.history.pushState({}, '', `/${page === 'home' ? '' : page}`)
  }

  // 处理浏览器前进后退
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.substring(1) || 'home'
      setCurrentPage(path)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const renderPage = () => {
    const pageProps = { navigate }
    
    switch (currentPage) {
      case 'home':
        return <Home {...pageProps} />
      case 'game':
        return <Game {...pageProps} />
      case 'leaderboard':
        return <Leaderboard {...pageProps} />
      case 'achievements':
        return <Achievements {...pageProps} />
      case 'about':
        return <About {...pageProps} />
      default:
        return <Home {...pageProps} />
    }
  }

  return (
    <div className="App">
      <Header currentPage={currentPage} onNavigate={navigate} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  )
}

export default App
