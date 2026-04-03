"use client";
import React, { useState } from 'react';
import Sidebar from "@/components/Sidebar";
import ChatInterface from "@/components/ChatInterface";

const INITIAL_MESSAGE = { 
  role: 'assistant', 
  content: 'Hello! I am your AI Knowledge Assistant. Upload some documents to the sidebar, and I can help you answer questions about them using Gemini Flash.' 
};

export default function Home() {
  const [messages, setMessages] = useState<any[]>([INITIAL_MESSAGE]);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const handleNewChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setSessionId(null);
  };

  const handleChatSelect = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/history/${id}`);
      const data = await response.json();
      if (response.ok) {
        setMessages(data.messages);
        setSessionId(id);
      }
    } catch (err) {
      console.error("Failed to load chat:", err);
    }
  };

  return (
    <div className="flex h-screen bg-white dark:bg-black font-sans overflow-hidden text-zinc-900 dark:text-zinc-100">
      {/* Sidebar - hidden on very small screens for now, visible on sm and up */}
      <div className="hidden sm:block">
        <Sidebar onNewChat={handleNewChat} onSelectChat={handleChatSelect} currentSessionId={sessionId} />
      </div>
      
      {/* Main Chat Interface */}
      <main className="flex-1 flex flex-col h-full">
        <ChatInterface 
          messages={messages} 
          setMessages={setMessages} 
          sessionId={sessionId} 
          setSessionId={setSessionId} 
        />
      </main>
    </div>
  );
}
