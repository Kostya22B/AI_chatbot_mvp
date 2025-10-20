// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import Header from './components/Header.jsx'

// LocaleProvider из ранее созданного модуля
import { LocaleProvider } from './locale/LocaleSwitcher';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LocaleProvider>
      <Header />
      {/* App теперь сам возьмёт t из контекста и прокинет вниз */}
      <App />
    </LocaleProvider>
  </React.StrictMode>,
)