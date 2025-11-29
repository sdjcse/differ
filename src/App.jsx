import { useState, useEffect } from 'react'
import './App.css'
import DiffViewer from './components/DiffViewer'
import ComparisonTable from './components/ComparisonTable'

function App() {
  const [activeView, setActiveView] = useState('table')
  const [selectedComparison, setSelectedComparison] = useState(null)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark')
  }

  const handleViewDiff = (comparison) => {
    setSelectedComparison(comparison)
    setActiveView('diff')
  }

  const handleBackToTable = () => {
    setActiveView('table')
    setSelectedComparison(null)
  }

  return (
    <div className="app">
      <div className="nav-tabs">
        <div className="tabs-left">
          <button
            className={`tab ${activeView === 'table' ? 'active' : ''}`}
            onClick={() => setActiveView('table')}
          >
            Comparison Table
          </button>
          <button
            className={`tab ${activeView === 'diff' ? 'active' : ''}`}
            onClick={() => setActiveView('diff')}
          >
            Diff Viewer
          </button>
        </div>
        <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
          {theme === 'dark' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>
      </div>

      {activeView === 'table' ? (
        <ComparisonTable onViewDiff={handleViewDiff} />
      ) : (
        <div>
          {selectedComparison && (
            <button className="back-button" onClick={handleBackToTable}>
              ← Back to Table
            </button>
          )}
          <DiffViewer
            initialOracle={selectedComparison?.oracleSQL}
            initialPostgres={selectedComparison?.postgresSQL}
            comparisonName={selectedComparison?.name}
          />
        </div>
      )}
    </div>
  )
}

export default App
