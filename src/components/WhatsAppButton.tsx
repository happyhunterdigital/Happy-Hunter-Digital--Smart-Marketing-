import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => (
  <a
    href="https://wa.me/27601016673?text=Hi%20Thabo%2C%20I%27d%20like%20to%20learn%20more%20about%20your%20services."
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat with us on WhatsApp"
    className="fixed bottom-6 left-6 z-[150] bg-[#25D366] text-white p-0 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:scale-110 transition-transform w-14 h-14 flex items-center justify-center group"
  >
    <MessageCircle size={26} className="group-hover:scale-110 transition-transform" />
    <span className="absolute left-full ml-3 px-3 py-1.5 bg-white text-black text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
      Chat on WhatsApp
    </span>
  </a>
);
