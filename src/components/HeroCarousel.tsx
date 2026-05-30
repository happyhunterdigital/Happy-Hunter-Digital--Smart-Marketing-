// src/components/HeroCarousel.tsx
import React, { useState, useEffect, useRef } from 'react';

export interface HeroSlide {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
  bgType: 'video' | 'image';
  bgUrl: string;
  overlayElement?: React.ReactNode;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  autoPlaySpeed?: number;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  slides,
  autoPlaySpeed = 6000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    setProgress(0);
    startTime.current = Date.now();

    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, autoPlaySpeed);

    let animationFrameId = requestAnimationFrame(function updateProgress() {
      const elapsed = Date.now() - startTime.current;
      const currentProgress = Math.min((elapsed / autoPlaySpeed) * 100, 100);
      setProgress(currentProgress);
      if (elapsed < autoPlaySpeed) {
        animationFrameId = requestAnimationFrame(updateProgress);
      }
    });

    return () => {
      clearInterval(intervalId);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentIndex, slides.length, autoPlaySpeed]);

  const handleSegmentClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full h-[560px] bg-[#0a0a0f] rounded-3xl overflow-hidden font-sans select-none border border-white/5 shadow-2xl">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {slide.bgType === 'video' ? (
            <video
              src={slide.bgUrl}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <img
              src={slide.bgUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0fca] via-[#0a0a0f60] to-transparent z-10" />

          <div className="absolute inset-0 max-w-7xl mx-auto px-12 flex flex-col justify-center z-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full">
              <div className="lg:col-span-7 flex flex-col justify-center text-white pr-4">
                <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tight leading-none text-[#f3f4f6] mb-4 max-w-xl text-balance">
                  {slide.title}
                </h1>
                <p className="text-base text-[#9ca3af] font-normal leading-relaxed mb-8 max-w-lg">
                  {slide.description}
                </p>
                <div>
                  <button
                    onClick={slide.onButtonClick}
                    className="inline-flex items-center justify-center px-6 py-3 text-xs font-bold uppercase tracking-widest bg-[#f3f4f6] text-[#0b0b0c] rounded-xl hover:bg-amber-500 transition-all duration-200 shadow-md hover:scale-105"
                  >
                    {slide.buttonText}
                  </button>
                </div>
              </div>

              {slide.overlayElement && (
                <div className="hidden lg:col-span-5 lg:flex justify-end items-center">
                  {slide.overlayElement}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-10 left-12 z-30 flex items-center gap-2 w-[280px]">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => handleSegmentClick(index)}
            className="h-1 flex-1 bg-[#ffffff33] rounded-full overflow-hidden cursor-pointer relative"
          >
            {index === currentIndex && (
              <div
                className="h-full bg-amber-500 rounded-full transition-all ease-linear duration-100"
                style={{ width: `${progress}%` }}
              />
            )}
            {index < currentIndex && (
              <div className="h-full w-full bg-amber-500 rounded-full" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
