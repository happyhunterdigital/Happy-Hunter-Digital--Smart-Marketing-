// src/components/Lightbox.tsx
import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  images: { src: string; caption?: string; before?: string; after?: string }[];
  initialIndex: number;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ images, initialIndex, onClose }) => {
  const [current, setCurrent] = useState(initialIndex);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  const navigate = (dir: number) => {
    setDirection(dir);
    setCurrent(prev => {
      const next = prev + dir;
      if (next < 0) return images.length - 1;
      if (next >= images.length) return 0;
      return next;
    });
  };

  const item = images[current];

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-center justify-center">
      <button onClick={onClose} className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10">
        <X size={24} />
      </button>

      {images.length > 1 && (
        <>
          <button onClick={() => navigate(-1)} className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <button onClick={() => navigate(1)} className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
            <ChevronRight size={24} />
          </button>
        </>
      )}

      <div className="max-w-5xl w-full mx-6 transition-all duration-500" style={{ transform: direction === 0 ? 'translateX(0)' : direction > 0 ? 'translateX(-20px)' : 'translateX(20px)', opacity: 1 }}>
        {item.before && item.after ? (
          <BeforeAfter before={item.before} after={item.after} />
        ) : (
          <img src={item.src} alt={item.caption} className="w-full rounded-2xl shadow-2xl" />
        )}
        {item.caption && <p className="text-center text-gray-400 mt-4 text-sm">{item.caption}</p>}
      </div>
    </div>
  );
};

const BeforeAfter: React.FC<{ before: string; after: string }> = ({ before, after }) => {
  const [slider, setSlider] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = ((clientX - rect.left) / rect.width) * 100;
    setSlider(Math.max(5, Math.min(95, x)));
  };

  return (
    <div
      className="relative w-full aspect-video rounded-2xl overflow-hidden cursor-ew-resize select-none"
      onMouseMove={handleMove} onMouseUp={() => setIsDragging(false)} onMouseLeave={() => setIsDragging(false)} onMouseDown={() => setIsDragging(true)}
      onTouchMove={handleMove} onTouchStart={() => setIsDragging(true)} onTouchEnd={() => setIsDragging(false)}
    >
      <img src={after} alt="After" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - slider}% 0 0)` }}>
        <img src={before} alt="Before" className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize" style={{ left: `${slider}%`, transform: 'translateX(-50%)' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
          <div className="flex gap-0.5">
            <div className="w-0.5 h-4 bg-gray-400" />
            <div className="w-0.5 h-4 bg-gray-400" />
          </div>
        </div>
      </div>
      <span className="absolute top-4 left-4 px-3 py-1 bg-black/50 rounded-lg text-xs text-white font-bold">Before</span>
      <span className="absolute top-4 right-4 px-3 py-1 bg-amber-500/80 rounded-lg text-xs text-black font-bold">After</span>
    </div>
  );
};
