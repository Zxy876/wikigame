import React, { useState } from 'react'
import styles from './GameForm.module.css'

// 临时内联 helper 函数
const validateWikiTitle = (title: string): boolean => {
  if (!title || title.trim().length === 0) return false;
  return /^[a-zA-Z0-9_()\s-]+$/.test(title);
};

const generateRandomWikiTitle = (): string => {
  const titles = [
    'Python_(programming_language)',
    'Artificial_intelligence',
    'Machine_learning',
    'World_Wide_Web',
    'Computer_science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'History'
  ];
  return titles[Math.floor(Math.random() * titles.length)];
};

interface GameFormProps {
  onGameStart: (start: string, end: string) => void
  loading: boolean
}

export const GameForm: React.FC<GameFormProps> = ({ onGameStart, loading }) => {
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [errors, setErrors] = useState<{ start?: string; end?: string }>({})

  const validateForm = (): boolean => {
    const newErrors: { start?: string; end?: string } = {}

    if (!start.trim()) {
      newErrors.start = '请输入起始页面'
    } else if (!validateWikiTitle(start)) {
      newErrors.start = '页面标题格式不正确'
    }

    if (!end.trim()) {
      newErrors.end = '请输入目标页面'
    } else if (!validateWikiTitle(end)) {
      newErrors.end = '页面标题格式不正确'
    }

    if (start.trim() === end.trim()) {
      newErrors.end = '起始页面和目标页面不能相同'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onGameStart(start.trim(), end.trim())
    }
  }

  const handleRandomExample = () => {
    let newStart = generateRandomWikiTitle()
    let newEnd = generateRandomWikiTitle()
    
    while (newStart === newEnd) {
      newEnd = generateRandomWikiTitle()
    }
    
    setStart(newStart)
    setEnd(newEnd)
    setErrors({})
  }

  const handleSwap = () => {
    setStart(end)
    setEnd(start)
    setErrors({})
  }

  const popularExamples = [
    { start: 'Python_(programming_language)', end: 'Artificial_intelligence' },
    { start: 'Mathematics', end: 'Computer_science' },
    { start: 'Physics', end: 'Quantum_mechanics' },
    { start: 'Biology', end: 'Genetics' },
  ]

  const handleExampleClick = (example: typeof popularExamples[0]) => {
    setStart(example.start)
    setEnd(example.end)
    setErrors({})
  }

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="start">🏁 起始页面</label>
          <input
            id="start"
            type="text"
            value={start}
            onChange={(e) => {
              setStart(e.target.value)
              if (errors.start) setErrors({ ...errors, start: undefined })
            }}
            placeholder="例如: Python_(programming_language)"
            disabled={loading}
            className={errors.start ? styles.error : ''}
          />
          {errors.start && <span className={styles.errorText}>{errors.start}</span>}
        </div>

        <div className={styles.swapButton}>
          <button 
            type="button" 
            onClick={handleSwap} 
            disabled={loading}
            title="交换起始和目标页面"
          >
            🔄 交换
          </button>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="end">🎯 目标页面</label>
          <input
            id="end"
            type="text"
            value={end}
            onChange={(e) => {
              setEnd(e.target.value)
              if (errors.end) setErrors({ ...errors, end: undefined })
            }}
            placeholder="例如: Artificial_intelligence"
            disabled={loading}
            className={errors.end ? styles.error : ''}
          />
          {errors.end && <span className={styles.errorText}>{errors.end}</span>}
        </div>

        <div className={styles.actions}>
          <button 
            type="submit" 
            className={styles.primaryButton}
            disabled={loading || !start.trim() || !end.trim()}
          >
            {loading ? '🔍 搜索中...' : '🎯 开始搜索'}
          </button>
          
          <button 
            type="button" 
            onClick={handleRandomExample}
            className={styles.secondaryButton}
            disabled={loading}
          >
            🎲 随机示例
          </button>
        </div>
      </form>

      <div className={styles.examples}>
        <h3>💡 热门示例：</h3>
        <div className={styles.exampleList}>
          {popularExamples.map((example, index) => (
            <button
              key={index}
              type="button"
              className={styles.exampleButton}
              onClick={() => handleExampleClick(example)}
              disabled={loading}
            >
              <span className={styles.exampleText}>
                {example.start} → {example.end}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GameForm
