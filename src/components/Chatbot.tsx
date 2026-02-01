import { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';

export const Chatbot = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button onClick={() => setOpen(!open)} className="bg-brand-gold p-4 rounded-full shadow-xl">
        {open ? <X /> : <MessageSquare />}
      </button>
      {open && (
        <div className="bg-white w-80 h-96 absolute bottom-16 right-0 rounded-xl shadow-2xl p-4 text-black">
          <p className="font-bold border-b pb-2">Hunter Entity Assistant</p>
          <p className="mt-4 text-sm text-gray-600">How can I help you survive the AI Filter?</p>
        </div>
      )}
    </div>
  );
};
