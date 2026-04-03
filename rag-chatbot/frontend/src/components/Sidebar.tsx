"use client";
import React, { useState, useRef } from 'react';

const UploadCloud = ({ size = 24, className = "" }: any) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="m16 16-4-4-4 4"></path></svg>);
const FileText = ({ size = 24, className = "" }: any) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>);
const Settings = ({ size = 24, className = "" }: any) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>);
const Plus = ({ size = 24, className = "" }: any) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>);
const X = ({ size = 16, className = "" }: any) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>);
const CheckCircle = ({ size = 16, className = "" }: any) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>);
const MessageSquare = ({ size = 16, className = "" }: any) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>);

type UploadedDoc = { name: string; numChunks: number; status: 'success' | 'error'; error?: string };
type ChatHistory = { sessionId: string; title: string; updatedAt: string };

export default function Sidebar({ onNewChat, onSelectChat, currentSessionId }: { 
  onNewChat?: () => void, 
  onSelectChat?: (id: string) => void,
  currentSessionId?: string | null
}) {
  const [documents, setDocuments] = useState<UploadedDoc[]>([]);
  const [history, setHistory] = useState<ChatHistory[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/history');
      const data = await response.json();
      if (response.ok) setHistory(data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  React.useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  const uploadFile = async (file: File) => {
    if (!file || file.type !== 'application/pdf') {
      setUploadError('Only PDF files are allowed.');
      return;
    }
    setIsUploading(true);
    setUploadError(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Upload failed.');
      setDocuments((prev) => [...prev, { name: file.name, numChunks: data.numChunks, status: 'success' }]);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload file.');
      setDocuments((prev) => [...prev, { name: file.name, numChunks: 0, status: 'error', error: err.message }]);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const removeDocument = (index: number) => setDocuments((prev) => prev.filter((_, i) => i !== index));

  return (
    <div className="w-64 h-full bg-zinc-50 dark:bg-[#111111] border-r border-zinc-200 dark:border-zinc-800/80 flex flex-col transition-colors duration-300">
      <div className="p-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800/80">
        <h2 className="font-semibold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">AI</div>
          Knowledge
        </h2>
      </div>

      <div className="p-4">
        <button onClick={onNewChat} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-all shadow hover:shadow-md active:scale-[0.98]">
          <Plus size={18} /> New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6 scroll-smooth">
        <div>
          <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider mb-2 px-1">Recent Chats</h3>
          <div className="space-y-0.5">
            {history.length === 0 ? (
              <p className="text-[11px] text-zinc-400 px-1 italic">No recent chats</p>
            ) : (
              history.map((chat) => (
                <button key={chat.sessionId} onClick={() => onSelectChat?.(chat.sessionId)} className={`w-full text-left px-2 py-2 rounded-lg text-[13px] transition-colors flex items-center gap-2 group ${currentSessionId === chat.sessionId ? 'bg-blue-100/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'}`}>
                  <MessageSquare size={14} className={currentSessionId === chat.sessionId ? 'text-blue-500' : 'text-zinc-400'} />
                  <span className="truncate">{chat.title}</span>
                </button>
              ))
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider mb-3 px-1">Documents</h3>
          <div className="space-y-1.5">
            <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
            <div onClick={() => !isUploading && fileInputRef.current?.click()} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} className={`border border-dashed rounded-xl p-5 text-center transition-all cursor-pointer group shadow-sm ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900/40 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 hover:border-blue-500 dark:hover:border-blue-500/50'} ${isUploading ? 'opacity-60 cursor-not-allowed' : ''}`}>
              {isUploading ? (
                <><div className="mx-auto mb-2 w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /><p className="text-[13px] font-medium text-blue-500">Uploading...</p></>
              ) : (
                <><UploadCloud className="mx-auto text-zinc-400 dark:text-zinc-500 group-hover:text-blue-500 transition-colors mb-2" size={24} /><p className="text-[13px] font-medium text-zinc-600 dark:text-zinc-300">Upload PDF</p><p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">Drag & drop or click</p></>
              )}
            </div>
            {uploadError && <p className="text-[11px] text-red-500 px-1 mt-1">⚠️ {uploadError}</p>}
            {documents.map((doc, idx) => (
              <div key={idx} className={`mt-2 flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px] font-medium shadow-sm ${doc.status === 'error' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 ring-1 ring-red-300 dark:ring-red-800' : 'bg-white dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300 ring-1 ring-zinc-200 dark:ring-zinc-700'}`}>
                {doc.status === 'success' ? <CheckCircle size={15} className="text-green-500 shrink-0" /> : <FileText size={15} className="text-red-400 shrink-0" />}
                <span className="truncate flex-1">{doc.name}</span>
                {doc.status === 'success' && <span className="text-[10px] text-zinc-400 shrink-0">{doc.numChunks}c</span>}
                <button onClick={(e) => { e.stopPropagation(); removeDocument(idx); }} className="ml-auto text-zinc-400 hover:text-red-500 transition-colors shrink-0"><X size={13} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800/80">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors text-left">
          <Settings size={18} /><span>Settings</span>
        </button>
      </div>
    </div>
  );
}
