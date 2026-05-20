import { useState } from 'react'
import './App.css'
import Home from './pages/Home'
import Preloader from './components/Preloader'

const PRELOADER_KEY = "preloader_shown";

function App() {
  const [loading, setLoading] = useState(() => {
    const alreadyShown = sessionStorage.getItem(PRELOADER_KEY) === "true";
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    return !alreadyShown && !prefersReduced;
  });

  return (
    <>
      {loading && (
        <Preloader
          onComplete={() => {
            sessionStorage.setItem(PRELOADER_KEY, "true");
            setLoading(false);
          }}
        />
      )}
      <Home />
    </>
  );
}

export default App
