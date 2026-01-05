import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppWidget = () => {
  // --- 3. YOUR CORRECT NUMBER ---
  const phoneNumber = "27601016673"; 
  const message = "Hello! I'm interested in getting my business noticed and trusted on Google.";

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      // Fixed: Z-index 50 ensures it sits above other content
      className="fixed bottom-24 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 group flex items-center gap-2"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={24} className="text-white" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap">
        Chat on WhatsApp
      </span>
    </button>
  );
};
