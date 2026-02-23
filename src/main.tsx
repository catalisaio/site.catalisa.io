import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './i18n'
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// If pre-rendered HTML exists, hydrate instead of full render
if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
