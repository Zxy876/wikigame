import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/globals.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('找不到 #root 元素，请检查 index.html')
}

const root = ReactDOM.createRoot(rootElement)

console.log('🚀 Wiki Racer 前端应用启动中...')

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
