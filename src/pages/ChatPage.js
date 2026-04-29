import React, { useEffect, useRef, useState } from 'react';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import TypingIndicator from '../components/TypingIndicator';
import UploadModal from '../components/UploadModal';
import { useChat } from '../hooks/useChat';

export default function ChatPage() {
  const { messages, isLoading, sendMessage, clearChat } = useChat();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [suggestedQuery, setSuggestedQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);
  const [uploadKey, setUploadKey] = useState(0);

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
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <div className={`sidebar-wrapper ${sidebarOpen ? 'open' : 'closed'}`}>
        <Sidebar
          key={uploadKey}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onUploadClick={() => {
            setEditingCategory(null);
            setShowUpload(true);
          }}
          onSuggestedQuery={(q) => setSuggestedQuery(q)}
          onEditPolicy={handleEditPolicy}
        />
      </div>

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
    </div>
  );
}
