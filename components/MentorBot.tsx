
import React, { useState, useRef, useEffect } from 'react';
import { UserRole, ChatMessage } from '../types';
import { Send, User, Bot, Loader2, Sparkles, Mic, Volume2 } from 'lucide-react';
import { geminiService } from '../services/gemini';

interface MentorBotProps {
  userRole: UserRole;
}

export const MentorBot: React.FC<MentorBotProps> = ({ userRole }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: `Hello! I'm your Senior Civil Engineering Mentor. As a ${userRole}, what technical challenge can I help you with today?`, timestamp: new Date(), persona: 'Senior Site Engineer' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await geminiService.getMentorResponse([...messages, userMsg], 'Senior Site Engineer');
      setMessages(prev => [...prev, { role: 'assistant', content: response, timestamp: new Date(), persona: 'Senior Site Engineer' }]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col p-8 space-y-6">
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Bot size={28} />
           </div>
           <div>
              <h3 className="text-xl font-bold text-slate-900">BuildSense Mentor</h3>
              <div className="flex items-center gap-2 mt-0.5">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">AI Expert Online</span>
              </div>
           </div>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mode:</span>
           <select className="bg-white border border-slate-200 text-xs font-bold px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Senior Site Engineer</option>
              <option>Quantity Surveyor</option>
              <option>Consultant</option>
           </select>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-6 pr-4 scrollbar-thin scrollbar-thumb-slate-200"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
              msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-indigo-100 text-indigo-600'
            }`}>
              {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
            </div>
            <div className={`max-w-[80%] space-y-2 ${msg.role === 'user' ? 'text-right' : ''}`}>
              {msg.persona && (
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{msg.persona}</p>
              )}
              <div className={`p-5 rounded-3xl text-sm font-medium leading-relaxed shadow-sm border ${
                msg.role === 'user' 
                ? 'bg-indigo-600 text-white border-indigo-500 rounded-tr-none' 
                : 'bg-white text-slate-700 border-slate-100 rounded-tl-none'
              }`}>
                {msg.content}
              </div>
              <p className="text-[10px] text-slate-400 font-medium uppercase">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
             <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Loader2 className="animate-spin" size={16} />
             </div>
             <div className="p-5 rounded-3xl bg-white border border-slate-100 rounded-tl-none flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
             </div>
          </div>
        )}
      </div>

      <div className="shrink-0 pt-4 border-t border-slate-100">
        <div className="relative group">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about BBS, Mix Design, Soil Mechanics..."
            className="w-full bg-slate-100 border-none rounded-2xl py-5 pl-6 pr-32 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 transition-all"
          />
          <div className="absolute right-3 top-3 bottom-3 flex items-center gap-2">
             <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                <Mic size={20} />
             </button>
             <button 
               onClick={handleSend}
               disabled={!input.trim() || isLoading}
               className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-50"
             >
                <Send size={20} />
             </button>
          </div>
        </div>
        <p className="text-[10px] text-center text-slate-400 font-medium mt-4 uppercase tracking-widest">Verified by structural engineering standards</p>
      </div>
    </div>
  );
};
