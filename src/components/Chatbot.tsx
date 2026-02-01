import { useState } from 'react';
import { MessageSquare, X, ShieldCheck } from 'lucide-react';

export const Chatbot = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button onClick={() => setOpen(!open)} className="bg-brand-gold p-4 rounded-full shadow-2xl hover:scale-110 transition-all border-2 border-brand-black">
        {open ? <X className="text-brand-black" /> : <MessageSquare className="text-brand-black" />}
      </button>
      {open && (
        <div className="bg-white w-85 h-[450px] absolute bottom-20 right-0 rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-brand-black text-white p-4 flex items-center gap-2">
            <ShieldCheck className="text-brand-gold" size={18} />
            <span className="font-bold text-sm">Entity Guardian</span>
          </div>
          <div className="flex-1 p-4 bg-gray-50 text-brand-black text-sm">
            <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
              System Operational. How can I help you survive the AI Filter today?
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
