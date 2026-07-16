import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';
import './styles.css';

export default function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <ThemeProvider>
      <div className={`app-root-container ${showDashboard ? 'show-app' : 'show-landing'}`}>
        {!showDashboard ? (
          <LandingPage onGetStarted={() => setShowDashboard(true)} />
        ) : (
          <div className="fade-in-app">
            <ChatPage />
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}
