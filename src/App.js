import React from 'react';
import { useEasterEgg } from './hooks/useEasterEgg';

function App() {
  useEasterEgg();

  return (
    <div className="container">
      <main className="main">
        <h1 className="name">Noah Anderson</h1>
        <p className="tagline">coming soon<span className="cursor">_</span></p>
      </main>
      <footer className="footer">
        <a href="mailto:hello@noahanderson.dev" className="link">say hello</a>
      </footer>
    </div>
  );
}

export default App;
