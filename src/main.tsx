import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

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
