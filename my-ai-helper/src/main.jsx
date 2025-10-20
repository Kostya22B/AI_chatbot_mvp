import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// --- ВЫБОР ЯЗЫКА ---
// Чтобы использовать английский, оставьте эту строку:
import t from './locales/en.json' assert { type: 'json' };

// Чтобы использовать японский, закомментируйте строку выше и раскомментируйте эту:
// import t from './ja.json' assert { type: 'json' };


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App t={t} /> 
  </React.StrictMode>,
)
