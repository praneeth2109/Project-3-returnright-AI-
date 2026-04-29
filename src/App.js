import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import ChatPage from './pages/ChatPage';
import './styles.css';

export default function App() {
  return (
    <ThemeProvider>
      <ChatPage />
    </ThemeProvider>
  );
}
