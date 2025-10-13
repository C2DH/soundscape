import { BrowserRouter } from 'react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { SiteBasename } from './constants.ts';

console.info(`Site basename: "${SiteBasename}"`);
createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <StrictMode>
      <App />
    </StrictMode>
  </BrowserRouter>
);
