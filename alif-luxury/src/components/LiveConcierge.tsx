import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User } from 'lucide-react';

interface Message {
  _id?: string;
  text: string;
  sender: 'user' | 'admin';
  createdAt?: string | Date;
}

export const LiveConcierge = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Use a simple session ID from localStorage or generate one
  const getSessionId = () => {
    let sid = localStorage.getItem('alif_chat_session');
    if (!sid) {
      sid = 'session_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('alif_chat_session', sid);
    }
    return sid;
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    if (!isOpen || socketRef.current) return;

    const newSocket = io('http://localhost:3000');
    socketRef.current = newSocket;

    newSocket.on('connect', () => {
      newSocket.emit('join_session', getSessionId());
    });

    newSocket.on('chat_history', (history: Message[]) => {
      setMessages(history);
      scrollToBottom();
    });

    newSocket.on('new_message', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
      scrollToBottom();
    });

    // Cleanup isn't required until total unmount
  }, [isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketRef.current) return;

    socketRef.current.emit('send_message', {
      sessionId: getSessionId(),
      text: newMessage,
      sender: 'user'
    });

    setNewMessage('');
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ originY: 1, scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ originY: 1, scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="mb-4 w-[350px] sm:w-[400px] h-[500px] max-h-[70vh] glass-panel-dark border border-brand-accent/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10 bg-black/40 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center border border-brand-accent/30 text-brand-accent">
                    <User size={18} />
                  </div>
                  <div>
                    <h3 className="font-drama text-lg text-white m-0 leading-tight">Private Concierge</h3>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-white/50 text-[10px] uppercase tracking-widest font-mono">Stylists Online</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-white/50 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-brand-background/5">
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center px-6 opacity-60">
                    <MessageCircle size={40} className="text-brand-accent mb-4 opacity-50" />
                    <p className="font-sans text-sm text-white font-light">
                      Welcome to Alif Client Services. How may our stylists assist you with your wardrobe today?
                    </p>
                  </div>
                )}
                
                {messages.map((msg, i) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={msg._id || i}
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm font-sans leading-relaxed ${
                        isUser 
                          ? 'bg-brand-accent text-brand-primary rounded-tr-sm' 
                          : 'bg-white/10 text-white rounded-tl-sm backdrop-blur-md border border-white/5'
                      }`}>
                        {msg.text}
                      </div>
                    </motion.div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSend} className="p-4 bg-black/40 border-t border-white/10">
                <div className="relative flex items-center">
                  <input 
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand-accent/50 transition-colors font-sans"
                  />
                  <button 
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="absolute right-2 p-2 rounded-full bg-brand-accent text-brand-primary hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all flex items-center justify-center"
                  >
                    <Send size={16} className="-ms-0.5" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border ${
            isOpen 
              ? 'bg-white text-black border-transparent scale-90' 
              : 'bg-brand-background text-brand-primary border-brand-accent/30 hover:bg-brand-accent scale-100'
          }`}
          style={{
             boxShadow: isOpen ? '0 10px 25px rgba(0,0,0,0.5)' : '0 0 0 0 rgba(0,0,0,0)'
          }}
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </button>
      </div>
    </>
  );
};
