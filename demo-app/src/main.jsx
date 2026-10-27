// demo-app/src/main.jsx
// The entry point: it loads the CSS and puts the App on the page.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './tokens.css' // the design tokens come first
import './index.css'  // global styles that use the tokens
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
