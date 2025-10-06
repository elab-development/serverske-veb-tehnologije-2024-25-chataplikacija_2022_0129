import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/css/app.css'
import './assets/css/app-tBQgCO28.css'
import App from './App.tsx'
import { initializeTheme } from './hooks/use-appearance.tsx'

initializeTheme()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
