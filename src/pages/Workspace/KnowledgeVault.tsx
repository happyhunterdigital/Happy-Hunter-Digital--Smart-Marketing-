import React, { useState, useEffect } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

interface VaultProps {
  activeWorkspace: any;
}

export const KnowledgeVault: React.FC<VaultProps> = ({ activeWorkspace }) => {
  const [docs, setDocs] = useState({
    brandVoice: '',
    techSpec: '',
    roadmap: ''
  });

  useEffect(() => {
    if (activeWorkspace) {
      setDocs({
        brandVoice: activeWorkspace.brandVoice || '',
        techSpec: activeWorkspace.techSpec || '',
        roadmap: activeWorkspace.roadmap || ''
      });
    }
  }, [activeWorkspace]);

  const handleUpdate = async (field: string, value: string) => {
    setDocs(prev => ({ ...prev, [field]: value }));
    if (!activeWorkspace) return;
    await updateDoc(doc(db, 'workspaces', activeWorkspace.id), { [field]: value });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {[
        { id: 'brandVoice', title: 'Brand Voice', subtitle: 'SMM Pipeline' },
        { id: 'techSpec', title: 'Technical Spec', subtitle: 'Developer Backlog' },
        { id: 'roadmap', title: 'Roadmap', subtitle: 'Strategic Growth' }
      ].map(d => (
        <div key={d.id} className="bg-black/40 border border-gray-900 rounded-3xl p-8 flex flex-col h-[600px]">
          <div className="mb-6">
            <h3 className="text-xl font-black uppercase">{d.title}</h3>
            <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest">{d.subtitle}</p>
          </div>
          <textarea 
            value={docs[d.id as keyof typeof docs]} 
            onChange={(e) => handleUpdate(d.id, e.target.value)}
            placeholder={`Define the ${d.title.toLowerCase()} here...`}
            className="flex-1 bg-black/30 border border-gray-800 p-6 rounded-2xl text-sm text-gray-400 font-medium leading-relaxed outline-none focus:border-yellow-500/50 transition-all resize-none custom-scrollbar"
          />
        </div>
      ))}
    </div>
  );
};
