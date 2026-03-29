// src/components/Audit/AudioBriefing.tsx
import React, { useState, useEffect } from 'react';
import { Play, Square, Volume2 } from 'lucide-react';

interface AudioBriefingProps {
  score: number;
  summary: string;
  bizName: string;
}

export const AudioBriefing: React.FC<AudioBriefingProps> = ({ score, summary, bizName }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const text = `Agentic Briefing for ${bizName}. Your digital survival score is ${score} out of 100. ${summary}. End of briefing.`;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.1; // Slightly faster for a futuristic feel
    u.pitch = 1.0;
    
    u.onend = () => setIsPlaying(false);
    setUtterance(u);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [score, summary, bizName]);

  const handlePlay = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else if (utterance) {
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  return (
    <div className="bg-black border border-yellow-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-neural-glow mb-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
          <Volume2 className="text-yellow-500 animate-pulse-fast" size={24} />
        </div>
        <div>
          <h4 className="text-white font-black uppercase tracking-widest text-sm mb-1">Executive Audio Briefing</h4>
          <p className="text-gray-500 text-[10px] uppercase tracking-widest font-mono">Multimodal Diagnostics Active</p>
        </div>
      </div>
      
      <button 
        onClick={handlePlay} 
        className="w-full sm:w-auto bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-white transition-all"
      >
        {isPlaying ? <><Square size={14} /> Stop Briefing</> : <><Play size={14} /> Play Briefing</>}
      </button>
    </div>
  );
};
