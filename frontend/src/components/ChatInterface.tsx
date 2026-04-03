"use client";
import React, { useState } from 'react';

const Send = ({ size = 24, className = "" }: any) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>);
const Bot = ({ size = 24, className = "" }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>);
const User = ({ size = 24, className = "" }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);
const Sparkles = ({ size = 24, className = "" }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path></svg>);

export default function ChatInterface({ 
  messages, 
  setMessages, 
  sessionId, 
  setSessionId 
}: { 
  messages: any[], 
  setMessages: React.Dispatch<React.SetStateAction<any[]>>,
  sessionId: string | null,
  setSessionId: (id: string) => void
}) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      // Send the full history (excluding the initial greeting) for context
      const historyForApi = newMessages.slice(1); // skip the first greeting message

      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          history: historyForApi.slice(0, -1), // all messages except the one we just sent
          sessionId: sessionId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get a response from the server.');
      }

      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
      
      // Update session ID if it's new
      if (data.sessionId && data.sessionId !== sessionId) {
        setSessionId(data.sessionId);
      }
    } catch (err: any) {
      setMessages([
        ...newMessages,
        { role: 'assistant', content: `⚠️ Error: ${err.message || 'Could not connect to the backend. Make sure the server is running on port 5000.'}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#0a0a0a] transition-colors duration-300 relative">
      {/* Header */}
      <div className="h-14 border-b border-zinc-200 dark:border-zinc-800/80 flex items-center px-6 sticky top-0 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md z-10 shrink-0 shadow-sm">
        <h1 className="text-[15px] font-semibold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
          Knowledge Base Chat <Sparkles className="text-yellow-500 w-4 h-4" />
        </h1>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth pb-32">
        {messages.map((message, idx) => (
          <div key={idx} className={`flex gap-4 max-w-3xl mx-auto ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center shadow-sm ${
              message.role === 'user' 
                ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300' 
                : 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20'
            }`}>
              {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            
            {/* Bubble */}
            <div className={`px-4 py-3 min-h-[44px] flex items-center rounded-2xl max-w-[85%] text-[14px] leading-relaxed ${
              message.role === 'user'
                ? 'bg-blue-600 text-white rounded-tr-sm shadow-sm'
                : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 rounded-tl-sm border border-zinc-200 dark:border-zinc-800/80 shadow-sm'
            }`}>
              {message.content}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-4 max-w-3xl mx-auto">
            <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center shadow-sm bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20">
              <Bot size={16} />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 shadow-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>
      
      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white dark:from-[#0a0a0a] dark:via-[#0a0a0a] to-transparent pt-10">
        <div className="max-w-3xl mx-auto relative group">
          <form onSubmit={handleSend} className="relative flex items-end shadow-sm group-focus-within:shadow-md transition-shadow rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700/80 focus-within:border-blue-500 dark:focus-within:border-blue-500 overflow-hidden">
            <textarea 
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about your documents..."
              className="w-full max-h-32 bg-transparent py-4 pl-4 pr-14 text-[14px] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:outline-none resize-none"
              style={{ minHeight: '56px' }}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className="absolute right-2 bottom-2 p-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 dark:disabled:text-zinc-600 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              <Send size={16} className={`${input.trim() && !isLoading ? 'translate-x-0.5' : ''} transition-transform`} />
            </button>
          </form>
          <div className="text-center mt-2.5 mb-1 hidden sm:block">
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
              AI Chatbots can make mistakes. Consider verifying important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
