import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./styles/App.css"
import App from './App.jsx'
import {ContentProvider} from "../ContentContest.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContentProvider>
    <App />
    </ContentProvider>
  </StrictMode>,
)
