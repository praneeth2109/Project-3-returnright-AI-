import React, { useEffect, useRef, useState } from 'react';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import TypingIndicator from '../components/TypingIndicator';
import UploadModal from '../components/UploadModal';
import LoginModal from '../components/LoginModal';
import RegisterAdminModal from '../components/RegisterAdminModal';
import { useChat } from '../hooks/useChat';
import { verifyToken, logout } from '../services/api';

export default function ChatPage() {
  const { messages, isLoading, sendMessage, clearChat } = useChat();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegisterAdmin, setShowRegisterAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [suggestedQuery, setSuggestedQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const messagesEndRef = useRef(null);
  const [uploadKey, setUploadKey] = useState(0);

  // Check authentication status on startup and key updates
  useEffect(() => {
    verifyToken().then(({ valid, role }) => {
      setIsAdmin(valid);
      setAdminRole(role);
    });
  }, [uploadKey]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = (question) => {
    sendMessage(question, selectedCategory);
  };

  const handleUploadSuccess = () => {
    // Refresh categories by re-mounting sidebar
    setUploadKey((k) => k + 1);
  };

  const handleEditPolicy = (cat) => {
    setEditingCategory(cat);
    setShowUpload(true);
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  const handleSuggestedQuery = (q) => {
    setSuggestedQuery(q);
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  const handleUploadClick = () => {
    setEditingCategory(null);
    setShowUpload(true);
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsAdmin(false);
    setUploadKey((k) => k + 1);
  };

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    setUploadKey((k) => k + 1);
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <div className={`sidebar-wrapper ${sidebarOpen ? 'open' : 'closed'}`}>
        <Sidebar
          key={uploadKey}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          onUploadClick={handleUploadClick}
          onSuggestedQuery={handleSuggestedQuery}
          onEditPolicy={handleEditPolicy}
          isAdmin={isAdmin}
          adminRole={adminRole}
          onLoginClick={() => setShowLogin(true)}
          onLogout={handleLogout}
          onAddAdminClick={() => setShowRegisterAdmin(true)}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="sidebar-mobile-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="main-content">
        <TopBar
          onClearChat={clearChat}
          selectedCategory={selectedCategory}
          onToggleSidebar={() => setSidebarOpen((o) => !o)}
        />

        {/* Category filter pill */}
        {selectedCategory && (
          <div className="filter-banner">
            <span>
              Filtering results by:{' '}
              <strong>{selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</strong>
            </span>
            <button onClick={() => setSelectedCategory(null)}>✕ Clear filter</button>
          </div>
        )}

        {/* Chat messages area */}
        <div className="messages-area">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatInput
          onSend={handleSend}
          isLoading={isLoading}
          externalValue={suggestedQuery}
          onExternalValueUsed={() => setSuggestedQuery('')}
        />
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSuccess={handleUploadSuccess}
          editingCategory={editingCategory}
        />
      )}

      {/* Login Modal */}
      {showLogin && (
        <LoginModal
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Register Admin Modal */}
      {showRegisterAdmin && (
        <RegisterAdminModal
          isOpen={showRegisterAdmin}
          onClose={() => setShowRegisterAdmin(false)}
        />
      )}
    </div>
  );
}
