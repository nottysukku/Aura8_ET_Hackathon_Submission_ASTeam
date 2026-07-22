'use client';

import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, BookOpen, ExternalLink, MessageSquare } from 'lucide-react';

interface FloatingChatbotProps {
  apiKey: string;
}

export const FloatingChatbot: React.FC<FloatingChatbotProps> = ({ apiKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; citations?: any[] }>>([
    {
      sender: 'bot',
      text: 'Hello! I am your **AURA Gemini Assistant**. Ask me anything about your uploaded documents or statutory safety rules!'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText;
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userText, apiKey: apiKey || undefined })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: data.answer,
            citations: data.citations || []
          }
        ]);
      } else {
        throw new Error('Server response error');
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `Processing query: ${err.message}`
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-2xl shadow-cyan-500/40 border border-cyan-400/40 flex items-center justify-center transition-all transform hover:scale-105 active:scale-95"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </button>

      {/* Slide-Over Chatbot Drawer */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[520px] bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden select-none">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white font-mono">AURA Gemini Assistant</h4>
                <p className="text-[10px] text-slate-400 font-mono">Persistent Across All Pages</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs font-mono">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-cyan-600/30 text-cyan-100 border border-cyan-500/40 rounded-tr-none'
                      : 'bg-slate-800/80 text-slate-200 border border-slate-700/60 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>

                  {m.citations && m.citations.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-700/60 space-y-1">
                      <span className="text-[9px] text-slate-400 uppercase font-bold block">Sources:</span>
                      {m.citations.map((c, cIdx) => (
                        <div key={cIdx} className="text-[10px] text-cyan-300 flex items-center space-x-1">
                          <BookOpen className="w-3 h-3 text-cyan-400" />
                          <span>{c.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span>Querying Gemini RAG...</span>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500/40"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
