import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './lib/tower3d.js'
import './lib/mini3d.js'

createRoot(document.getElementById('root')).render(<App />)
