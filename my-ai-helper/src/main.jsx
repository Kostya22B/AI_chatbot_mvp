// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import Header from './components/Header.jsx'

import { LocaleProvider } from './locale/LocaleSwitcher';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LocaleProvider>
      <div className="h-screen flex flex-col">
        <Header />
        <div className="flex-1 min-h-0">
          <App />
        </div>
      </div>
    </LocaleProvider>
  </React.StrictMode>
)