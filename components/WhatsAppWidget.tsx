import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppWidget = () => {
  const phoneNumber = "27601016673"; 
  const message = "Hi Happy Hunter, I'm interested in the 2026 Strategy Audit.";
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 left-6 z-50 flex items-center justify-center bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 hover:bg-[#20bd5a] group" aria-label="Chat on WhatsApp">
      <MessageCircle size={28} fill="white" className="text-white" />
      <span className="absolute left-full ml-4 bg-gray-900 text-white text-xs font-bold px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">WhatsApp Us</span>
    </a>
  );
};
