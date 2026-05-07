import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import './i18n'
import App from './App.jsx'
import './index.css'

import { GoogleOAuthProvider } from '@react-oauth/google'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <App />
        </React.Suspense>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
