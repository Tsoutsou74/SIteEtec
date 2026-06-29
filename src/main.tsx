import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'
import { I18nProvider } from './config/I18nProvider';

createRoot(document.getElementById('root')).render(
   <I18nProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </I18nProvider>
)
