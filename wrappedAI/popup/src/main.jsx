import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Wrapped.css'
import Wrapped from './Wrapped.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Wrapped />
  </StrictMode>,
)
