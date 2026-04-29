import { useState, useCallback } from 'react';
import { sendQuery } from '../services/api';

/**
 * useChat hook
 * Manages all chat conversation state, including messages, loading, and errors.
 */
export function useChat() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: "Hello! I'm **ReturnRight AI**, your smart return & refund policy assistant. Ask me anything about our return windows, refund timelines, eligible items, or exceptions — and I'll find the exact policy section for you.",
      sources: [],
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (question, category) => {
    if (!question.trim()) return;

    // Add user message immediately
    const userMsg = {
      id: `user_${Date.now()}`,
      role: 'user',
      text: question,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      const result = await sendQuery(question, category);

      const assistantMsg = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        text: result.answer,
        sources: result.sources || [],
        confidence: result.confidence,
        primarySource: result.primarySource,
        model: result.model,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setError('Failed to get a response. Please ensure the server is running.');
      const errorMsg = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        text: "I'm having trouble connecting to the policy database. Please check that the server is running and try again.",
        sources: [],
        isError: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        text: "Hello! I'm **ReturnRight AI**, your smart return & refund policy assistant. Ask me anything about our return windows, refund timelines, eligible items, or exceptions — and I'll find the exact policy section for you.",
        sources: [],
        timestamp: new Date(),
      },
    ]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearChat };
}
