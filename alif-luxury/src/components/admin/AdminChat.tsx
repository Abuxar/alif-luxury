import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send, User, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Message {
  _id?: string;
  text: string;
  sender: 'user' | 'admin';
  sessionId: string;
  createdAt?: string;
}

export const AdminChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch historical messages
    const fetchMessages = async () => {
      try {
        const res = await fetch('/api/messages');
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
          
          if (data.length > 0) {
            // Pick most recent session
            const sessions = [...new Set(data.map((m: Message) => m.sessionId))];
            setSelectedSession(sessions[sessions.length - 1] as string);
          }
        }
      } catch (err) {
        console.error("Failed to load generic chat history", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMessages();

    // Setup real-time socket
    const newSocket = io('http://localhost:3000');
    socketRef.current = newSocket;

    newSocket.on('connect', () => {
      newSocket.emit('join_admin');
    });

    newSocket.on('admin_new_message', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
      
      // Auto-select if no session is selected
      setSelectedSession(curr => {
        if (!curr) return msg.sessionId;
        return curr;
      });
      scrollToBottom();
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
     scrollToBottom();
  }, [selectedSession, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedSession || !socketRef.current) return;

    socketRef.current.emit('send_message', {
      sessionId: selectedSession,
      text: replyText,
      sender: 'admin'
    });

    // We don't need to manually append here because admin_new_message catches it,
    // actually wait, admin_new_message is broadcast to 'admin_room', so we will get it!
    setReplyText('');
  };

  // Group messages by session
  const sessions = Array.from(new Set(messages.map(m => m.sessionId)));
  const currentMessages = messages.filter(m => m.sessionId === selectedSession);

  if (isLoading) {
    return <div className="p-8 text-brand-text/50">Loading communication logs...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[80vh] flex">
      {/* Sidebar */}
      <div className="w-1/3 border-e border-gray-100 bg-gray-50/50 flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-white">
          <h2 className="font-drama text-lg text-brand-primary">Active Sessions</h2>
          <p className="text-xs text-brand-text/60">Real-time client clienteling</p>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {sessions.length === 0 ? (
            <div className="p-8 text-center text-brand-text/50 text-sm">No active chats.</div>
          ) : (
            sessions.map((sid) => {
              const sessionMessages = messages.filter(m => m.sessionId === sid);
              const lastMessage = sessionMessages[sessionMessages.length - 1];
              const isSelected = selectedSession === sid;

              return (
                <button
                  key={sid}
                  onClick={() => setSelectedSession(sid)}
                  className={`w-full text-start p-4 border-b border-gray-100 transition-colors ${
                    isSelected ? 'bg-brand-primary/5 border-s-2 border-s-brand-primary' : 'hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-brand-primary">
                      {sid.substring(0, 15)}...
                    </span>
                    <span className="text-[10px] text-brand-text/40">
                      {lastMessage?.createdAt ? new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <p className="text-sm text-brand-text/60 truncate">
                    {lastMessage?.sender === 'admin' ? 'You: ' : ''}{lastMessage?.text}
                  </p>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {selectedSession ? (
          <>
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                <User size={18} />
              </div>
              <div>
                 <h3 className="font-mono text-sm font-bold text-brand-primary">Session: {selectedSession}</h3>
                 <span className="text-xs text-green-500 font-medium">Online</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-gray-50/30">
              {currentMessages.map((msg, i) => {
                const isAdmin = msg.sender === 'admin';
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg._id || i}
                    className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] rounded-2xl px-5 py-3 text-sm font-sans ${
                      isAdmin 
                        ? 'bg-brand-primary text-white rounded-tr-sm' 
                        : 'bg-white border border-gray-100 text-brand-text rounded-tl-sm shadow-sm'
                    }`}>
                      {msg.text}
                      <span className={`block text-[10px] mt-1 ${isAdmin ? 'text-white/50' : 'text-brand-text/30'}`}>
                         {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-white">
              <div className="relative flex items-center">
                <input 
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type a reply to the customer..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-full py-3 px-6 pe-12 text-sm text-brand-text focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all font-sans"
                />
                <button 
                  type="submit"
                  disabled={!replyText.trim()}
                  className="absolute right-2 p-2 rounded-full bg-brand-primary text-white hover:bg-brand-primary/90 disabled:opacity-50 transition-all"
                >
                  <Send size={16} className="-ms-0.5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-brand-text/40">
            <MessageCircle size={48} className="mb-4 opacity-20" />
            <p className="font-sans">Select a chat session to begin assisting.</p>
          </div>
        )}
      </div>
    </div>
  );
};
