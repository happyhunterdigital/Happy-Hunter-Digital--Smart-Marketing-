import React from 'react';

const WhatsAppIcon = () => (
  <svg viewBox="0 0 32 32" fill="currentColor" width="26" height="26">
    <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.132 6.744 3.058 9.374L1.054 31.2l6.062-1.958A15.907 15.907 0 0 0 16.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.326 22.602c-.39 1.1-1.932 2.014-3.168 2.27-.84.174-1.936.312-5.622-1.206-4.716-1.938-7.744-6.71-7.978-7.024-.226-.314-1.896-2.522-1.896-4.812 0-2.29 1.2-3.414 1.628-3.874.39-.42.922-.542 1.228-.542.15 0 .282.008.402.014.4.018.6.042.86.646.33.762 1.13 2.73 1.228 2.926.098.196.196.468.064.742-.13.282-.196.456-.39.7-.196.246-.39.55-.576.884-.164.282-.348.586-.146.912.2.326.89 1.47 1.91 2.382 1.312 1.172 2.418 1.534 2.788 1.7.37.164.59.136.808-.082.22-.218.934-1.09 1.184-1.464.246-.374.494-.312.834-.186.34.128 2.158 1.02 2.528 1.206.37.188.616.282.71.438.094.156.094.904-.296 1.806z"/>
  </svg>
);

export const WhatsAppButton: React.FC = () => (
  <a
    href="https://wa.me/27601016673?text=Hi%20Thabo%2C%20I%27d%20like%20to%20learn%20more%20about%20your%20services."
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat with us on WhatsApp"
    className="fixed bottom-6 left-6 z-[150] bg-[#25D366] text-white p-0 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:scale-110 transition-transform w-14 h-14 flex items-center justify-center group"
  >
    <WhatsAppIcon />
    <span className="absolute left-full ml-3 px-3 py-1.5 bg-white text-black text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
      Chat on WhatsApp
    </span>
  </a>
);
