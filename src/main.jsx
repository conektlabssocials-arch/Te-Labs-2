import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const container = document.getElementById('root')

// Every route is prerendered, so the normal path is hydration — attaching to
// markup that is already on screen. createRoot stays as a fallback for the dev
// server, where index.html still ships the empty shell.
if (container.hasChildNodes()) {
  hydrateRoot(container, <App />)
} else {
  createRoot(container).render(<App />)
}
