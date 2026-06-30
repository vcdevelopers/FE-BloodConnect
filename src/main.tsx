import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Global fetch override to direct relative /api/ requests to the production backend in production
const originalFetch = window.fetch;
window.fetch = function (input, init) {
  let url = typeof input === 'string' ? input : (input instanceof Request ? input.url : '');
  if (url.startsWith('/api/')) {
    const apiBase = import.meta.env.PROD 
      ? 'https://api.bloodconnect.digielvestech.in' 
      : '';
    if (typeof input === 'string') {
      input = `${apiBase}${input}`;
    } else if (input instanceof Request) {
      input = new Request(`${apiBase}${url}`, input);
    }
  }
  return originalFetch(input, init);
};

// Automatically unregister service workers to prevent aggressive PWA caching during testing/development
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
      console.log('Active service worker unregistered successfully.');
    }
  }).catch((err) => {
    console.error('Error unregistering service worker:', err);
  });
}

createRoot(document.getElementById("root")!).render(<App />);
