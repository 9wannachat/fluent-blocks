import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource-variable/noto-sans-thai'
import '../styles/app.css'
import { App } from './App'
import { RecoveryBoundary } from './RecoveryBoundary'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode><RecoveryBoundary><BrowserRouter><App /></BrowserRouter></RecoveryBoundary></React.StrictMode>,
)
